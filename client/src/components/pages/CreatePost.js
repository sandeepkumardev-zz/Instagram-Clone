import React from "react";
import M from "materialize-css";
import { useHistory } from "react-router-dom";

function CreatePost() {
  const history = useHistory();
  const [title, setTitle] = React.useState("");
  const [image, setImage] = React.useState("");
  const [url, setUrl] = React.useState("");

  const PostDetails = () => {
    console.log("object");
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
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    if (url) {
      // post data in database
      fetch("/createpost", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "#e53935 red darken-1" });
          } else {
            M.toast({
              html: "Created post Success",
              classes: "#26a69a teal lighten-1",
            });
            history.push("/");
            console.log(data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url]);

  return (
    <div
      className="card input-field"
      style={{
        margin: "50px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="file-field input-field">
        <div className="btn #1565c0 blue darken-1">
          <span>Upload Image</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light #1565c0 blue darken-1"
        type="submit"
        onClick={PostDetails}
      >
        Submit
      </button>
    </div>
  );
}

export default CreatePost;
