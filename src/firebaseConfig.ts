import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

// TODO: Replace these values with your actual Firebase Project keys
// IMPORTANT: If you get "auth/invalid-credential" or popup errors, make sure to add 
// your development and staging URLs to the "Authorized domains" list in:
// Firebase Console -> Authentication -> Settings -> Authorized domains
const firebaseConfig = {
  apiKey: "AIzaSyDhpG7UUn_JY4ILv5SaK6ZphixMQLZoZvw",
  authDomain: "tatak-norte.firebaseapp.com",
  projectId: "tatak-norte",
  storageBucket: "tatak-norte.firebasestorage.app",
  messagingSenderId: "900146630542",
  appId: "1:900146630542:web:d700f349b2a58717a91edf",
  measurementId: "G-YTP5HN8G7L"
};

// Check if the config is still using default placeholders
export const isFirebaseConfigured = () => {
  return firebaseConfig.projectId !== "your-project-id" && 
         !firebaseConfig.projectId.includes("YOUR_PROJECT_ID");
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
try {
  db.settings({ experimentalForceLongPolling: true });
} catch (e) {
  console.warn("Firestore settings already applied or failed:", e);
}
const storage = firebase.storage();

if (!isFirebaseConfigured()) {
  console.info("⚠️ Firebase is not configured yet. App running in Demo Mode.");
} else {
  // Test connection to Firestore
  db.collection('test').doc('connection').get({ source: 'server' })
    .then(() => console.log("🔥 Firestore connected successfully"))
    .catch((error) => {
      if (error.message.includes('insufficient permissions')) {
        console.log("🔥 Firestore connection: Permissions required. Make sure to paste the generated firestore.rules to your Firebase Console.");
      } else {
        console.error("🔥 Firestore connection failed:", error.message);
      }
      if (error.message.includes('unavailable')) {
        console.info("💡 Tip: This often happens due to networking constraints in the preview. Long polling is enabled to help.");
      }
    });
}

export { auth, db, storage };
export default firebase;