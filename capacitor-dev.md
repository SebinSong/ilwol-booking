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


## 3. Steps for launching 'live-reload' app with android device.

3-1. IMPORTANT!!
Go to `AndroidMainfest.xml` file and on the <application> tag, specify `android:usesCleartextTraffic="true"` on it.

3-2. In `capacitor.config.json` file, add below section:

```js
"server": {
  "url": "http://localhost:3000",
  "cleartext": true
}
```

3-3. Run `npx cap sync android` command.

3-4. Connect my android device to my Mac. Make sure Mac recognise the device.

3-5. Launch the GI dev-server by running `grunt dev`

3-6. On another command shell, run `adb reverse port:3000 port:3000`. This sets up _reverse port forwarding_ between my android device and my development computer(Mac). -
Any application on the Android device that tries to connect to `localhost:3000` (on the device) will have its traffic automatically redirected to `localhost:3000` on your computer. This is extremely useful for testing and debugging mobile applications that need to communicate with a backend server running locally on your development machine.

If `adb`(Android Debug Bridge) is not installed yet, use homebrew to download and install it on the machine.

## 4. live-reload mode with iOS simulator
There is no reverse port forwarding step required for developing with iOS emulator. (iOS simulator runs as a process directly on your macOS networking stack. It shares your Mac's localhost automatically.) But it does require some `clearText: true` equvalent task. Go to `Info.plist` file and add:

```html
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
  <key>NSAllowsLocalNetworking</key>
  <true/>
</dict>
```

at the end of the top level `<dict>` tag.

Adding
```js
"server": {
  "url": "http://localhost:3000",
  "cleartext": true
}
```
and running `npx cap sync ios` ->
run `npx cap open ios` ->
run `grunt dev` ->
Press the play button in the Xcode to launch the iOS emulator and the app

will do.
