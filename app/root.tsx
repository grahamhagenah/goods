import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "@remix-run/react";

import Navbar from "~/components/navbar"
import tailwindStylesheetUrl from "./styles/tailwind.css";
import styles from "~/styles/global.css";
import { getUser } from "./session.server";
import Footer from "./components/footer";
import type { LoaderFunction } from "@remix-run/node";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl }, 
    { rel: "stylesheet", href: styles }
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Scant Goods",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  return json({
    user: await getUser(request),
  });
}

export default function App() {
  const data = useLoaderData<typeof loader>();

  let user = "Not Logged In"

  if(data.user !== null) {
    user = data.user;
  }

  return (
    <html lang="en" className="h-full" id="root">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="">
        <Navbar user={user}/>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        {/* <Footer /> */}
      </body>
    </html>
  );
}