const BASE_URL = 'https://nonfss.geniusconsultant.com/IFBiOSApi/api';

const API = {
  LOGIN_GCL: (loginID, password, imei, securityCode, deviceID, deviceType) =>
    `${BASE_URL}/GCLAuthenticateWithEncryption?LoginID=${encodeURIComponent(
      loginID
    )}&password=${encodeURIComponent(
      password
    )}&IMEI=${encodeURIComponent(
      imei
    )}&SecurityCode=${encodeURIComponent(
      securityCode
    )}&DeviceID=${encodeURIComponent(
      deviceID
    )}&DeviceType=${encodeURIComponent(deviceType)}`,


  FETCH_ATTENDANCE: (loginID, financialYear, month, reportType, securityCode) =>
    `${BASE_URL}/SelfAttendance?LoginID=${encodeURIComponent(
      loginID
    )}&FinancialYear=${encodeURIComponent(
      financialYear
    )}&Month=${encodeURIComponent(
      month
    )}&ReportType=${reportType}&SecurityCode=${encodeURIComponent(securityCode)}`,
};

  // Add more endpoints here as needed


export default API;