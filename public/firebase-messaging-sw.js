/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyDzjJNayLMxTEskp71gpjGjRpu6xHL_0Kk",
  authDomain: "treasurebox-admin.firebaseapp.com",
  projectId: "treasurebox-admin",
  storageBucket: "treasurebox-admin.appspot.com",
  messagingSenderId: "158959840548",
  appId: "1:158959840548:web:9196ef4aea4f7e2b2217b1",
  measurementId: "G-011VHH1QQJ"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
