import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../../App";

function Login() {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");

  const PostData = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "Envalid email", classes: "#e53935 red darken-1" });
      return;
    }
    fetch("/signin", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#e53935 red darken-1" });
        } else {
          M.toast({
            html: "Signed In Success",
            classes: "#26a69a teal lighten-1",
          });
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          history.push("/");
          // console.log(data.user);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="mycard">
      <div className="card auth__card input-field">
        <h2>Instagram</h2>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light #1565c0 blue darken-1"
          type="submit"
          onClick={PostData}
        >
          Login
        </button>
        <h5>
          <Link to="/signup">Don't have an account</Link>
        </h5>
      </div>
    </div>
  );
}

export default Login;
