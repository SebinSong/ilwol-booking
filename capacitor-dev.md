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

## 2. "server" section in the config file

"server" section is there for enabling hot-reload in development mode and MUST be removed in production build/deployment.
* This tells the Capacitor native shell:
  - "Instead of loading the HTML/JS files bundled inside the app, open a browser window and point it to this live URL."
  - The Benefit: This enables Live Reload. When you change a React component on your Mac, the app on your iPhone updates instantly without you having to rebuild in Xcode.
  - The Requirement: Your Mac and iPhone must be on the same Wi-Fi, and your Vite dev server must be running on your Mac.

So, basically specifying things in this section enables live-reload server of development mode.
