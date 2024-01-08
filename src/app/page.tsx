"use client";

import { useEffect, useState } from "react";
import { toast } from "../../node_modules/react-hot-toast/dist/index";
import { handleSignIn, handleSignUp } from "./api";

export default function Home() {
  const [route, setRoute] = useState<"login" | "signup">("login");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setErrorMsg(null);
  }, [route])

  return (
    <main className="flex flex-col px-[1rem] gap-[1rem] items-center justify-center min-h-screen">
      <form
        className="flex flex-col gap-y-3 max-w-[25rem] w-full"
        style={{ display: route === "login" ? "flex" : "none" }}
        onSubmit={async (ev) => {
          ev.preventDefault();

          const form = new FormData(ev.currentTarget);
          const email = form.get("email") as string;
          const password = form.get("password") as string;
          const response = await handleSignIn({ email, password });

          if (response.status === "error") {
            setErrorMsg("Something went wrong while logging you in");
            return;
          }

          window.location.href = "/books";
        }}
      >
        <h2 className="text-[1.2em]">Sign In</h2>

        <label className="flex flex-col gap-y-1">
          <span>Email</span>
          <input
            type="text"
            name="email"
            className="py-[0.5rem] px-[1rem]"
            placeholder="hey@domain"
          />
        </label>

        <label className="flex flex-col gap-y-1">
          <span>Password</span>
          <input
            name="password"
            type="password"
            className="py-[0.5rem] px-[1rem]"
            placeholder="-----"
          />
        </label>

        <label className="flex gap-[1rem] items-center">
          <button
            type="submit"
            className={[
              `py-[0.5rem] px-[1rem]`,
              `bg-green-200 rounded-md`,
            ].join(` `)}
          >
            Login
          </button>

          <button
            type="button"
            className={[`underline`].join(` `)}
            onClick={() => setRoute("signup")}
          >
            Register
          </button>
        </label>
      </form>

      <form
        onSubmit={async (ev) => {
          try {
            ev.preventDefault();

            const form = new FormData(ev.currentTarget);
            const name = form.get("name") as string;
            const email = form.get("email") as string;
            const password = form.get("password") as string;
            const response = await handleSignUp({ email, password, name });

            if (response.status === "error") {
              setErrorMsg("Something went wrong while creating your account");
              return;
            }

            setRoute("login");
          } catch (error) {
            setErrorMsg("Something went wrong while creating your account");
          }
        }}
        className="flex flex-col gap-y-3 max-w-[25rem] w-full"
        style={{ display: route === "signup" ? "flex" : "none" }}
      >
        <h2 className="text-[1.2em]">Sign Up</h2>

        <label className="flex flex-col gap-y-1">
          <span>Name</span>
          <input
            type="text"
            name="name"
            className="py-[0.5rem] px-[1rem]"
            placeholder="hey@domain"
          />
        </label>

        <label className="flex flex-col gap-y-1">
          <span>Email</span>
          <input
            type="text"
            name="email"
            className="py-[0.5rem] px-[1rem]"
            placeholder="hey@domain"
          />
        </label>

        <label className="flex flex-col gap-y-1">
          <span>Password</span>
          <input
            name="password"
            type="password"
            className="py-[0.5rem] px-[1rem]"
            placeholder="-----"
          />
        </label>

        <label className="flex gap-[1rem] items-center">
          <button
            type="submit"
            className={[
              `py-[0.5rem] px-[1rem]`,
              `bg-green-200 rounded-md`,
            ].join(` `)}
          >
            Register
          </button>

          <button
            type="button"
            className={[`underline`].join(` `)}
            onClick={() => setRoute("login")}
          >
            Login
          </button>
        </label>
      </form>

      <div
        style={{ display: errorMsg ? "block" : "none" }}
        className="error flex flex-col gap-y-3 max-w-[25rem] w-full p-[1rem] bg-red-200 rounded-md text-red-900"
      >
        {errorMsg}
      </div>
    </main>
  );
}
