"use client";
import { useTheme } from "@/context/themeContext";
import UploadAvatar from "@/Components/UploadAvatar";
import { useState } from "react";
import { VerifyUserCreationParameters } from "@/utils/functions";
import ModalVerifyEmail from "@/Components/ModalVerifyEmail";
import { CreateUser } from "@/utils/functions";
import LoadingSpinner from "@/Components/LoadingSpiner";
import { useLoadingRouter } from "@/Components/LoadingRouterProvider";
import { useAuth } from "@/context/authContext";
import { CreateJWTCookieSession } from "@/utils/functions";

import { ShowPasswordIcon } from "@/Icons/ShowPasswordIcon";
import { HidePasswordIcon } from "@/Icons/HidePasswordIcon";

export default function Registrar() {
  const { currentTheme } = useTheme();
  const { router } = useLoadingRouter();
  const { setUser } = useAuth();

  /* Estados */
  const [openModalVerifyEmail, setOpenModalVerifyEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [longName, setLongName] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [email, setEmail] = useState(null);
  const [avatar_base64, setAvatar_base64] = useState("");
  const [loading, setLoading] = useState(false);

  function setAvatarURL(base64) {
    setAvatar_base64(base64);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    /* Validar campos */
    if (!longName || !username || !password || !confirmPassword || !email)
      return setLoading(false);
    const { status, message } = await VerifyUserCreationParameters(
      longName,
      username,
      password,
      confirmPassword,
      email
    );
    /* En caso de error */
    if (status == false) {
      setErrorMessage(message);
      setLoading(false);
      console.error("error en la verificacion", message);
      return;
    }

    /* Verificar Posesion del correo */
    setOpenModalVerifyEmail(true);
    setLoading(false);
  }

  async function handleCreation() {
    setLoading(true);
    const res = await CreateUser(
      longName,
      username,
      password,
      email,
      avatar_base64
    );
    const data = await res.json();
    console.log("Datos:", data);
    const { error, success, user } = data;
    if (error) {
      setLoading(false);
      setErrorMessage(error);
      return;
    }
    if (success) {
      const res = await CreateJWTCookieSession(user.email);
      const data = await res.json();
      console.log("Datos de TOKEN JWT:", data);
      if (!data.success) return;
      setUser(user);
      router("/");
    }
  }

  return (
    <>
      <ModalVerifyEmail
        open={openModalVerifyEmail}
        onSucces={handleCreation}
        onClose={() => setOpenModalVerifyEmail(false)}
        email={email}
      />
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex justify-center items-center w-full h-full  overflow-y-auto "
      >
        <div className="  h-full w-full overflow-y-auto">
          <div
            className={`mt-15 mx-auto flex flex-col w-full max-w-md p-6 rounded-lg shadow-lg 
      ${currentTheme.colors.secondary} ${currentTheme.textColor.primary}`}
          >
            {errorMessage && (
              <div
                className={`p-2 mb-4 rounded text-sm font-medium 
          ${currentTheme.colors.errorText} ${currentTheme.colors.third}`}
              >
                {errorMessage}
              </div>
            )}

            <label htmlFor="longName" className="mb-1 font-medium">
              Full Name
            </label>
            <input
              type="text"
              id="longName"
              onChange={(e) => setLongName(e.target.value)}
              required
              className={`mb-4 p-2 rounded border 
        ${currentTheme.colors.third} ${currentTheme.textColor.primary} ${currentTheme.colors.border}`}
            />

            <label htmlFor="userName" className="mb-1 font-medium">
              Username
            </label>
            <input
              type="text"
              id="userName"
              onChange={(e) => setUsername(e.target.value)}
              required
              className={`mb-4 p-2 rounded border 
        ${currentTheme.colors.third} ${currentTheme.textColor.primary} ${currentTheme.colors.border}`}
            />

            <div className="flex justify-between">
              <label htmlFor="password" className="mb-1 font-medium">
                Password
              </label>
              <div
                onClick={() => setShowPass(!showPass)}
                className="cursor-pointer"
              >
                {showPass ? <HidePasswordIcon /> : <ShowPasswordIcon />}
              </div>
            </div>
            <input
              type={`${showPass ? "text" : "password"}`}
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`mb-4 p-2 rounded border 
        ${currentTheme.colors.third} ${currentTheme.textColor.primary} ${currentTheme.colors.border}`}
            />

            <div className="flex justify-between">
              <label htmlFor="ConfirmPassword" className="mb-1 font-medium">
                Confirm Password
              </label>
              <div
                onClick={() => setShowPass(!showPass)}
                className="cursor-pointer"
              >
                {showPass ? <HidePasswordIcon /> : <ShowPasswordIcon />}
              </div>
            </div>
            <input
              type={`${showPass ? "text" : "password"}`}
              id="ConfirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`mb-4 p-2 rounded border 
        ${currentTheme.colors.third} ${currentTheme.textColor.primary} ${currentTheme.colors.border}`}
            />

            <label htmlFor="email" className="mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`mb-4 p-2 rounded border 
        ${currentTheme.colors.third} ${currentTheme.textColor.primary} ${currentTheme.colors.border}`}
            />

            <p className={`mb-2 ${currentTheme.textColor.secondary}`}>
              Upload photo for avatar:
            </p>
            <div className=" w-full mb-4">
              <UploadAvatar onSucces={setAvatarURL} />
            </div>

            <button
              type="submit"
              className={`px-4 py-2 rounded text-white font-medium 
        ${currentTheme.colors.buttonPrimary} 
        ${currentTheme.colors.buttonPrimaryHover} transition`}
            >
              {loading ? <LoadingSpinner color="white" /> : "Create Account"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
