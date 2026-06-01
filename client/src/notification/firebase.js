// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyD1nkG1jldPaRJwk-85RVf3rpHLOUFchVg",
  authDomain: "zchat-a0400.firebaseapp.com",
  projectId: "zchat-a0400",
  storageBucket: "zchat-a0400.firebasestorage.app",
  messagingSenderId: "344170320977",
  appId: "1:344170320977:web:0d4cb4a83b8decb6cb1470",
  measurementId: "G-8W2E8K35B2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generatetoken = async () => {
  const permission = await Notification.requestPermission();

  if (permission !== "granted") return;

  const registration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js",
  );

  const token = await getToken(messaging, {
    vapidKey:
      "BO69W3WByro7ckdmYOX18aMGseH0POLeSOgc6GDG8x2tflTeEmqobE5P-xmGqrJtBK5kbQqxDFpwxCy00wHrS0Y",
    serviceWorkerRegistration: registration,
  });

  await fetch(`${import.meta.env.VITE_API_URL}/user/savetoken`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
    }),
  });
};
