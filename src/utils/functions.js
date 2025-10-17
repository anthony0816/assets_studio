import jwt from "jsonwebtoken";

export function DowloadCloudinaryAsset(url) {
  fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "asset.png"; // nombre del archivo al guardar
      link.click();
      URL.revokeObjectURL(link.href);
    });
}

export async function downloadPhotoFromUrl(url, filename = "download") {
  try {
    const response = await fetch(
      `${window.location.origin}/api/scraping/opengameart/download`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      }
    );

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
  }
}

export async function AssetToBase64FromOpengameart(url, filename = "download") {
  try {
    const response = await fetch(
      `${window.location.origin}/api/scraping/opengameart/download`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      }
    );
    const blob = await response.blob();

    const base64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
    return { base64 };
  } catch (error) {
    return { error: error.message || "error desconocido" };
  }
}

export async function _POST_(url, data) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "Application/json",
    },
    body: JSON.stringify(data),
  });
  return res;
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // Lee el archivo como Data URL (Base64)
    reader.onload = () => resolve(reader.result); // Devuelve el string Base64
    reader.onerror = (error) => reject(error);
  });
}

export async function urlToBase64(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () =>
        reject(new Error("Failed to convert blob to Base64"));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    return { error: error.message };
  }
}

export async function VerifySesion(request, adminAuth) {
  const session = request.cookies.get("session")?.value;
  if (!session) {
    console.log("No hay cookie de sesión");
    return false;
  }

  try {
    const decoded = await adminAuth.verifyIdToken(session);
    console.log("Sesión válida:", decoded.uid);
    return true;
  } catch (error) {
    console.error("Token inválido o expirado:", error);
    return false;
  }
}

