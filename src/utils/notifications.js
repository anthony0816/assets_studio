import { _POST_ } from "./functions";

export const NOTIFI_TYPES = {
  like: "like", // Example => type:${NOTIFI_TYPES.like},user_who_acts:${user.uid},user_who_acts_name:${user.name},assetTarget:${asset.id}
  dislike: "dislike", // Example => type:${NOTIFI_TYPES.dislike},user_who_acts:${user.uid},user_who_acts_name:${user.name},assetTarget:${asset.id}
  coment: "coment", // Example => type:${NOTIFI_TYPES.coment},user_who_acts:${auth.user.uid},user_who_acts_name:${user.name},assetTarget:${asset.id}
};

export const GiveLikeNotifiacionMessage = (user_Who_gives_like) => {
  return `${user_Who_gives_like} liked your one of your posts`;
};

export const UnsetLikeNotificationMessage = (user_Who_delete_like) => {
  return `${user_Who_delete_like} has undone a like of your posts`;
};

export const ComentAssetNotificationMessage = (user_who_coment) => {
  return `${user_who_coment} coment in one of your post`;
};

export async function CreateNotification(user_id, redirectionUrl, message) {
  const res = await _POST_("/api/notifications", {
    user_id,
    redirectionUrl,
    message,
  });
  return res;
}

export async function DeleteNotification(id) {
  const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
  return res;
}

export async function GetNotificationsByUserId(user_id, page, limit) {
  const res = await fetch(
    `/api/notifications/user/${user_id}?page=${page}&limit=${limit}`
  );
  return res;
}

export function GiveFormatToNotification(notification) {
  try {
    const { id, createdAt, message, redirectionUrl, user_id, read } =
      notification;

    let copy = { ...notification };
    const type = message.split(",")[0].split(":")[1];
    console.log("Type:", type);
    if (
      type == NOTIFI_TYPES.like ||
      type == NOTIFI_TYPES.dislike ||
      type == NOTIFI_TYPES.coment
    ) {
      const user_who_acts = message.split(",")[1].split(":")[1];
      const user_who_acts_name = message.split(",")[2].split(":")[1];
      const assetTarget = message.split(",")[3].split(":")[1];
      console.log(
        "Credentials:",
        user_who_acts,
        user_who_acts_name,
        assetTarget
      );
      copy.type = type;
      copy.user_who_acts = user_who_acts;
      copy.user_who_acts_name = user_who_acts_name;
      copy.assetTarget = assetTarget;

      copy = StikMessage(copy, type);
    }

    console.log("From GiveFormatToNotifications", copy);
    return copy;
  } catch (error) {
    console.error("Error formatenando las notificaciones:", error);
    return notification;
  }
}

function StikMessage(notifi, type) {
  if (type == NOTIFI_TYPES.like) {
    notifi.content = GiveLikeNotifiacionMessage(notifi.user_who_acts_name);
  }

  if (type == NOTIFI_TYPES.dislike) {
    notifi.content = UnsetLikeNotificationMessage(notifi.user_who_acts_name);
  }
  if (type == NOTIFI_TYPES.coment) {
    notifi.content = ComentAssetNotificationMessage(notifi.user_who_acts_name);
  }

  return notifi;
}
