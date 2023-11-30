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
import { getGroup, getGroupById, getUserById } from "./models/user.server";
import Footer from "./components/footer";

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
  const user = await getUser(request)
  let group = null

  if(user) {
    group = await getGroupById(user.groupId);
  }
 
  return json({ user, group});
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
        <div id="page-container">
          <Navbar user={user} group={data.group} />
          <div id="content-wrap">
            <Outlet />
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </div>
        </div>
        <Footer/>
      </body>
    </html>
  );
}