import React, { useEffect, useState } from 'react';
import './App.css';
import { getNotificationToken, onMessageListener } from './firebase';
import "./firebase"
// import { initMessaging } from '../public/firebase-messaging-sw';
function App() {

  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({ title: '', body: '' });
  const [isTokenFound, setTokenFound] = useState(false);

  getNotificationToken(setTokenFound);

  onMessageListener().then(payload => {
    debugger
    setShow(true);
    setNotification({ title: payload.notification.title, body: payload.notification.body })
    alert(payload.notification.title)
    
  }).catch(err => console.log('failed: ', err));
  return (
   <div>

   </div>
  );
}

export default App;




// <div>
// <Install/>
// <LoginLayout/>
// </div>