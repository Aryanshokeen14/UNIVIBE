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
import {getAboutUser, getConnectionsRequest , getMyConnectionRequests, sendConnectionRequest} from "@/config/redux/action/authAction"
import { current } from "@reduxjs/toolkit";

export default function ProfilePage() {
  const authState = useSelector((state)=> state.auth)
  const postReducer = useSelector((state)=> state.postReducer)
  const dispatch = useDispatch()
  const [userProfile , setUserProfile] = useState({})
  const [userPosts , setUserPosts] = useState([])
 
  
  useEffect(()=>{
    dispatch(getAboutUser({token:localStorage.getItem("token")}))
    dispatch(getAllPosts())
  },[])
  
  useEffect(()=>{
      if(authState.user != undefined){
        setUserProfile(authState.user)
        let post = postReducer.posts.filter((post)=>{
           return post.userId.username === authState.user.userId.username
         })
         setUserPosts(post)
    }
  },[authState.user, postReducer.posts])
  

  const updateProfilePicture = async (file) =>{
    const formData = new FormData()
    formData.append("profile_picture", file)
    formData.append("token", localStorage.getItem("token"))
    const response = await clientServer.post("/update_profile_picture", formData,{
        headers:{
            'Content-Type' : 'multipart/form-data',
        }
    })
    dispatch(getAboutUser({token: localStorage.getItem("token")}))
  }


  const updateProfileData = async()=>{
    const request = await clientServer.post("/user_update", {
      token: localStorage.getItem("token"),
      name: userProfile.userId.name
    })

    const response = await clientServer.post("/update_profile_data",{
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currentPost: userProfile.currentPost,
      education: userProfile.education,
      dating: userProfile.dating
    })
    dispatch(getAboutUser({token: localStorage.getItem("token")}))
  }
  
  
  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile.userId &&
        <div className={styles.container}>
          <div className={styles.leftSide}>
            <label htmlFor="profilePictureUpload">
                <div htmlFor="profilePictureUpload"  className={styles.imageContainer}>
              <p>Picture</p>
              <img
                src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                alt=""
              />
            </div>
            </label>
            <input hidden type="file" id="profilePictureUpload" onChange={(e)=>{
                updateProfilePicture(e.target.files[0])
            }}/>
            <p>@{userProfile.userId.username}</p>

            

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
                  <td><input className={styles.nameEdit} type="text" value={userProfile.userId.name} onChange={(e)=>{
                    setUserProfile({...userProfile, userId: {...userProfile.userId , name: e.target.value}})
                  }}/></td>
    
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
              <textarea value={userProfile.bio} 
                onChange={(e)=>{
                  setUserProfile({...userProfile, bio: e.target.value})
                }}
                rows={Math.max(3,Math.ceil(userProfile.bio.length / 80))}
                className={styles.bioEdit}
              />
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

          {userProfile != authState.user && 
              <div onClick={()=>{
                updateProfileData()
              }} className={styles.updateButton}>
                <button>Update</button>
              </div>
          }

          </div>

        </div>
        }
      </DashboardLayout>
    </UserLayout>
  );
}