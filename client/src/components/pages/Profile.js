import React from "react";
import { UserContext } from "../../App";

function Profile() {
  const [mypost, setMypost] = React.useState([]);
  const [image, setImage] = React.useState("");
  // const [url, setUrl] = React.useState("");

  const { state, dispatch } = React.useContext(UserContext);
  React.useEffect(() => {
    fetch("/myposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setMypost(result.myPosts);
        // console.log(result);
      });
  }, []);
  // console.log(state);

  React.useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "sandydev99");

      // post image on cloudnary
      fetch("https://api.cloudinary.com/v1_1/sandydev99/image/upload", {
        method: "Post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              //localstorage
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);
  const updatePic = (file) => {
    setImage(file);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0px auto" }}>
      <div
        style={{
          margin: "18px 0px",
          borderBottom: "1px solid lightgray",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "95%",
          }}
        >
          <div>
            <img
              src={state && state.pic}
              alt="loading pic"
              style={{ width: "160px", height: "160px", borderRadius: "50%" }}
            />
          </div>
          <div>
            <h4>{state && state.username}</h4>
            <h5>{state && state.email}</h5>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "110%",
              }}
            >
              <h6>{mypost && mypost.length} posts</h6>
              <h6>{state && state.followers.length} followers</h6>
              <h6>{state && state.following.length} following</h6>
            </div>
          </div>
        </div>
        <div
          className="file-field input-field"
          style={{ margin: "0px 30px 10px 30px" }}
        >
          <div className="btn #1565c0 blue darken-1">
            <span>Upload Pic</span>
            <input type="file" onChange={(e) => updatePic(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
      </div>
      <div className="gallery">
        {mypost.map((item) => {
          return (
            <img key={item._id} className="item" src={item.photo} alt="" />
          );
        })}
      </div>
    </div>
  );
}

export default Profile;
