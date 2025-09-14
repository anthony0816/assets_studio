export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // Lee el archivo como Data URL (Base64)
    reader.onload = () => resolve(reader.result); // Devuelve el string Base64
    reader.onerror = (error) => reject(error);
  });
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

export async function CreateAsset(
  base64,
  id_local_provider,
  uid,
  providerId,
  categoria
) {
  console.log("ProviderID", providerId);
  let id = id_local_provider;
  if (providerId == "google.com") {
    id = uid;
  }
  if (providerId != "google.com") {
    providerId = "local";
  }

  const res = await fetch("api/assets/upload", {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
    },
    body: JSON.stringify({
      base64,
      id,
      user_providerId: providerId,
      categoria: categoria,
    }),
  });
  const data = await res.json();
  return data;
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

export async function GetAssetsByUserId(
  uid,
  id,
  providerId,
  page,
  limit,
  freeAcces = false
) {
  let user_id = id;
  if (providerId != "local") {
    user_id = uid;
  }

  const res = await fetch("api/assets/get", {
    method: "POST",
    headers: {
      "Content-type": "Application/json",
    },
    body: JSON.stringify({
      user_id,
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
