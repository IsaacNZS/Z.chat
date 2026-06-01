// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js",
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyD1nkG1jldPaRJwk-85RVf3rpHLOUFchVg",
  authDomain: "zchat-a0400.firebaseapp.com",
  projectId: "zchat-a0400",
  storageBucket: "zchat-a0400.firebasestorage.app",
  messagingSenderId: "344170320977",
  appId: "1:344170320977:web:0d4cb4a83b8decb6cb1470",
  measurementId: "G-8W2E8K35B2",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.data.title, {
    body: payload.data.body,
    icon: payload.data.image || "/1.png",
    badge: "/logo512.png",
    image: payload.data.image || "/1.png",
    tag: "message",
    renotify: true,
    requireInteraction: true,
    vibrate: [200, 100, 200],
    timestamp: Date.now(),
    data: {
      url: `/message/${payload.data.senderId}`,
    },
    actions: [
      {
        action: "open",
        title: "💬 Open Chat",
      },
      {
        action: "close",
        title: "❌ Close",
      },
    ],
  });
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "close") return;

  event.waitUntil(clients.openWindow(event.notification.data?.url || "/"));
});
