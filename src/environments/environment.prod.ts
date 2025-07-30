export const environment = {
  production: true,
  apiUrl: 'https://hris-backend-v4.onrender.com/api',
  appName: 'HRIS System',
  version: '1.0.0',
  features: {
    enableLogging: false,
    enableDebugMode: false,
    enableMockData: false
  },
  auth: {
    tokenKey: 'hris_token',
    refreshTokenKey: 'hris_refresh_token',
    userKey: 'hris_user'
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