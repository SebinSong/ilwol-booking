## 1. capacitor.config.json file content must be different depending on whether iOS or Android

- for iOS
{
  "appId": "com.ilwolbooking.www",
  "appName": "ilwol-booking",
  "webDir": "dist",
  "server": {
    "url": "http://localhost:5173",
    "cleartext": true
  }
}

- for Android (NOTE: using real-device instead of Android simulator)
{
  "appId": "com.ilwolbooking.www",
  "appName": "ilwol-booking",
  "webDir": "dist",
  "server": {
    "url": "http://192.168.88.2:5173",
    "cleartext": true,
    "androidScheme": "http"
  },
  "android": {
    "allowMixedContent": true
  }
}
