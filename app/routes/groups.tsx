import { Form, Link } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { LoaderArgs, ActionArgs, json} from "@remix-run/node";

import { safeRedirect, useOptionalUser } from "~/utils";
import goods from "~/styles/login.css";
import { useRef } from "react";
import tailwindStylesheetUrl from "~/styles/tailwind.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: goods }
  ];
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  // const redirectTo = safeRedirect(formData.get("redirectTo"), "/goods");
  const remember = formData.get("remember");
}

export default function Groups() {
  return (
    <div className="flex min-h-full flex-col justify-center pt-16 mt-16">
      <div className="mx-auto w-full max-w-md px-8">
        <h1>Groups</h1>
        <Form method="post" className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                required
                autoFocus={true}
                name="email"
                type="email"
                autoComplete="email"
                aria-describedby="email-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                aria-describedby="password-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
            </div>
          </div>

          <input type="hidden" name="redirectTo" />
          <button
            type="submit"
            className="w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Log in
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              {/* <Link
                className="text-blue-500 underline"
                to={{
                  pathname: "/join",
                  search: searchParams.toString(),
                }}
              >
                Sign up
              </Link> */}
            </div>
          </div>
        </Form>
      </div>
    </div>
  )
}