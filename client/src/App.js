import React, { createContext, useReducer, useContext } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import AllPosts from "./components/pages/AllPosts";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import Profile from "./components/pages/Profile";
import CreatePost from "./components/pages/CreatePost";
import UserProfile from "./components/pages/UserProfile";
import Home from "./components/pages/Home";
import { reducer, initialState } from "./reducers/userReducer";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
      // history.push("/");
    } else {
      history.push("/signin");
    }
  }, []);
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/signin" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/profile" exact component={Profile} />
      <Route path="/create" component={CreatePost} />
      <Route path="/profile/:id" component={UserProfile} />
      <Route path="/explore" component={AllPosts} />
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <Router>
        <div style={{ minWidth: "500px" }}>
          <Navbar />
          <Routing />
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
