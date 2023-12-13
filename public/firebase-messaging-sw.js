// Scripts for firebase and firebase messaging
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyB12OZbgQA8VpCSAYrgytTJkUexafwiN74",
  authDomain: "sapp-develop.firebaseapp.com",
  projectId: "sapp-develop",
  storageBucket: "sapp-develop.appspot.com",
  messagingSenderId: "579391570124",
  appId: "1:579391570124:web:ed5e7c72474edf434bc269"
}

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig)

// Retrieve firebase messaging
// eslint-disable-next-line no-undef
const messaging = firebase.messaging()

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload)

  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
  };

  // eslint-disable-next-line no-restricted-globals
  self.registration.showNotification(notificationTitle,
    notificationOptions);
})