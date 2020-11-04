import React from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";

function Profile() {
  const [userprofile, setUserprofile] = React.useState(null);
  const { id } = useParams();
  const { state, dispatch } = React.useContext(UserContext);

  const [showFollow, setshowFollow] = React.useState(
    state && !state.following.includes(id)
  );

  React.useEffect(() => {
    fetch(`/user/${id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        setUserprofile(result);
      });
  }, []);

  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setUserprofile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setshowFollow(false);
      });
  };

  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));

        setUserprofile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item != data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
        setshowFollow(true);
      });
  };

  return (
    <>
      {userprofile ? (
        <div style={{ maxWidth: "600px", margin: "0px auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "18px 0px",
              borderBottom: "1px solid lightgray",
            }}
          >
            <div>
              <img
                src={userprofile.user.pic}
                alt="loading pic"
                style={{ width: "160px", height: "160px", borderRadius: "50%" }}
              />
            </div>
            <div>
              <h4>{userprofile.user.username}</h4>
              <h5>{userprofile.user.email}</h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "110%",
                }}
              >
                <h6>{userprofile.posts.length} posts</h6>
                <h6>{userprofile.user.followers.length} followers</h6>
                <h6>{userprofile.user.following.length} following</h6>
              </div>
              {showFollow ? (
                <button
                  className="btn waves-effect waves-light #1565c0 blue darken-1"
                  type="submit"
                  onClick={followUser}
                  style={{ margin: "5px" }}
                >
                  Follow
                </button>
              ) : (
                <button
                  className="btn waves-effect waves-light #e53935 red darken-1"
                  type="submit"
                  onClick={unfollowUser}
                  style={{ margin: "5px" }}
                >
                  Unfollow
                </button>
              )}
            </div>
          </div>

          <div className="gallery">
            {userprofile.posts.map((item) => {
              return (
                <img key={item._id} className="item" src={item.photo} alt="" />
              );
            })}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

export default Profile;
