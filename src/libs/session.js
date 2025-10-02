import { VerifyJWToken } from "@/utils/functions";
import { VerifySesion } from "@/utils/functions";

export async function ValidateSession(request, adminAuth) {
  const session = await VerifySesion(request, adminAuth);
  const { error } = await VerifyJWToken();
  if (!session && error) return false;
  return true;
}
