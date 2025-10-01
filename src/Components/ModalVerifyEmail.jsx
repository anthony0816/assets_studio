import { useEffect, useState } from "react";
import { SendVerificationCode } from "@/utils/functions";
import { useTheme } from "@/context/themeContext";
import LoadingSpinner from "./LoadingSpiner";
import { VerifyCode } from "@/utils/functions";

export default function ModalVerifyEmail({ open, onClose, email, onSucces }) {
  const { currentTheme } = useTheme();
  // Estados
  const [sendingError, setSendingError] = useState(null);
  const [verificationError, setVerificationError] = useState(null);
  const [verifing, setVerifing] = useState(false);
  const [sending, setSending] = useState(false);
  const [code, setCode] = useState(null);

  useEffect(() => {
    if (!open) return;
    async function exe() {
      await loadSendCode();
    }
    exe();
  }, [open]);

  async function handleVerify() {
    setVerificationError(null);
    if (!code) return;
    setVerifing(true);

    const res = await VerifyCode(email, code);
    const data = await res.json();
    const { error, success } = data;
    if (error) {
      setVerifing(false);
      setVerificationError(error);
    }
    if (success) {
      setVerifing(false);
      onSucces();
      close();
      return;
    }
    console.log("data de verificacion:", data);
  }

  async function loadSendCode() {
    setSending(true);
    setSendingError(null);
    const res = await SendVerificationCode(email);
    const data = await res.json();
    console.log("Send code says:", data);
    const { error, success } = data;
    setSending(false);
    if (error) return setSendingError(error);
    if (success) return setSendingError(null);
  }

  function close() {
    setCode(null);
    onClose();
  }

  if (!open) return;
  return (
    <>
      <div
        className={`fixed inset-0 flex items-center justify-center 
      ${currentTheme.colors.primary}/60 z-50`}
      >
        <div
          className={`p-6 rounded-lg shadow-lg w-full max-w-md 
        ${currentTheme.colors.secondary} ${currentTheme.textColor.primary}`}
        >
          <h2 className="text-xl font-semibold mb-4 text-center">
            Email Verification
          </h2>
          <p className={`${currentTheme.textColor.secondary} mb-4 text-center`}>
            Please enter the 6-digit code we sent to your email.
          </p>

          <input
            onChange={(e) => setCode(e.target.value)}
            type="text"
            maxLength={6}
            placeholder="Enter code"
            className={`w-full text-center tracking-widest text-lg font-mono 
          p-3 rounded border mb-4 
          ${currentTheme.colors.third} ${currentTheme.textColor.primary} ${currentTheme.colors.border}`}
          />
          <div className="flex justify-between items-center">
            {sending ? (
              <LoadingSpinner
                text={"sending"}
                color={currentTheme.textColor.primary}
              />
            ) : (
              <div
                onClick={() => loadSendCode()}
                className={`hover:text-blue-400 transition ${
                  sendingError ? ` hover:text-red-500 text-red-400  ` : ""
                }`}
              >
                {sendingError ? "error, try again🔄" : "send again"}
              </div>
            )}
            <div className="flex justify-end gap-3 ">
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded 
            ${currentTheme.colors.fourth} ${currentTheme.textColor.primary} 
            ${currentTheme.colors.hover} transition`}
              >
                Cancel
              </button>
              <button
                onClick={handleVerify}
                className={`px-4 py-2 rounded text-white 
            ${currentTheme.colors.buttonPrimary} 
            ${currentTheme.colors.buttonPrimaryHover} transition`}
              >
                {verifing ? (
                  <LoadingSpinner color={"white"} />
                ) : verificationError ? (
                  "Error🔄"
                ) : (
                  "Verify"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
