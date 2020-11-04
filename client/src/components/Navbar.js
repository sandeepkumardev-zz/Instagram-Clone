import React from "react";
import "materialize-css";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";

function Navbar() {
  const history = useHistory();
  const { state, dispatch } = React.useContext(UserContext);
  const renderList = () => {
    if (state) {
      return [
        <li>
          <Link to="/explore">
            <i className="material-icons">explore</i>
          </Link>
        </li>,
        <li>
          <Link to="/create">
            <i className="material-icons">add_circle_outline</i>
          </Link>
        </li>,
        <li>
          <Link to="/profile">
            <i className="material-icons">person</i>
          </Link>
        </li>,

        <li>
          <button
            className="btn waves-effect waves-light #c62828 red darken-3"
            type="submit"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              M.toast({
                html: "Logout success",
                classes: "#e53935 red darken-1",
              });
              history.push("/signin");
            }}
          >
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li>
          <Link to="/signin">Login</Link>
        </li>,
        <li>
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  };
  return (
    <nav>
      <div className="nav-wrapper" style={{ padding: "0px 10px 0px 10px" }}>
        <Link to={state ? "/" : "/signin"} className="brand-logo left">
          Instagram
        </Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
// hide-on-med-and-down
