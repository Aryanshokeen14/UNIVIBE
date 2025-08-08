import React, { useEffect } from 'react'
import DashboardLayout from '../../layout/DashboardLayout'
import UserLayout from "../../layout/userLayout";
import { useDispatch, useSelector } from 'react-redux'
import { AcceptConnection, getMyConnectionRequests, getAboutUser, getAllUsers } from '@/config/redux/action/authAction'
import { BASE_URL } from '@/config'
import { useRouter } from 'next/router'
import {getAllPosts} from '@/config/redux/action/postAction'


export default function MyConnectionsPage() {
  const dispatch = useDispatch()
  const authState = useSelector((state)=>state.auth)
  const router = useRouter()

  useEffect(()=>{
    dispatch(getMyConnectionRequests({token:localStorage.getItem("token")}));
  },[])
  useEffect(()=>{
    if(authState.connectionRequest.length != 0){
      console.log(authState.connectionRequest)
    }
  },[authState.connectionRequest])

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
    <div>
       <UserLayout>
       <DashboardLayout>
        {/* <div>
            <h1>My Connections</h1>
            {authState.connectionRequest.length !=0 && authState.connectionRequest.filter((connection)=> connection.status_accepted === null).map((user,index)=>{
              return(
                <div  key={index} style={{display:"flex", alignItems:"center",gap:"2rem",border:"1px solid grey"}}
                onClick={()=>{
                  router.push(`/view_profile/${user.userId.username}`)
                }}>
                  <img style={{width:"10%",borderRadius:"50%"}} src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
                  <p>{user.userId.name}</p>
                  <button onClick={(e)=>{
                    e.stopPropagation()
                    dispatch(AcceptConnection({
                      connectionId: user._id,
                      token: localStorage.getItem("token"),
                      accept: "accept"
                    }))
                  }}>accept</button>
                </div>
              )
            })}


            <h4>hello</h4>
            {authState.connectionRequest.filter((connection)=> connection.status_accepted !== null).map((user,index)=>{
              return(
                <div key={index} style={{display:"flex", alignItems:"center",gap:"2rem",border:"1px solid grey"}}
                onClick={()=>{
                  router.push(`/view_profile/${user.userId.username}`)
                }}>
                  <img style={{width:"10%",borderRadius:"50%"}} src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
                  <p>{user.userId.name}</p>
                  
                </div>
              )
            })}

        </div> */}
        <div style={{display:"flex", justifyContent:"center",alignItems:"center", minHeight:"80vh"}}>
          <h2>Working on it</h2>
        </div>
       </DashboardLayout>
    </UserLayout>
    </div>
  )
}
