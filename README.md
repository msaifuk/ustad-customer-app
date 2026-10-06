Ustad — Customer App

Mobile app for customers of Ustad, a home-services marketplace for Pakistan. Customers pick a service (electrician, plumber, AC technician, painter and more), book it at a fixed price, and track the job until it is completed and rated.

Ustad's core idea: a career path for tradespeople. Workers progress from Hunarmand to Legend as they complete jobs, earning lower commission and real benefits. This app is the customer side of that platform.

Demo
Demo video: add link here
Screenshots: add screenshots/home.png, screenshots/my-bookings.png, screenshots/rate-worker.png
Features
Register and log in (JWT authentication)
Browse services grouped by trade, with fixed prices and durations
Book a service; a verified, online worker of the matching trade is assigned automatically
My Bookings with live status: Pending, Accepted, On the way, Arrived, In progress, Completed
Rate the worker after a completed job; the worker's average rating updates automatically
Tech stack
React Native with Expo (SDK 54) and Expo Router
Axios for API calls, React Context for auth state
Node.js / Express / PostgreSQL backend deployed on Railway (separate repo, private)
Built as an installable Android APK with EAS Build
Project structure
app/
  _layout.tsx          Navigation and auth gate
  context/AuthContext.js
  utils/api.js         API base URL (the Railway backend)
  screens/
    LoginScreen.js
    RegisterScreen.js
    HomeScreen.js
    BookServiceScreen.js
    MyBookingsScreen.js
    RateWorkerScreen.js
Run locally
bash
npm install
npx expo start --clear

Scan the QR code with Expo Go (SDK 54). The app talks to the production API configured in app/utils/api.js. Change BASE_URL there to point at a local backend.

Build an Android APK
bash
eas build --platform android --profile preview

The preview profile in eas.json produces an installable .apk. Package name: com.msaifuk.ustad.

Current limitations
Workers are matched by trade only; GPS-based nearest-worker matching is not built yet
No push notifications yet (status is seen by opening the app)
If no worker of the right trade is online, the booking stays unassigned
Payment is cash to the worker at the job; no in-app payments
Only tested on Android
Related repositories
ustad-worker-app — app for tradespeople
ustad-admin-dashboard — admin web dashboard
ustad-backend — Node.js API (private; available on request)

Built by @msaifuk.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
