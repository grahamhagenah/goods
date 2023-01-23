import styles from "~/styles/global.css";
import type { LinksFunction } from "@remix-run/node";
import logo from "public/images/goods-logo.svg";
import { Link } from "@remix-run/react";
import UserInfo from "./userInfo";
import GroupInfo from "./groupInfo";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles }
  ];
};

export default function Navbar( props ) {

  return (
    <nav className="flex">
      <Link to="/goods">
        <img className="logo" src={logo} />
      </Link>
      {props.group && <GroupInfo groupName={props.group.name} group={props.group} /> }
      <UserInfo username={props.user.name}/> 
    </nav>
  )
}