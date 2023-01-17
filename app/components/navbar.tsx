import styles from "~/styles/global.css";
import type { LinksFunction } from "@remix-run/node";
import { LoaderArgs, ActionArgs, json} from "@remix-run/node";
import { Outlet, useLoaderData, useTransition, useFetcher } from "@remix-run/react";
import logo from "public/images/goods-logo.svg";
import logout from "public/images/right-from-bracket-solid.svg";
import { Form, Link } from "@remix-run/react";
import IconMenu from "./menu";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles }
  ];
};

export default function Navbar( props ) {

  return (
    <nav className="flex">
      <img className="logo" src={logo} />
      <h1 id="site-title">Scant Goods</h1>
      <div className="nav-items-right">
        <IconMenu username={props.user.name}/>
        <Form action="/logout" method="post">
          <button type="submit" className="p-0">
            <img aria-label="Logout" className="nav-item" src={logout} />
          </button>
        </Form>
      </div>
    </nav>
  )
}