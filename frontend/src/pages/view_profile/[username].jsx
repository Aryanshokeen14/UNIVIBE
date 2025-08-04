import UserLayout from "@/layout/UserLayout";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import { clientServer } from "@/config";
import styles from "./index.module.css";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import {getConnectionsRequest , getMyConnectionRequests, sendConnectionRequest} from "@/config/redux/action/authAction"

export default function ViewProfilePage({ userProfile }) {
  const searchParames = useSearchParams();
  const router = useRouter()
  const postReducer = useSelector((state)=>state.postReducer)
  const dispatch = useDispatch()
  const authState = useSelector((state)=> state.auth)
  const [userPosts , setUserPosts] = useState([])
  const [isCurrentUserFollowed , setIsCurrentUserFollowed] = useState(false)
  const [isCurrentUserInConnection , setIsCurrentUserInConnection] = useState(false)
  
  const [isConnectionNull , setIsConnectionNull] = useState(true)

  const getUserPost = async()=>{
    await dispatch(getAllPosts())
    await dispatch(getConnectionsRequest({token:localStorage.getItem("token")}))
    await dispatch(getMyConnectionRequests({token:localStorage.getItem("token")}))
  }

  useEffect(()=>{
    let post = postReducer.posts.filter((post)=>{
      return post.userId.username === router.query.username
    })
    setUserPosts(post)
  },[postReducer.posts])

  useEffect(()=>{
    console.log(authState.connections, userProfile.userId._id)
    if(authState.connections.some(user=> user.connectionId._id === userProfile.userId._id)){
      setIsCurrentUserInConnection(true)
      if(authState.connections.find(user=>user.connectionId._id === userProfile.userId._id).status_accepted === true){
        setIsConnectionNull(false)
      }
    }

    if(authState.connectionRequest.some(user=> user.userId._id === userProfile.userId._id)){
      setIsCurrentUserInConnection(true)
      if(authState.connectionRequest.find(user=>user.userId._id === userProfile.userId._id).status_accepted === true){
        setIsConnectionNull(false)
      }
    }
  },[authState.connections , authState.connectionRequest])
  
  useEffect(()=>{
    getUserPost();
  },[])
  
  
  
  useEffect(() => {
    console.log("From View: View Profile");
  });
  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.leftSide}>
            <div className={styles.imageContainer}>
              <p>Picture</p>
              <img
                src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                alt=""
              />
            </div>
            <p>@{userProfile.userId.username}</p>

            {isCurrentUserInConnection ? 
             <button className={styles.followingButton}>{isConnectionNull? "Follow": "Following"}</button>:
             <button className={styles.followButton} onClick={()=>{
              dispatch(sendConnectionRequest({token:localStorage.getItem("token"), user_id:userProfile.userId._id}))
             }} >Follow</button>
            }
            {/* <button onClick={()=>{
              setIsCurrentUserFollowed(!isCurrentUserFollowed)
             }}>{isCurrentUserFollowed? "Following":"Follow"}

            </button> */}

           <div style={{color:"grey"}}>
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
            <table>
              <thead>
                <tr>
                  <th>Basic Info</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Name</td>
                  <td>{userProfile.userId.name}</td>
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
                  <td>College</td>
                  <td>{userProfile.education[0]?.institution}</td>
                </tr>
                <tr>
                  <td>Discipline</td>
                  <td>{userProfile.education[0]?.degree}</td>
                </tr>
                <tr>
                  <td>Passing Year</td>
                  <td>{userProfile.education[0]?.passingYear}</td>
                </tr>
              </tbody>
            </table>
            <div>
              <h3>Bio</h3>
              <p>{userProfile.bio}</p>
            </div>  
            <div>
              <h3>Recent activity</h3>
              {userPosts.map((post)=>{
                return(
                  <div key={post._id}>
                    {post.media !== "" ? <div><img style={{width:"20%"}} src={`${BASE_URL}/${post.media}`}></img> <p>{post.body}</p></div>
                    : <p>{post.body}</p>}
                  </div>
                )
              })}
            </div>
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
