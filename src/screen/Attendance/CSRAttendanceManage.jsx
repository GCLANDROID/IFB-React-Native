import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, PermissionsAndroid, Alert, Modal, StatusBar, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import { launchCamera } from 'react-native-image-picker';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { useNavigation } from '@react-navigation/native';
// ✅ Adjust path as needed
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../util/API';
import { Loader } from '../../util/Loader';
import DeviceInfo from 'react-native-device-info';

Geocoder.init('AIzaSyBuxUn1s4S2yv8fqwd0wGUTFegxNyASL1g');



const CSRAttendanceManage = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('Fetching address......');
  const [modalVisible, setModalVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [attendanceEnabled, setAttendanceEnabled] = useState(true);
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [forgotReason, setForgotReason] = useState('');
  const [lastWorkingDate, setLastWorkingDate] = useState('');
  const [shiftOverTime, setShiftOverTime] = useState('');
  const [checkTime, setCheckTime] = useState('');
  const [counterModalVisible, setCounterModalVisible] = useState(false);
  const [workStatusFlag, setWorkStatusFlag] = useState('');
  const [workStatus, setWorkStatus] = useState('Own Mapped Counter');

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera to take attendance pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };
  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required to take a photo.');
      return;
    }

    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        saveToPhotos: true,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          console.log('Camera error:', response.errorMessage);
        } else {
          const source = { uri: response.assets[0].uri };
          setCapturedImage(source);
        }
      }
    );
  };

  useEffect(() => {
    const getLocation = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This app needs access to your location to mark attendance.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );

          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert('Permission Denied', 'Location permission is required.');
            return;
          }
        } else {
          Geolocation.requestAuthorization();
          // const permission = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
          // if (permission !== RESULTS.GRANTED) {
          //   Alert.alert('Permission Denied', 'Location permission is required.');
          //   return;
          // }
          // iOS only
        }

        // Now get location
        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({
              latitude,
              longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            });

            Geocoder.from(latitude, longitude)
              .then((json) => {
                if (json.results.length > 0) {
                  const address = json.results[0].formatted_address;
                  setAddress(address);
                } else {
                  setAddress('Address not found');
                }
              })
              .catch((error) => {
                console.warn('❌ Geocoding error:', error);
                setAddress('Unable to get address');
              });
          },
          (error) => {
            console.warn('❌ Error getting location:', error);
            setAddress('Unable to get location');
          },
          {
            enableHighAccuracy: false,
            timeout: 35000,
            maximumAge: 10000,
          }
        );
      } catch (err) {
        console.warn('❌ Permission or location error:', err);
      }
    };
    fetchTodayAttendance();
    checkLoginStatus();

    getLocation();
  }, []);


  const checkLoginStatus = async () => {
    setLoading(true);
    try {
      const empId = await AsyncStorage.getItem('UserID');
      const securityCode = await AsyncStorage.getItem('SecurityCode');

      const response = await axios.get(API.CHECK_REGULARIZE(
        empId,
        securityCode

      ));

      console.log('LoginCheck Response:', response.data);

      if (response.data?.responseData?.length > 0) {
        const obj = response.data.responseData[0];
        const returnVal = obj.ReturnVal;
        const lastDate = obj.LastworkingDt;
        setLastWorkingDate(lastDate);

        if (returnVal === 22) {
          setAttendanceEnabled(false);

          Alert.alert(
            'Alert',
            `Checkout has not been recorded within the stipulated shift duration on ${lastDate}`,
            [
              { text: 'Forgot to Checkout', onPress: () => setForgotModalVisible(true), }
            ]
          );
        }

        else if (returnVal === 23) {
          setAttendanceEnabled(false);

          Alert.alert(
            'Alert',
            'You have repeatedly not marked check out and exceeded missed check-out regularisation limits.',
            [
              { text: 'I accept and Continue', onPress: () => setAttendanceEnabled(true) }
            ]
          );
        }

        else if (returnVal === 0) {
          setAttendanceEnabled(true);
        }
      }

    } catch (error) {
      console.error('LoginCheck API error:', error);
    } finally {
      setLoading(false);
    }
  };


  const submitRegularise = async () => {
    if (!forgotReason.trim()) {
      Alert.alert('Alert', 'Please enter reason');
      return;
    }

    try {
      setLoading(true);

      const loginID = await AsyncStorage.getItem('UserID');
      const securityCode = await AsyncStorage.getItem('SecurityCode');



      const response = await axios.get(API.POST_REGULARIZE(
        loginID,
        lastWorkingDate,
        forgotReason,
        1,
        securityCode

      ));

      console.log('Regularise Response:', response.data);

      if (response.data?.responseStatus === true) {
        Alert.alert('Success', response.data.responseText || 'Request submitted');

        setForgotModalVisible(false);
        setForgotReason('');

        // ✅ Call again after success
        checkLoginStatus();
      } else {
        Alert.alert('Failed', response.data?.responseText || 'Request failed');
      }

    } catch (error) {
      console.error('Regularise error:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };


  const markAttendance = async (flagOverride, statusOverride) => {
    if (!location) {
      Alert.alert('Error', 'Location not available');
      return;
    }
    if (!capturedImage) {
      Alert.alert('Error', 'Please capture an image first.');
      return;
    }

    try {
      setLoading(true);

      // Fetch stored user/session data
      const loginID = await AsyncStorage.getItem('UserID');
      const password = await AsyncStorage.getItem('Password');
      const clientID = await AsyncStorage.getItem('ClientID');
      const securityCode = await AsyncStorage.getItem('SecurityCode');

      const deviceName = Platform.OS; // Or use react-native-device-info
      const counterid = await AsyncStorage.getItem('SalesPointID');
      const android_id = await DeviceInfo.getUniqueId();

      const payload = {
        ClientID: clientID,
        LoginID: loginID,
        Password: password,
        Address: address,
        Longitude: location.longitude,
        Latitude: location.latitude,
        IMEI: android_id,
        DeviceID: android_id,
        DeviceName: deviceName,
        SalesPointID: counterid || "0",
        Counter_Type: statusOverride || workStatus || "NA",
        Counter_Type_Flag: flagOverride || workStatusFlag || "0",
        SecurityCode: securityCode,
      };

      console.log("📦 Mark Attendance Payload:", payload);


      // Create form data
      const formData = new FormData();
      formData.append("ClientID", clientID);
      formData.append("LoginID", loginID);
      formData.append("Password", password);
      formData.append("Address", address);
      formData.append("Longitude", location.longitude.toString());
      formData.append("Latitude", location.latitude.toString());
      formData.append("IMEI", android_id);
      formData.append("DeviceID", android_id);
      formData.append("DeviceName", deviceName);
      formData.append("SalesPoin_Longitude", "0");
      formData.append("SalesPoint_Latitude", "0");
      formData.append("Attendance_Distance_GAP", "0");
      formData.append("SalesPointID", counterid || "0");
      formData.append("Counter_Type", statusOverride || workStatus || "NA");
      formData.append("Counter_Type_Flag", flagOverride || workStatusFlag || "0");
      formData.append("SecurityCode", securityCode);

      // Image file
      formData.append("Imagefile", {
        uri: capturedImage.uri,
        name: "attendance.jpg",
        type: "image/jpeg",
      });

      const response = await axios.post(
        API.POST_ATTENDANCE_WITH_SELFIE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLoading(false);

      if (response?.data?.responseStatus === true) {
        Alert.alert("✅ Success", "Attendance marked successfully.", [
          {
            text: "OK",
            onPress: () => navigation.replace("AttendanceReport"), // 👈 navigate to Report screen
          },
        ]);
        setModalVisible(false);
      } else {
        const msg = response?.data?.responseText || '';

        if (msg.toLowerCase().includes('counter area')) {
          // ✅ Open special modal
          setCounterModalVisible(true);
        } else {
          Alert.alert("❌ Failed", msg || "Failed to mark attendance.");
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("API Error:", error);
      Alert.alert("Error", "Something went wrong while marking attendance.");
    }
  };

  const fetchTodayAttendance = async () => {
    try {

      const loginID = await AsyncStorage.getItem('UserID');
      const securityCode = await AsyncStorage.getItem('SecurityCode');

      const response = await axios.get(API.FETCH_LOGINTIME(
        loginID,
        securityCode

      ));
      console.log('TIME API response:', response);



      if (response.data?.responseStatus === true) {
        const data = Array.isArray(response.data.responseData)
          ? response.data.responseData[0]
          : response.data.responseData;

        const checkInTime = data?.Time;

        console.log('Check-in Time:', checkInTime); // debug

        if (checkInTime) {
          setCheckTime(checkInTime);
          const overtime = calculateShiftOverTime(checkInTime);
          await AsyncStorage.setItem('checkInTime', checkInTime);
          await AsyncStorage.setItem('overTime', overtime);
        } else {
          await AsyncStorage.setItem('checkInTime', "");
          await AsyncStorage.setItem('overTime', "");
        }
      }


    } catch (err) {
      console.log('Attendance API error:', err);
    } finally {

    }
  };


  const calculateShiftOverTime = (timeStr) => {
    try {
      if (!timeStr) return '';

      // Supports "10:15" or "10:15:00"
      const parts = timeStr.split(':');
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);

      if (isNaN(hours) || isNaN(minutes)) return '';

      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      date.setSeconds(0);

      // Add 9 hours shift
      date.setHours(date.getHours() + 9);

      // Format nicely (07:15 PM)
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch (e) {
      console.log('Time parse error:', e);
      return '';
    }
  };




  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FF0020' }}>
        <View style={{ flex: 1, backgroundColor: '#FF0020', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
          <StatusBar backgroundColor="#FF0020" barStyle="dark-content" />
          <View style={styles.container}>
            {loading && <Loader />}
            <View style={styles.toolheader}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image source={require('../../asset/back-icon.png')} style={styles.headerIcon}></Image>
              </TouchableOpacity>
              <TouchableOpacity>
                <Image source={require('../../asset/home-icon.png')} style={styles.headerIcon}></Image>
              </TouchableOpacity>

            </View>
            {/* Map View */}
            <View style={{ flex: 2 }}>
              {location && (
                <MapView style={styles.map} region={location}>
                  <Marker coordinate={location} title="Your Location" />
                </MapView>
              )}

            </View>

            {/* Bottom Section */}
            <View style={styles.bottomContainer}>
              {/* Location Details */}
              <Text style={styles.locationTitleText}>
                Location
              </Text>
              <View style={styles.locationRow}>
                <Image
                  source={require('../../asset/placeholder.gif')} // Replace with your fingerprint icon
                  style={styles.marker}
                />
                <Text style={styles.locationText}>
                  {address}
                </Text>
              </View>

              {/* Fingerprint + Attendance Text */}

              {!checkTime ? (
                <TouchableOpacity
                  style={[
                    styles.fingerprintContainer,
                    { opacity: attendanceEnabled ? 1 : 0.4 }
                  ]}
                  onPress={() => {
                    if (!attendanceEnabled) {
                      Alert.alert(
                        'Alert',
                        'Previous day attendance must be regularized before today’s check-in.',
                        [{ text: 'OK' }]
                      );
                      return;
                    }

                    setModalVisible(true);
                  }}
                >
                  <Image
                    source={require('../../asset/fingerprint-scanner.gif')} // Replace with your fingerprint icon
                    style={styles.fingerprint}
                  />
                  <Text style={styles.attendanceText}>Check In</Text>
                </TouchableOpacity>
              ) : null}

              {checkTime ? (
                <TouchableOpacity
                  style={[
                    styles.fingerprintContainer,
                    { opacity: attendanceEnabled ? 1 : 0.4 }
                  ]}
                  onPress={() => {
                    if (!attendanceEnabled) {
                      Alert.alert(
                        'Alert',
                        'Previous day attendance must be regularized before today’s check-in.',
                        [{ text: 'OK' }]
                      );
                      return;
                    }

                    setModalVisible(true);
                  }}
                >
                  <Image
                    source={require('../../asset/fingerprint-scanner.gif')} // Replace with your fingerprint icon
                    style={styles.fingerprint}
                  />
                  <Text style={styles.attendanceText}>Check Out</Text>
                </TouchableOpacity>
              ) : null}

              {/* Attendance Report Button */}

              <View style={{ height: 40 }}></View>
            </View>

            <Modal visible={modalVisible} transparent animationType="fade">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.closeButton}>
                    <View style={styles.closeCircle}>
                      <Image
                        source={require('../../asset/cross.png')}
                        style={styles.closeicon}
                      />
                    </View>
                  </TouchableOpacity>




                  <View style={styles.header}>
                    <Text style={styles.headerTitle}>Capture Image</Text>

                  </View>
                  <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={openCamera}>
                      <Image
                        source={require('../../asset/camera.png')}
                        style={styles.camera}
                      />
                    </TouchableOpacity>
                    <Image
                      source={capturedImage || require('../../asset/noimage.png')} // Replace with your fingerprint icon
                      style={[styles.captureImage, { marginLeft: 20 }]}
                    />

                  </View>
                  <TouchableOpacity style={[styles.reportButton, { marginTop: 20 }]}  onPress={() => markAttendance("0", "Own Mapped Counter")}>
                    <Text style={styles.attenMarkText}>Mark Your Attendance</Text>
                  </TouchableOpacity>





                </View>
              </View>
            </Modal>

            <Modal
              visible={forgotModalVisible}
              transparent
              animationType="fade"
            >
              <View style={styles.modalOverlay}>
                <View style={[styles.modalContainer, { height: 260 }]}>



                  <Text style={{ marginVertical: 10, color: '#444', fontSize: 16, fontWeight: '600' }}>
                    Please enter the reason
                  </Text>

                  <TextInput
                    style={{
                      width: '90%',
                      borderWidth: 1,
                      borderColor: '#ccc',
                      borderRadius: 8,
                      padding: 10,
                      minHeight: 80,
                      textAlignVertical: 'top',
                    }}
                    placeholder="Enter reason..."
                    multiline
                    value={forgotReason}
                    onChangeText={setForgotReason}
                  />

                  <TouchableOpacity
                    style={[styles.reportButton, { marginTop: 20, width: '90%' }]}
                    onPress={() => {
                      if (!forgotReason.trim()) {
                        Alert.alert('Alert', 'Please enter reason');
                        return;
                      }

                      console.log('Reason:', forgotReason);
                      Alert.alert('Success', 'Request submitted');
                      submitRegularise();
                    }}
                  >
                    <Text style={styles.attenMarkText}>Submit</Text>
                  </TouchableOpacity>

                </View>
              </View>
            </Modal>


            <Modal
              visible={counterModalVisible}
              transparent
              animationType="fade"
            >
              <View style={styles.modalOverlay}>
                <View style={[styles.modalContainer, { height: 320 }]}>

                  <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 20, color: "#a10a0a" }}>
                    You are out of your designated counter area.
                  </Text>

                  <Text style={{ marginVertical: 10 }}>
                    Please choose reason:
                  </Text>

                  {/* Option 1 */}
                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => {
                      setWorkStatusFlag("2");
                      setWorkStatus("IFB Meet – Training");
                      setCounterModalVisible(false);
                      markAttendance("2", "IFB Meet – Training");
                    }}
                  >
                    <Text style={styles.optionText}>IFB Meet – Training</Text>
                  </TouchableOpacity>

                  {/* Option 2 */}
                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => {
                      setWorkStatusFlag("3");
                      setCounterModalVisible(false);
                      setWorkStatus("Branch Office – Training");
                     markAttendance("3", "Branch Office – Training");
                    }}
                  >
                    <Text style={styles.optionText}>Branch Office – Training</Text>
                  </TouchableOpacity>

                  {/* Option 3 */}
                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => {
                      setWorkStatusFlag("4");
                      setCounterModalVisible(false);
                      setWorkStatus("IFB Exhibitions");
                       markAttendance("4", "IFB Exhibitions");
                    }}
                  >
                    <Text style={styles.optionText}>IFB Exhibitions</Text>
                  </TouchableOpacity>

                </View>
              </View>
            </Modal>
          </View>
        </View>
      </SafeAreaView>

    </SafeAreaProvider>


  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: {
    width: '100%',
    height: '70%',
  },
  bottomContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    borderColor: '#00000012',
    backgroundColor: '#fff', // Important
    padding: 20,
    position: 'absolute', // ✅ To overlay on the map
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%', // Adjust as needed
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 20,
  },
  locationText: {
    flex: 1,
    fontSize: 13,
    color: '#444',
  },
  locationTitleText: {
    fontWeight: "700",
    fontSize: 16,
    color: '#af0909ff',
    marginBottom: 5,
    marginLeft: 35
  },
  fingerprintContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  fingerprint: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  camera: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  captureImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  marker: {
    width: 30,
    height: 30,
    bottom: 10

  },
  attendanceText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  reportButton: {
    flexDirection: 'row',
    backgroundColor: '#FF3B30',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginRight: 8,
  },
  attenMarkText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 5,

  },
  backArrowbg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',

  },
  backArrow: {
    height: 30,
    width: 30
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000040',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 50,
  },
  modalContainer: {
    height: 310,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '92%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.07, // 7% opacity
    shadowRadius: 18.5, // Half of 37px for similar blur effect
    elevation: 3,
    borderWidth: 1,
    borderColor: '#00000012'
  },
  closeButton: {
    position: 'absolute',
    top: -20,
    alignSelf: 'center',
  },
  closeCircle: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    backgroundColor: '#212121',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4, // Android only
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
    height: 46,
    paddingHorizontal: 20,
    backgroundColor: '#ECF7FF',
    width: '100%',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'OpenSans-SemiBold', // Assuming you have the semi-bold variant of Open Sans
    fontWeight: '600', // Or 'bold' depending on platform/font setup
    fontSize: 20,
    lineHeight: 20, // 100% of 20px; consider increasing for better readability
    letterSpacing: 0,
    marginRight: 10,
    color: '#212121',
  },
  closeicon: {
    height: 20,
    width: 20,
    tintColor: '#fff',
  },
  toolheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#FF0020',
    height: 60,
  },
  headerIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF'
  },

  optionButton: {
    width: '90%',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },

  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
});

export default CSRAttendanceManage;
