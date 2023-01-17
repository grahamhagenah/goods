import { Link } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import { useOptionalUser } from "~/utils";
import login from "~/styles/login.css";
import { useRef } from "react";
import tailwindStylesheetUrl from "~/styles/tailwind.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: login }
  ];
};


export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="relative sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative">
            <div className="relative px-4 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8 lg:pb-20">
              <h1 className="main-title text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
                <span className="block">
                  Scant Goods
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-lg text-center text-xl sm:max-w-3xl">
                A shared, collaborative checklist for whatever you need to track.
              </p>
              <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                {user ? (
                  <Link
                    to="/goods"
                    className="white-button flex items-center justify-center border rounded-md px-4 py-3 text-base font-medium sm:px-8"
                  >
                    View items for {user.name}
                  </Link>
                ) : (
                  <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                    <Link
                      to="/join"
                      className="white-button flex items-center justify-center px-4 py-3 text-base font-medium sm:px-8"
                    >
                      Sign up
                    </Link>
                    <Link
                      to="/login"
                      className="primary-button flex items-center justify-center rounded-md px-4 py-3 font-medium text-white"
                    >
                      Log In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
