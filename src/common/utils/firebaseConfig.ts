import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBCYnrlCnnkvc2rhSRhHANaJj3ZROD88SQ",
    authDomain: "imageuploads-33589.firebaseapp.com",
    projectId: "imageuploads-33589",
    storageBucket: "imageuploads-33589.appspot.com",
    messagingSenderId: "213227590046",
    appId: "1:213227590046:web:e1afb5c4d40efdb3bd868f"
  };

const app = initializeApp(firebaseConfig);
export const firebaseStorage = getStorage(app);
