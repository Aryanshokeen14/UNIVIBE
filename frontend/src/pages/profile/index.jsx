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
import {getAboutUser, getAllUsers, getConnectionsRequest , getMyConnectionRequests, sendConnectionRequest} from "@/config/redux/action/authAction"
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
    if(!authState.all_profiles_fetched){
      dispatch(getAllUsers())
    }
  },[authState.isTokenThere])
  
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
      dating: userProfile.dating,
      location:userProfile.location,
      socialLinks: userProfile.socialLinks
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
                <div className={styles.imageContainer}>
              <p>Edit Picture</p>
              <img
                src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                alt=""
              />
            </div>
            </label>
            <input hidden type="file" id="profilePictureUpload" onChange={(e)=>{
                updateProfilePicture(e.target.files[0])
            }}/>
            <br />

            

           <div style={{color:"grey"}}>
            <h4>Edit Status</h4>
             <p>Relationship: <input
    className={styles.nameEdit}
    type="text" style={{color:"grey"}}
    value={userProfile.dating[0]?.relationshipStatus || ""}
    onChange={(e) => {
      const updatedDating = [...userProfile.dating];
      updatedDating[0] = {
        ...updatedDating[0],
        relationshipStatus: e.target.value,
      };
      setUserProfile({ ...userProfile, dating: updatedDating });
    }}
  /></p>
            <p>Looking For : <input
    className={styles.nameEdit}
    style={{color:"grey"}}
    type="text"
    value={userProfile.dating[0]?.lookingFor || ""}
    onChange={(e) => {
      const updatedDating = [...userProfile.dating];
      updatedDating[0] = {
        ...updatedDating[0],
        lookingFor: e.target.value,
      };
      setUserProfile({ ...userProfile, dating: updatedDating });
    }}
  /></p>
            <p>Interest: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input
    className={styles.nameEdit}
    style={{color:"grey"}}
    type="text"
    value={userProfile.dating[0]?.interests.join(", ") || ""}
    onChange={(e) => {
      const updatedDating = [...userProfile.dating];
      updatedDating[0] = {
        ...updatedDating[0],
        interests: e.target.value.split(",").map((item) => item.trim()),
      };
      setUserProfile({ ...userProfile, dating: updatedDating });
    }}
  /></p>
           </div>

          </div>
          <div className={styles.rightSide}>
            <div className={styles.infoHeading}>
              <p>Edit Information</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Basic Info&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{color:"grey"}}>Name</td>
                  <td><input className={styles.nameEdit} type="text" value={userProfile.userId.name} onChange={(e)=>{
                    setUserProfile({...userProfile, userId: {...userProfile.userId , name: e.target.value}})
                  }}/></td>
                </tr>
                <tr>
                  <td style={{color:"grey"}}>Home Town</td>
                  <td><input className={styles.nameEdit}   type="text" value={userProfile.location} onChange={(e)=>{
                    setUserProfile({...userProfile, location: e.target.value})
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
                  <td style={{color:"grey"}}>College</td>
                 <td>
  <input
    className={styles.nameEdit}
    type="text"
    value={userProfile.education[0]?.institution}
    onChange={(e) => {
      const updatedEducation = [...userProfile.education];
      updatedEducation[0] = {
        ...updatedEducation[0],
        institution: e.target.value,
      };
      setUserProfile({
        ...userProfile,
        education: updatedEducation,
      });
    }}
  />
</td>

                </tr>
                <tr>
                  <td style={{color:"grey"}}>Discipline</td>
                  <td>
  <input
    className={styles.nameEdit}
    type="text"
    value={userProfile.education[0]?.degree || ""}
    onChange={(e) => {
      const updatedEducation = [...userProfile.education];
      updatedEducation[0] = {
        ...updatedEducation[0],
        degree: e.target.value,
      };
      setUserProfile({
        ...userProfile,
        education: updatedEducation,
      });
    }}
  />
</td>

                </tr>
                <tr>
                  <td style={{color:"grey"}}>Passing Year</td>
                  <td>
  <input
    className={styles.nameEdit}
    type="text"
    value={userProfile.education[0]?.passingYear || ""}
    onChange={(e) => {
      const updatedEducation = [...userProfile.education];
      updatedEducation[0] = {
        ...updatedEducation[0],
        passingYear: e.target.value,
      };
      setUserProfile({
        ...userProfile,
        education: updatedEducation,
      });
    }}
  />
</td>

                 
                </tr>
              </tbody>
            </table>
            <div>
              <br />
              <h3>Bio</h3>
              <textarea value={userProfile.bio} 
                onChange={(e)=>{
                  setUserProfile({...userProfile, bio: e.target.value})
                }}
                rows={Math.max(3,Math.ceil(userProfile.bio.length /80))}
                className={styles.bioEdit}
                
              />
            </div>  
            
            <div>
              <br />
              <h3>Instagram Username</h3>
              <input onChange={(e)=>{
                setUserProfile({...userProfile , socialLinks:{...userProfile.socialLinks , instagram: e.target.value}})
              }} className={styles.nameEdit} type="text" value={userProfile.socialLinks?.instagram || ""} placeholder="Enter your insta username"/>
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