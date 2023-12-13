import firebase from 'firebase/compat/app'
import 'firebase/compat/messaging'
// Scripts for firebase and firebase messaging
// eslint-disable-next-line no-undef
const self = (typeof window !== 'undefined' ? window : {}) as any;

self.importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
// eslint-disable-next-line no-undef
self.importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')

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
