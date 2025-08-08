import React , { useEffect }from 'react'
import DashboardLayout from '../../layout/DashboardLayout'
import UserLayout from '../../layout/userLayout'
import { useSelector } from 'react-redux';
import { getAllUsers, getAboutUser } from '@/config/redux/action/authAction';
import { useDispatch } from 'react-redux';
import { BASE_URL } from '@/config';
import styles from "./index.module.css"
import { useRouter } from 'next/router';
import {getAllPosts} from '@/config/redux/action/postAction'

export default function DiscoverPage() {
  const authState = useSelector((state)=> state.auth)
  const router = useRouter()
  const dispatch = useDispatch();
  useEffect(()=>{
    if(!authState.all_profiles_fetched){
      dispatch(getAllUsers());
    }
  },[])
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
  return (
    
     <UserLayout>
       <DashboardLayout>
        <div className={styles.container}>
            <h1>Campus Students</h1>
            <br />
            <div className={styles.allUserProfile}>
              {authState.all_profiles_fetched && authState.all_users.map((user)=>{
                return(
                  <div onClick={()=>{
                    router.push(`/view_profile/${user.userId.username}`)
                  }} key={user._id} className={styles.userCard}>
                    <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
                    
                      <div style={{display:"flex",justifyContent:"center"}}><h3>{user.userId.name}</h3></div>
                    
                  </div>
                )
              })}
            </div>
        </div>
       </DashboardLayout>
    </UserLayout>
  )
}
