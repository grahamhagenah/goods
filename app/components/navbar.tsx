import styles from "~/styles/global.css";
import type { LinksFunction } from "@remix-run/node";
import logo from "public/images/goods-logo.svg";
import IconMenu from "./menu";
import { Link } from "@remix-run/react";
import { getGroup, getGroupById, getUserById } from "~/models/user.server";
import GroupWorkIcon from '@mui/icons-material/GroupWork';

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles }
  ];
};

export default function Navbar( props ) {

  let groupName;

  if(props.group === null) {
    groupName = ""
  }
  else {
    groupName = props.group.name;
  }

  return (
    <nav className="flex">
      <Link to="/goods">
        <img className="logo" src={logo} />
      </Link>
      <IconMenu groupName={groupName} group={props.group} /> 
      <div className="nav-items-right">
        <IconMenu username={props.user.name}/> 
      </div>
    </nav>
  )
}