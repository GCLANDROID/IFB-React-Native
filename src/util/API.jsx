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

  POST_ATTENDANCE: (loginID, password, clientID, securityCode, address, longitude, latitude) =>
    `${BASE_URL}/postEmployeeAttendance?LoginID=${encodeURIComponent(
      loginID
    )}&password=${encodeURIComponent(
      password
    )}&ClientID=${encodeURIComponent(
      clientID
    )}&SecurityCode=${encodeURIComponent(
      securityCode
    )}&Address=${encodeURIComponent(
      address
    )}&Longitude=${encodeURIComponent(
      longitude
    )}&Latitude=${encodeURIComponent(latitude)}`,

  POST_ATTENDANCE_WITH_SELFIE: `${BASE_URL}/post_EmployeeAttendanceWithSelfy_V2`,

  FETCH_NOTIFICATION: (loginID, securityCode, reportType) =>
    `${BASE_URL}/get_EmployeeNotificationInfo?AEMEmployeeID==${encodeURIComponent(
      loginID
    )}&SecurityCode=${securityCode}&Operation=${encodeURIComponent(reportType)}`,


  FETCH_DASHBOARD_REPORT: (ReferenceNo, UserID, FinancialYear, Month, Operation, SubOperation, securityCode) =>
    `${BASE_URL}/get_EmployeeSalesRefDetails?ReferenceNo=${encodeURIComponent(ReferenceNo)}&UserID=${encodeURIComponent(UserID)}&FinancialYear=${encodeURIComponent(FinancialYear)}&Month=${encodeURIComponent(Month)}&Operation=${encodeURIComponent(Operation)}&SubOperation=${encodeURIComponent(SubOperation)}&SecurityCode=${encodeURIComponent(securityCode)}`,

  FETCH_CATEGORY: (ModuleNo, ID, ID1, ID2, ID3, securityCode) =>
    `${BASE_URL}/CommonDDL?ModuleNo=${encodeURIComponent(ModuleNo)}&ID=${encodeURIComponent(ID)}&ID1=${encodeURIComponent(ID1)}&ID2=${encodeURIComponent(ID2)}&ID3=${encodeURIComponent(ID3)}&SecurityCode=${encodeURIComponent(securityCode)}`,

  FETCH_TITLE: (ModuleNo, ID, ID1, ID2, ID3, securityCode) =>
    `${BASE_URL}/CommonDDL?ModuleNo=${encodeURIComponent(ModuleNo)}&ID=${encodeURIComponent(ID)}&ID1=${encodeURIComponent(ID1)}&ID2=${encodeURIComponent(ID2)}&ID3=${encodeURIComponent(ID3)}&SecurityCode=${encodeURIComponent(securityCode)}`,

  FETCH_FINANCIAL_SCHEME: (ModuleNo, ID, ID1, ID2, ID3, securityCode) =>
    `${BASE_URL}/CommonDDL?ModuleNo=${encodeURIComponent(ModuleNo)}&ID=${encodeURIComponent(ID)}&ID1=${encodeURIComponent(ID1)}&ID2=${encodeURIComponent(ID2)}&ID3=${encodeURIComponent(ID3)}&SecurityCode=${encodeURIComponent(securityCode)}`,


  FETCH_MODEL: (ModuleNo, ID, ID1, ID2, ID3, securityCode) =>
    `${BASE_URL}/CommonDDL?ModuleNo=${encodeURIComponent(ModuleNo)}&ID=${encodeURIComponent(ID)}&ID1=${encodeURIComponent(ID1)}&ID2=${encodeURIComponent(ID2)}&ID3=${encodeURIComponent(ID3)}&SecurityCode=${encodeURIComponent(securityCode)}`,
};

// Add more endpoints here as needed


export default API;