import React from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";

function Home() {
  const [blank, setBlank] = React.useState(false);
  const [posts, setPosts] = React.useState([]);
  const { state, dispatch } = React.useContext(UserContext);
  React.useEffect(() => {
    fetch("/followingposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result.posts);
        setPosts(result.posts);
        if (result.posts.length == 0) {
          setBlank(false);
        } else {
          setBlank(true);
        }
      });
  }, [posts]);

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = posts.map((item) => {
          if (item.id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setPosts(newData);
      });
  };
  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = posts.map((item) => {
          if (item.id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setPosts(newData);
      });
  };

  const comment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: postId,
        text: text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = posts.map((item) => {
          if (item.id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setPosts(newData);
      });
  };

  const deletePost = (postId) => {
    fetch(`/delete/${postId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = posts.filter((item) => {
          return item.id !== result._id;
        });
        setPosts(newData);
      });
  };

  return (
    <div className="home">
      {blank ? (
        posts.map((item) => {
          return (
            <div className="card home-card" key={item._id}>
              <h5 className="username">
                <Link
                  to={
                    item.postedBy._id !== state.id
                      ? `/profile/${item.postedBy._id}`
                      : "/profile"
                  }
                >
                  <img
                    src={item.postedBy.pic && item.postedBy.pic}
                    alt="loading pic"
                    style={{
                      width: "35px",
                      height: "35px",
                      borderRadius: "50%",
                      margin: "3px 0px 0px 3px",
                    }}
                  />
                </Link>

                {item.postedBy._id == state.id && (
                  <i
                    className="material-icons"
                    onClick={() => {
                      deletePost(item._id);
                    }}
                    style={{ float: "right" }}
                  >
                    delete
                  </i>
                )}
              </h5>
              <div className="card-image">
                <img src={item.photo} alt="" />
              </div>
              <div className="card-content">
                <i className="material-icons" style={{ color: "red" }}>
                  favorite
                </i>
                {item.likes.includes(state.id) ? (
                  <i
                    className="material-icons"
                    onClick={() => {
                      unlikePost(item._id);
                    }}
                  >
                    thumb_down
                  </i>
                ) : (
                  <i
                    className="material-icons"
                    onClick={() => {
                      likePost(item._id);
                    }}
                  >
                    thumb_up
                  </i>
                )}
                <h6 style={{ margin: "0", marginBottom: "5px" }}>
                  {item.likes.length} likes
                </h6>
                <p>
                  <strong>
                    {item.postedBy.username && item.postedBy.username}
                  </strong>{" "}
                  {item.title}
                </p>
                comments ⤵
                {item.comments.map((record) => {
                  return (
                    <p key={record._id}>
                      <strong>{record.postedBy.username}</strong> {record.text}
                    </p>
                  );
                })}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    comment(e.target[0].value, item._id);
                    e.target[0].value = "";
                  }}
                >
                  <input type="text" placeholder="add a comment" />
                </form>
              </div>
            </div>
          );
        })
      ) : (
        <center>
          <h4>
            To see other post, click <i class="material-icons">explore</i> and
            follow others users. <br /> Create your own post click{" "}
            <i class="material-icons">add_circle_outline</i>.
          </h4>
        </center>
      )}
    </div>
  );
}

export default Home;
