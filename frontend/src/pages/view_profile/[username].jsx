import UserLayout from "@/layout/userLayout";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import { clientServer } from "@/config";
import styles from "./index.module.css";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import {
  getConnectionsRequest,
  getMyConnectionRequests,
  sendConnectionRequest,
  AcceptConnection,
  getAllUsers,
  getAboutUser,
  followUser,
} from "@/config/redux/action/authAction";
import { formatDistanceToNow } from 'date-fns';


export default function ViewProfilePage({ userProfile }) {
  const searchParames = useSearchParams();
  const router = useRouter();
  const postReducer = useSelector((state) => state.postReducer);
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserFollowed, setIsCurrentUserFollowed] = useState(false);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] =
    useState(false);

  const [isConnectionNull, setIsConnectionNull] = useState(true);

  const getUserPost = async () => {
    await dispatch(getAllPosts());
    await dispatch(
      getConnectionsRequest({ token: localStorage.getItem("token") })
    );
    await dispatch(
      getMyConnectionRequests({ token: localStorage.getItem("token") })
    );
  };

  useEffect(() => {
    let post = postReducer.posts.filter((post) => {
      return post.userId.username === router.query.username;
    });
    setUserPosts(post);
  }, [postReducer.posts]);

  useEffect(() => {
    console.log(authState.connections, userProfile.userId._id);
    if (
      authState.connections.some(
        (user) => user.connectionId._id === userProfile.userId._id
      )
    ) {
      setIsCurrentUserInConnection(true);
      if (
        authState.connections.find(
          (user) => user.connectionId._id === userProfile.userId._id
        ).status_accepted === true
      ) {
        setIsConnectionNull(false);
      }
    }

    if (
      authState.connectionRequest.some(
        (user) => user.userId._id === userProfile.userId._id
      )
    ) {
      setIsCurrentUserInConnection(true);
      if (
        authState.connectionRequest.find(
          (user) => user.userId._id === userProfile.userId._id
        ).status_accepted === true
      ) {
        setIsConnectionNull(false);
      }
    }
  }, [authState.connections, authState.connectionRequest]);

  useEffect(() => {
    getUserPost();
  }, []);

  useEffect(()=>{
            if(authState.isTokenThere){
              console.log("AUTH TOKEN")
              dispatch(getAllPosts())
              dispatch(getAboutUser({token: localStorage.getItem("token")}))
            }
            if(!authState.all_profiles_fetched){
              dispatch(getAllUsers());
            }
        },[authState.isTokenThere])
  useEffect(() => {
    console.log("From View: View Profile");
  });
  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.upperHalf}>
            <div className={styles.leftSide}>
              <div className={styles.imageContainer}>
                <p>Picture</p>
                <img
                  src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                  alt=""
                />
              </div>

              {/* {isCurrentUserInConnection ? 
             <button className={styles.followingButton}>Following</button>:
             <button className={styles.followButton} onClick={(e)=>{
              dispatch(sendConnectionRequest({token:localStorage.getItem("token"), user_id:userProfile.userId._id}))
             }} >Follow</button>
            } */}

              <div style={{ color: "grey", lineHeight: "30px" }}>
                <br />
                <h4>Status</h4>
                <p>Relationship: {userProfile.dating[0]?.relationshipStatus}</p>
                <p>Looking For: {userProfile.dating[0]?.lookingFor}</p>
                <p>Interests: {userProfile.dating[0]?.interests.join(", ")}</p>
              </div>
            </div>
            <div className={styles.rightSide}>
              <div className={styles.infoHeading}>
                <p>Information</p>
              </div>
              <div style={{ paddingInline: "0.4rem" }}>
                <table>
                  <thead>
                    <tr>
                      <th>
                        Basic Info&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ color: "grey" }}>Name</td>
                      <td>{userProfile.userId.name}</td>
                    </tr>
                    <tr>
                      <td style={{ color: "grey" }}>Home Town</td>
                      <td>{userProfile.location}</td>
                    </tr>
                  </tbody>
                </table>

                <br />
                <table>
                  <thead>
                    <tr>
                      <th>Academic Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ color: "grey" }}>College</td>
                      <td>{userProfile.education[0]?.institution}</td>
                    </tr>
                    <tr>
                      <td style={{ color: "grey" }}>Discipline</td>
                      <td>{userProfile.education[0]?.degree}</td>
                    </tr>
                    <tr>
                      <td style={{ color: "grey" }}>Passing Year</td>
                      <td>{userProfile.education[0]?.passingYear}</td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <div>
                  <h3>Bio</h3>
                  <p style={{wordWrap: "break-word", whiteSpace: "normal", overflow: "clip", color: "grey" }}>{userProfile.bio}</p>
                </div>
                <br /><br />
                <div>
                  <h3>Instagram Username</h3>
                  <p style={{ color: "grey" }}>
                    {userProfile.socialLinks?.instagram}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.lowerHalf}>
            <h2 className={styles.recentActivityHeading}>Recent activity</h2>
            <ul style={{display:"flex",flexDirection:"column",gap:"1rem" , color:"grey"}}>
              {userPosts.map((post) => {
              const formattedTimeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
              
               return(  
                <li>
                  <div key={post._id}>
                    {post.media !== "" ? (
                      <div>
                        <p style={{fontSize:"smaller"}}>{formattedTimeAgo}</p>
                        <p style={{fontSize:"larger"}}>{post.body}</p>
                        {post.media.endsWith(".mp4") ||
                        post.media.endsWith(".webm") ? (
                          <video
                            src={`${BASE_URL}/${post.media}`}
                            controls
                            style={{
                              width: "40%",
                              borderRadius: "8px",
                              marginTop: "0.5rem",
                            }}
                          />
                        ) : post.media.endsWith(".pdf") ? (
                          <iframe
                            src={`${BASE_URL}/${post.media}`}
                            style={{
                              width: "40%",
                              height: "200px",
                              border: "none",
                              marginTop: "0.5rem",
                            }}
                            title="PDF Preview"
                          />
                        ) : (
                          <img
                            style={{
                              width: "40%",
                              height:"40%",
                              objectFit:"cover",
                              borderRadius: "8px",
                              marginTop: "0.5rem",
                            }}
                            src={`${BASE_URL}/${post.media}`}
                            alt="Post media"
                          />
                        )}
                      </div>
                    ) : (
                      <div>
                       <p style={{fontSize:"smaller"}}>{formattedTimeAgo}</p>
                      <p style={{fontSize:"larger"}}>{post.body}</p>
                      </div>
                    )}
                  </div>
                </li>
              )})}
            </ul>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  console.log("From View");
  console.log(context.params.username);
  const request = await clientServer.get(
    "/user/get_profile_based_on_username",
    {
      params: {
        username: context.query.username,
      },
    }
  );
  const response = await request.data;
  console.log(response);
  return { props: { userProfile: request.data.profile } };
}
