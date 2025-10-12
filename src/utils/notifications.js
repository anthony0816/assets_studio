import { _POST_ } from "./functions";

export const GiveLikeNotifiacionMessage = (user_Who_gives_like) => {
  return `The user <${user_Who_gives_like}> liked your one of your posts`;
};

export const UnsetLikeNotificationMessage = (user_Who_delete_like) => {
  return `The user <${user_Who_delete_like}> has undone a like of your posts`;
};

export const ComentAssetNotificationMessage = (user_who_coment) => {
  return `The user <${user_who_coment}> coment in one of your post`;
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
