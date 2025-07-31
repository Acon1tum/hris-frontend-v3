export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  // apiUrl: 'https://hris-backend-v4.onrender.com/api',
  appName: 'HRIS System',
  version: '1.0.0',
  features: {
    enableLogging: true,
    enableDebugMode: true,
    enableMockData: false
  },
  auth: {
    tokenKey: 'hris_token',
    refreshTokenKey: 'hris_refresh_token',
    userKey: 'hris_user'
  },
  session: {
    inactivityTimeout: 60 * 60 * 1000, // 30 minutes in milliseconds
    warningTime: 1 * 60 * 1000, // 5 minutes warning before logout
    checkInterval: 1000 // Check every second
  },
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 25, 50, 100]
  },
  upload: {
    maxFileSize: 10485760, // 10MB
    allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']
  }
}; 