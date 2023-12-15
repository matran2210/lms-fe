import { useEffect } from 'react'
import firebase from 'firebase/compat/app'
import 'firebase/compat/messaging'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
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
  currentToken = await messaging.getToken({
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPIDKEY,
  })
  return currentToken
}

export const onMessageListener = (): Promise<any> => {
  return new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload)
    })
  })
}
