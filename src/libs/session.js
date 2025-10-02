import { VerifyJWToken } from "@/utils/functions";
import { VerifySesion } from "@/utils/functions";

export async function ValidateSession(request, adminAuth) {
  const session = await VerifySesion(request, adminAuth);
  const data = VerifyJWToken(request);
  console.log("aaaaaaaaaaaaaaaaaaaaa", data);
  const { error } = data;
  if (!session && error) return false;
  return true;
}
