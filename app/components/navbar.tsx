import styles from "~/styles/global.css";
import type { LinksFunction } from "@remix-run/node";
import logo from "public/images/goods-logo.svg";
import profile from "public/images/user-regular.svg";
import logout from "public/images/right-from-bracket-solid.svg";
import { Form, Link } from "@remix-run/react";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles }
  ];
};

export default function Navbar() {
  return (
    <nav className="flex">
      <img className="logo" src={logo} />
      <div className="nav-items-right">
        <ol>
          <li>
            <Link to="/login">
              <img aria-label="User Profile" className="nav-item" src={profile} />
            </Link>
          </li>
          <li>
            <Form action="/logout" method="post">
              <button type="submit" className="p-0">
                <img aria-label="Logout" className="nav-item" src={logout} />
              </button>
            </Form>
          </li>
        </ol>
      </div>
    </nav>
  )
}