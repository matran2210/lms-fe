import { useEffect } from 'react'
import firebase from 'firebase/compat/app'
import 'firebase/compat/messaging'

const firebaseConfig = {
  apiKey: 'AIzaSyB12OZbgQA8VpCSAYrgytTJkUexafwiN74',
  authDomain: 'sapp-develop.firebaseapp.com',
  projectId: 'sapp-develop',
  storageBucket: 'sapp-develop.appspot.com',
  messagingSenderId: '579391570124',
  appId: '1:579391570124:web:ed5e7c72474edf434bc269',
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
        'BANlYjHJCUf-jXUtrRR8zXl2QytADlfN9vVUP_N_3dd3nGgH7tcIAgOcTGHRr8pyCNujwHdpVZ7DSg5SsViq5u0',
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
