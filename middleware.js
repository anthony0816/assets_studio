export default function middleware() {
  const session = request.cookies.get("session")?.value;
  console.log("SESION", session);
}
