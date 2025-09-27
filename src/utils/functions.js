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

// async function avd(asset_id) {
//   if (isStarting) return;

//   if (!liked) {
//     const res = await fetch("api/likes/create-delete", {
//       method: "POST",
//       headers: {
//         "Content-type": "Application/json",
//       },
//       body: JSON.stringify({
//         user_id: currentUserId,
//         asset_id,
//       }),
//     });

//     if (!res.ok) {
//       if (res.status == 401) {
//         return router("/login");
//       }
//     }
//     const data = await res.json();
//     const { id } = data;
//     if (id) {
//       setLiked(true);
//       setLikes(likes + 1);
//     }
//     console.log("data from liked asset", data);
//     return;
//   }
//   if (liked) {
//     const res = await fetch("api/likes/create-delete", {
//       method: "DELETE",
//       headers: {
//         "Content-type": "Application/json",
//       },
//       body: JSON.stringify({
//         user_id: currentUserId,
//         asset_id,
//       }),
//     });
//     const data = await res.json();
//     const { count } = data;
//     console.log("FROM delete:", data);
//     if (count) {
//       setLiked(false);
//       setLikes(likes - 1);
//       return;
//     }
//   }
// }

/*
 id Int @id @default(autoincrement())
  user_id String
  asset Asset @relation(fields: [asset_id], references: [id], onDelete: Cascade)
  asset_id Int
  content  String
  createdAt DateTime @default(now())
  likes ComentLike[] 
 */
