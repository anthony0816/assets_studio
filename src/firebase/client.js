import { initializeApp } from "firebase/app";
import {
  getAuth,
  GithubAuthProvider,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
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
  } catch (error) {
    console.error("Error en login con GitHub:", error);
  }
}

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return mapUserFromFirebaseAuth(result.user);
  } catch (error) {
    console.error("Error en login con Google:", error);
  }
}

const mapUserFromFirebaseAuth = (user) => {
  if (!user) return null;

  const {
    uid,
    displayName,
    email,
    emailVerified,
    photoURL,
    phoneNumber,
    providerData,
    metadata,
    stsTokenManager,
  } = user;

  return {
    uid,
    name: displayName || null,
    email: email || null,
    emailVerified: !!emailVerified,
    avatar: photoURL || null,
    phoneNumber: phoneNumber || null,
    providerId: providerData?.[0]?.providerId || null,
    createdAt: metadata?.creationTime || null,
    lastLoginAt: metadata?.lastSignInTime || null,
    accessToken: stsTokenManager?.accessToken || null, // úsalo solo si lo necesitas
  };
};

export const onAuthStateChange = (onChange) => {
  auth.onAuthStateChanged(async (user) => {
    const nomrmalizedUser = mapUserFromFirebaseAuth(user);
    if (user) {
      try {
        const token = await user.getIdToken();
        // Enviar token al backend para que lo convierta en cookie
        const res = await fetch("/api/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (!res.ok) {
          console.log("Iniciandi Sesion:", data);
          return onChange(null);
        }
        const { uid } = data;
        if (uid) onChange(nomrmalizedUser);
        console.log("Respuesta de iniciar Secion", data);
      } catch (error) {
        console.log("Error Iniciando sesion:", error.messaje);
        onChange(null);
      }
    } else {
      // Usuario salió → pedir al backend que borre la cookie
      await fetch("/api/session", { method: "DELETE" });
      onChange(nomrmalizedUser);
    }
  });
};

export async function logout() {
  try {
    await signOut(auth);
    console.log("Sesión cerrada correctamente");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
}
