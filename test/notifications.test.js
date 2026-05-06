import {
  NOTIFI_TYPES,
  GiveLikeNotifiacionMessage,
  UnsetLikeNotificationMessage,
  ComentAssetNotificationMessage,
  GiveFormatToNotification,
} from "@/utils/notifications";

describe("NOTIFI_TYPES - Constantes de notificaciones", () => {
  test("debe exportar tipo like", () => {
    expect(NOTIFI_TYPES.like).toBe("like");
  });

  test("debe exportar tipo dislike", () => {
    expect(NOTIFI_TYPES.dislike).toBe("dislike");
  });

  test("debe exportar tipo coment", () => {
    expect(NOTIFI_TYPES.coment).toBe("coment");
  });
});

describe("Mensajes de notificacion", () => {
  test("GiveLikeNotifiacionMessage debe generar mensaje correcto", () => {
    const msg = GiveLikeNotifiacionMessage("Carlos");
    expect(msg).toBe("Carlos liked your one of your posts");
  });

  test("UnsetLikeNotificationMessage debe generar mensaje correcto", () => {
    const msg = UnsetLikeNotificationMessage("Maria");
    expect(msg).toBe("Maria has undone a like of your posts");
  });

  test("ComentAssetNotificationMessage debe generar mensaje correcto", () => {
    const msg = ComentAssetNotificationMessage("Pedro");
    expect(msg).toBe("Pedro coment in one of your post");
  });
});

describe("GiveFormatToNotification - Parseo de notificaciones", () => {
  test("debe parsear una notificacion de tipo like correctamente", () => {
    const notification = {
      id: "notif1",
      createdAt: "2025-01-15T10:00:00Z",
      message: "type:like,user_who_acts:uid123,user_who_acts_name:Carlos,assetTarget:asset456",
      redirectionUrl: "/assets/asset456",
      user_id: "owner1",
      read: false,
    };

    const result = GiveFormatToNotification(notification);

    expect(result.type).toBe("like");
    expect(result.user_who_acts).toBe("uid123");
    expect(result.user_who_acts_name).toBe("Carlos");
    expect(result.assetTarget).toBe("asset456");
    expect(result.content).toBe("Carlos liked your one of your posts");
  });

  test("debe parsear una notificacion de tipo coment correctamente", () => {
    const notification = {
      id: "notif2",
      createdAt: "2025-02-20T14:30:00Z",
      message: "type:coment,user_who_acts:uid456,user_who_acts_name:Maria,assetTarget:asset789",
      redirectionUrl: "/assets/asset789",
      user_id: "owner2",
      read: true,
    };

    const result = GiveFormatToNotification(notification);

    expect(result.type).toBe("coment");
    expect(result.user_who_acts).toBe("uid456");
    expect(result.user_who_acts_name).toBe("Maria");
    expect(result.content).toBe("Maria coment in one of your post");
  });

  test("debe parsear una notificacion de tipo dislike correctamente", () => {
    const notification = {
      id: "notif3",
      createdAt: "2025-03-10T09:00:00Z",
      message: "type:dislike,user_who_acts:uid789,user_who_acts_name:Pedro,assetTarget:asset101",
      redirectionUrl: "/assets/asset101",
      user_id: "owner3",
      read: false,
    };

    const result = GiveFormatToNotification(notification);

    expect(result.type).toBe("dislike");
    expect(result.user_who_acts_name).toBe("Pedro");
    expect(result.content).toBe("Pedro has undone a like of your posts");
  });

  test("debe retornar la notificacion original si el mensaje no tiene formato esperado", () => {
    const notification = {
      id: "notif4",
      message: "malformed message",
      redirectionUrl: "/home",
      user_id: "owner4",
      read: false,
    };

    const result = GiveFormatToNotification(notification);
    expect(result).toEqual(notification);
  });
});
