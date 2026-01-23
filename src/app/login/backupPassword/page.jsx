"use client";
import { useRef, useState } from "react";
import { useTheme } from "@/context/themeContext";
import { _POST_, SendVerificationCode } from "@/utils/functions";
import { regexEmail } from "@/utils/consts";
import { RetryIcon } from "@/Icons/RetryIcon";
import { useRouter } from "next/navigation";

export default function BackupPasswordPage() {
  const { currentTheme } = useTheme();
  const color = currentTheme.colors;
  const tcolor = currentTheme.textColor;
  const lcolor = currentTheme.linkColor;

  // states

  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [restartingPass, setRestartingPass] = useState(false);
  const [buttonSendCodeText, setButtonSendCodeText] = useState("Send");
  const [errorMensaje, setErrorMessaje] = useState("");

  // states input
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  //ref
  let RememberEmail = useRef(null);

  const router = useRouter();

  // Function to Send the Code
  async function handleFomrSendVerificationCode(e) {
    e.preventDefault();
    RememberEmail.current = email;
    if (!regexEmail.test(email)) alert("Email format incorrect");
    setSending(true);
    const { success, error, messaje, code } = await SendVerificationCode(
      email,
    ).then((res) => res.json());
    setSending(false);
    if (success) {
      setButtonSendCodeText("Send Again");
      setSent(true);
      console.log("Code:", code);
    }

    if (error) {
      const icon = (
        <div className={` flex justify-center  ${color.errorText}`}>
          <RetryIcon />
        </div>
      );
      setButtonSendCodeText(icon);
    }
  }

  // Function to Verify the code and restart password
  async function handleFormRestartPassword(e) {
    e.preventDefault();
    setErrorMessaje("");
    if (!sent)
      return setErrorMessaje("You need to send the code to your email first");
    if (!code || !password || !cpassword) return;
    if (password != cpassword) return setErrorMessaje("Passwords do not match");
    if (password.trim().length <= 8 || cpassword.trim().length <= 8)
      return setErrorMessaje("Password needs more than 8 characteres");

    setRestartingPass(true);
    const res = await _POST_(
      `${window.location.origin}/api/user/restart-password`,
      {
        code,
        password,
        cpassword,
        email: RememberEmail.current,
      },
    );
    setRestartingPass(false);

    if (res.ok) {
      router.push("/login");
    } else {
      const { error } = await res.json();
      switch (error) {
        case "code not found":
          return setErrorMessaje("There is not email related with that code");
        case "espired":
          return setErrorMessaje("The code has already expired");
        case "used":
          return setErrorMessaje("The code has been already used");
        case "code not match":
          return setErrorMessaje("The code do not match");
          case 'user not found': 
          return setErrorMessaje("There is no user with that email");
        default:
          return setErrorMessaje("There was an error restarting the password");
      }
    }
  }

  return (
    <section className={`${tcolor.primary} w-full h-[100vh] overflow-auto `}>
      <div
        className={`flex flex-col min-h-[100vh] space-y-5 justify-center items-center `}
      >
        {/* Code sending form  */}
        <form
          onSubmit={(e) => handleFomrSendVerificationCode(e)}
          className={`${color.secondary}  flex flex-col w-full max-w-[400px]  p-4 rounded-xl space-y-3`}
        >
          <h1 className=" text-center text-xl ">Restart Password</h1>
          <span className={`${tcolor.muted} text-sm `}>
            We are going to send a email to your direcction with a code{" "}
          </span>
          <label htmlFor={`b-email`}> Email </label>
          <input
            id="b-email"
            type="email"
            className={`${color.primary} rounded-xl px-3 py-1 outline-none `}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className={` w-full  max-w-[150px] ${color.buttonPrimary} ${color.buttonPrimaryHover} rounded-sm  py-1 m-auto  transition`}
          >
            {sending ? "Sending..." : buttonSendCodeText}
          </button>
        </form>

        {/* Restart password form */}
        <form
          onSubmit={(e) => handleFormRestartPassword(e)}
          className={`${color.secondary} flex flex-col w-full max-w-[400px]  p-4 rounded-xl space-y-3 `}
        >
          <div className={`${color.errorText} m-auto `}>{errorMensaje}</div>

          <label htmlFor={`b-code`}> Code </label>
          <input
            id="b-code"
            type="text"
            className={`${color.primary} m-auto max-w-[100px] rounded-xl px-3 py-1 outline-none `}
            onChange={(e) => setCode(e.target.value)}
          />

          <label htmlFor={`b-password`}> password </label>
          <input
            id="b-password"
            type="password"
            className={`${color.primary} rounded-xl px-3 py-1 outline-none `}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor={`b-cpassword`}> confirm password </label>
          <input
            id="b-cpassword"
            type="password"
            className={`${color.primary} rounded-xl px-3 py-1 outline-none `}
            onChange={(e) => setCpassword(e.target.value)}
          />

          <button
            className={` w-full  max-w-[150px] ${color.buttonPrimary} ${color.buttonPrimaryHover} rounded-sm  py-1 m-auto  transition`}
          >
            {restartingPass ? "Loading..." : "Confirm"}
          </button>
        </form>
      </div>
    </section>
  );
}
