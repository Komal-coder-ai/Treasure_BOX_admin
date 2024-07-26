import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
var firebaseConfig = {
  apiKey: "AIzaSyDzjJNayLMxTEskp71gpjGjRpu6xHL_0Kk",
  authDomain: "treasurebox-admin.firebaseapp.com",
  projectId: "treasurebox-admin",
  storageBucket: "treasurebox-admin.appspot.com",
  messagingSenderId: "158959840548",
  appId: "1:158959840548:web:9196ef4aea4f7e2b2217b1",
  measurementId: "G-011VHH1QQJ"
};

initializeApp(firebaseConfig);
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const onMessageListener = () =>

new Promise((resolve) => {
  debugger
  onMessage(messaging, (payload) => {
    resolve(payload);
  });
});

export const getNotificationToken = (setTokenFound) => {
  debugger
  return getToken(messaging, {vapidKey: 'BE2jmFywV6ZBWCYWPNRbjEdQQnzveoRCNlZuZFht9Nrf-E-UV4BqQq_OLfiSdHWrwp6e1k5ulF8b1y9CdO49s9A'}).then((currentToken) => {
    
    if (currentToken) {
      setTokenFound(true);
    } else {
      setTokenFound(false);
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
  });
}