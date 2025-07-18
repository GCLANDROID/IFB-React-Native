import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';


const AttendanceManage = () => {
  const location = {
    latitude: 22.5769,  // Mother's Wax Museum location
    longitude: 88.4347,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  return (
    <View style={styles.container}>
      {/* Map View */}
      <View style={{ flex: 2 }}>
        <MapView style={styles.map} initialRegion={location}>
          <Marker coordinate={location} title="Mother's Wax Museum" />
        </MapView>

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
            HFXC+RVJ, Kadampukur Village, Newtown, New Town, Ghuni, West Bengal 700156
          </Text>
        </View>

        {/* Fingerprint + Attendance Text */}
        <TouchableOpacity style={styles.fingerprintContainer}>
          <Image
            source={require('../../asset/fingerprint-scanner.gif')} // Replace with your fingerprint icon
            style={styles.fingerprint}
          />
          <Text style={styles.attendanceText}>Mark{'\n'}Your Attendance</Text>
        </TouchableOpacity>

        {/* Attendance Report Button */}
        <TouchableOpacity style={styles.reportButton}>
          <Text style={styles.reportText}>Attendance Report</Text>
          <View style={styles.backArrowbg}>
            <Image
            source={require('../../asset/back-arrow.png')} // Replace with your fingerprint icon
            style={styles.backArrow}
          />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: {
    width: '100%',
    height: '100%',
  },
  bottomContainer: {
   borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  backgroundColor: '#fff', // Important
  padding: 20,
  position: 'absolute', // ✅ To overlay on the map
  bottom: 0,
  left: 0,
  right: 0,
  height: '44%', // Adjust as needed
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
    fontWeight:"700",
    fontSize: 16,
    color: '#af0909ff',
    marginBottom:5,
    marginLeft:35
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
   marker: {
    width: 30,
    height: 30,
    
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginRight: 8,
  },
  backArrowbg:{
    width:40,
    height:40,
    borderRadius:10,
    backgroundColor:'#FFFFFF',
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'flex-end',
    
  },
  backArrow:{
    height:30,
    width:30
  }
});

export default AttendanceManage;
