import { initializeApp } from "firebase/app";
import {
  getAuth,
  GithubAuthProvider,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBYYXx9u_kDLysaUiNcY6uTi4NSIpiXIsc",
  authDomain: "assets-studio.firebaseapp.com",
  projectId: "assets-studio",
  storageBucket: "assets-studio.appspot.com", // ojo con el dominio correcto
  messagingSenderId: "495529107253",
  appId: "1:495529107253:web:3429029c3e9b736e20367c",
  measurementId: "G-6GD7VRK7BC",
};

// Inicializar app (evitando duplicados si se importa varias veces)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const githubProvider = new GithubAuthProvider();
const googleProvider = new GoogleAuthProvider();

export async function loginWithGitHub() {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    console.log("Usuario:", result.user);
  } catch (error) {
    console.error("Error en login con GitHub:", error);
  }
}

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Usuario:", result.user);
  } catch (error) {
    console.error("Error en login con Google:", error);
  }
}
