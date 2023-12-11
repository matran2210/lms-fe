import { useEffect } from 'react'
import firebase from 'firebase/compat/app'
import 'firebase/compat/messaging'

const firebaseConfig = {
  apiKey: 'AIzaSyD6V1jz40e43S3XXsyAB6yRggWF2MLfRZE',
  authDomain: 'test-firebase-nextjs-757d9.firebaseapp.com',
  projectId: 'test-firebase-nextjs-757d9',
  storageBucket: 'test-firebase-nextjs-757d9.appspot.com',
  messagingSenderId: '1031037155239',
  appId: '1:1031037155239:web:3563522d906214e37fe882',
  measurementId: 'G-WZYVQG9D24',
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
} else {
  firebase.app() // if already initialized, use that one
}

let messaging: firebase.messaging.Messaging

if (typeof window !== 'undefined') {
  if (firebase.messaging.isSupported()) {
    messaging = firebase.messaging()
  }
}

export const getMessagingToken = async () => {
  let currentToken = ''
  if (!messaging) return
  try {
    currentToken = await messaging.getToken({
      vapidKey:
        'BFOWmcR7ehImSiN5dhRBNoaa_WF4kaQf6H8SZInatY0PqBUE4D0KJ5rk0rcTT-j3A4E5vjF1ZxqtQ515Oyl0gjc',
    })
  } catch (error) {}
  return currentToken
}

export const onMessageListener = (): Promise<any> => {
  return new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload)
    })
  })
}