export function VerifyJWToken(request) {
  try {
    // Leer la cookie "session"
    const token = request.cookies.get("session-jwt")?.value;

    if (!token) {
      return { error: "No session token found" };
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Si es válido, devolvemos los datos del payload
    return {
      success: true,
      user: decoded, // aquí estará { email, iat, exp }
    };
  } catch (error) {
    return { error: "Invalid or expired token" };
  }
}

export async function CreateAsset(base64, uid, providerId, categoria) {
  const res = await fetch(`${window.location.origin}/api/assets/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
    },
    body: JSON.stringify({
      base64,
      uid,
      user_providerId: providerId,
      categoria: categoria,
    }),
  });
  const data = await res.json();
  return data;
}

export async function DeleteAsset_AlsoCloudnary(id, public_id) {
  const res = await fetch("api/assets/delete/deleteAlsoCloud", {
    method: "POST",
    headers: {
      "Content-type": "Application/json",
    },
    body: JSON.stringify({
      id,
      public_id,
    }),
  });
  return res;
}

export async function getUserByUid(uid, adminAuth) {
  try {
    const userRecord = await adminAuth.getUser(uid);

    return {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      providers: userRecord.providerData.map((p) => p.providerId), // ej: ["google.com", "github.com"]
      createdAt: userRecord.metadata.creationTime,
      lastLoginAt: userRecord.metadata.lastSignInTime,
    };
  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    return null;
  }
}

export async function GetAssetsByUserId(uid, page, limit, freeAcces = false) {
  const res = await fetch("api/assets/get", {
    method: "POST",
    headers: {
      "Content-type": "Application/json",
    },
    body: JSON.stringify({
      user_id: uid,
      page,
      limit,
      freeAcces,
    }),
  });

  const data = await res.json();
  return data;
}

export async function GetAssets(page, limit, freeAcces = false) {
  const res = await fetch("api/assets/get", {
    method: "POST",
    headers: {
      "Content-type": "Application/json",
    },
    body: JSON.stringify({
      page,
      limit,
      freeAcces,
    }),
  });

  const data = await res.json();
  return data;
}

export async function GetAssetsByCategoria(page, limit, categoria) {
  const res = await fetch("api/assets/get", {
    method: "POST",
    headers: {
      "Content-type": "Application/json",
    },
    body: JSON.stringify({
      page,
      limit,
      categoria,
    }),
  });

  const data = await res.json();
  return data;
}

export async function GetByParam(param, page, limit, freeAcces = false) {
  const res = await fetch("/api/assets/get/getBasedOnParams", {
    method: "POST",
    headers: {
      "Content-type": "Application/json",
    },
    body: JSON.stringify({
      param,
      page,
      limit,
      freeAcces,
    }),
  });
  const data = res.json();
  return data;
}

export async function CreateComent(
  user_id,
  asset_id,
  content,
  username,
  userPhotoUrl
) {
  const res = await fetch("/api/coments/create", {
    method: "POST",
    headers: {
      "Content-type": "Application/json",
    },
    body: JSON.stringify({
      user_id,
      asset_id,
      content,
      username,
      userPhotoUrl,
    }),
  });
  return res;
}

export async function CreateUser(
  longName,
  username,
  password,
  email,
  avatar_base64 = ""
) {
  const res = await fetch("api/user/create", {
    method: "POST",
    headers: {
      "Content-type": "Application/json",
    },
    body: JSON.stringify({
      longName,
      username,
      password,
      email,
      avatar_base64,
    }),
  });
  return res;
}

export async function GetComentByAsset(asset_id, page, limit) {
  const res = await fetch("/api/coments/get/asset_id", {
    method: "POST",
    headers: {
      "Content-type": "Application/json",
    },
    body: JSON.stringify({
      asset_id,
      page,
      limit,
    }),
  });
  return res;
}

export async function GiveLike(asset_id, liked, currentUserId) {
  if (!liked) {
    const res = await fetch("api/likes/create-delete", {
      method: "POST",
      headers: {
        "Content-type": "Application/json",
      },
      body: JSON.stringify({
        user_id: currentUserId,
        asset_id,
      }),
    });

    return res;
  }

  if (liked) {
    const res = await fetch("api/likes/create-delete", {
      method: "DELETE",
      headers: {
        "Content-type": "Application/json",
      },
      body: JSON.stringify({
        user_id: currentUserId,
        asset_id,
      }),
    });
    return res;
  }
}

export async function CreateReport(asset_id, user_id, type, description) {
  const res = await fetch("api/reports/create", {
    method: "POST",
    headers: {
      "Content-type": "Application/json",
    },
    body: JSON.stringify({
      asset_id,
      user_id,
      type,
      description,
    }),
  });
  return res;
}

export async function FetchUserData(user_id) {
  const res = await fetch("api/user/get", {
    method: "POST",
    headers: {
      "Content-type": "Application/json",
    },
    body: JSON.stringify({
      uid: user_id,
    }),
  });
  return res;
}

export function downloadImgFromBase64(base64Data, filename = "image.png") {
  const link = document.createElement("a");
  link.href = base64Data; // debe incluir "data:image/png;base64,..."
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function VerifyUserCreationParameters(
  longName,
  username,
  password,
  confirmPassword,
  email
) {
  // 1. Validar que longName no tenga números ni caracteres especiales
  const regexOnlyLetters = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  if (!regexOnlyLetters.test(longName)) {
    return {
      status: false,
      message: "El longName no puede contener números ni caracteres especiales",
    };
  }

  // 2. Validar username
  if (typeof username !== "string" || username.length < 5) {
    return {
      status: false,
      message: "El username debe tener al menos 5 caracteres",
    };
  }

  const onlyNumbers = /^[0-9]+$/;
  if (onlyNumbers.test(username)) {
    return {
      status: false,
      message: "El username no puede estar compuesto solo por números",
    };
  }

  // 3. Validar longitud de password
  if (typeof password !== "string" || password.length <= 8) {
    return {
      status: false,
      message: "El password debe tener más de 8 caracteres",
    };
  }

  // 4. Validar igualdad entre password y confirmPassword
  if (password !== confirmPassword) {
    return {
      status: false,
      message: "El password y el confirmPassword no coinciden",
    };
  }

  // 5. Validar formato de email
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email)) {
    return { status: false, message: "El email no tiene un formato válido" };
  }

  // 6 Validar que no se repita el Username y Email

  const res = await fetch("api/verify-email-username", {
    method: "POST",
    headers: {
      "Content-type": "Application/json",
    },
    body: JSON.stringify({
      username,
      email,
    }),
  });

  const { userExist, userEmailExist, error } = await res.json();
  if (error) return { status: false, message: "Verification Error, Try Again" };
  if (userExist) return { status: false, message: "Username already exist" };
  if (userEmailExist)
    return { status: false, message: "email is already taken" };

  // Si todo pasa
  return { status: true, message: "Parámetros válidos" };
}

export async function SendVerificationCode(email) {
  const res = await fetch("/api/email/send-verification-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  });
  return res;
}

export async function VerifyCode(email, code) {
  const res = await fetch("/api/email/verify-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      code,
    }),
  });
  return res;
}

export async function CreateJWTCookieSession(email) {
  const res = await fetch("api/session/create-jwt-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  });
  return res;
}

export function UserToFirebaseFormatInfo(p_user) {
  const {
    uid,
    avatar,
    longName,
    name,
    password,
    email,
    roll,
    providerId,
    createdAt,
  } = p_user;

  const f_user = {
    uid,
    email,
    displayName: name,
    photoURL: avatar,
    providerData: [{ providerId: "Assets Studio" }],
    metadata: {
      creationTime: createdAt,
      lastSignInTime: "will be implemented",
    },
  };
  return f_user;
}
