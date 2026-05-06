import { UserToFirebaseFormatInfo } from "@/utils/functions";

describe("UserToFirebaseFormatInfo - Transformacion de datos de usuario", () => {
  test("debe transformar un usuario correctamente con todos los campos", () => {
    const user = {
      uid: "user123",
      avatar: "https://example.com/avatar.png",
      longName: "Antonio Luis",
      name: "AntonioF",
      password: "hashed123",
      email: "antonio@test.com",
      roll: "user",
      providerId: "email",
      createdAt: "2025-01-10T00:00:00Z",
    };

    const result = UserToFirebaseFormatInfo(user);

    expect(result.uid).toBe("user123");
    expect(result.email).toBe("antonio@test.com");
    expect(result.displayName).toBe("AntonioF");
    expect(result.photoURL).toBe("https://example.com/avatar.png");
    expect(result.providerData).toEqual([{ providerId: "Assets Studio" }]);
    expect(result.metadata.creationTime).toBe("2025-01-10T00:00:00Z");
  });

  test("no debe incluir password en el resultado", () => {
    const user = {
      uid: "user456",
      avatar: "",
      longName: "Test User",
      name: "TestUser",
      password: "secret",
      email: "test@test.com",
      roll: "admin",
      providerId: "google",
      createdAt: "2025-03-01T00:00:00Z",
    };

    const result = UserToFirebaseFormatInfo(user);

    expect(result).not.toHaveProperty("password");
    expect(result).not.toHaveProperty("longName");
    expect(result).not.toHaveProperty("roll");
  });

  test("debe manejar avatar vacio", () => {
    const user = {
      uid: "user789",
      avatar: "",
      longName: "No Avatar",
      name: "NoAvatar",
      password: "pass",
      email: "noavatar@test.com",
      roll: "user",
      providerId: "email",
      createdAt: "2025-06-01T00:00:00Z",
    };

    const result = UserToFirebaseFormatInfo(user);
    expect(result.photoURL).toBe("");
  });
});
