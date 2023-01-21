import styles from "~/styles/global.css";
import type { LinksFunction } from "@remix-run/node";
import logo from "public/images/goods-logo.svg";
import IconMenu from "./menu";
import { Link } from "@remix-run/react";
import { getGroup, getGroupById, getUserById } from "~/models/user.server";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles }
  ];
};

export default function Navbar( props ) {

  // console.log(props.group.name)

  return (
    <nav className="flex">
      <Link to="/goods">
        <img className="logo" src={logo} />
      </Link>
      <h1 id="site-title">{props.group.name}</h1>
      <div className="nav-items-right">
        <IconMenu username={props.user.name}/> 
      </div>
    </nav>
  )
}