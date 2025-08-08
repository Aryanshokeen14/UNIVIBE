import UserLayout from "../../layout/UserLayout";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch} from "react-redux";
import styles from "./style.module.css";
import { loginUser } from "@/config/redux/action/authAction";
import { registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer/index.js";

function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const [userLoginMethod , setUserLoginMethod] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  },[authState.loggedIn])

  useEffect(()=>{
    if(localStorage.getItem("token")){
      router.push("/dashboard");
    }
  },[])

  useEffect(() => {
    dispatch(emptyMessage())
  },[userLoginMethod])

  const handleRegister = ()=>{
    console.log("registering...");
    dispatch(registerUser({username, password, email, name}));
  }
  const handleLogin = ()=>{
    console.log("login...");
    dispatch(loginUser({email, password}));
  } 

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className={styles.cardleft_heading}>{userLoginMethod ? "Sign In" : "Sign Up"}</p>
            <p style={{color: authState.isError ? "red":"green"}}>{authState.message.message}</p>
            <div className={styles.inputContainer}>
             {userLoginMethod ? <></> : <div className={styles.inputRow}>
                <input onChange={(e)=> setUsername(e.target.value)} type="text" placeholder="Username" className={styles.inputField} />&nbsp;
                <input onChange={(e)=> setName(e.target.value)} type="text" placeholder="Name" className={styles.inputField} />
              </div> }
                <input onChange={(e)=> setEmail(e.target.value)} type="text" placeholder="Email" className={styles.inputField} />
                <input onChange={(e)=> setPassword(e.target.value)} type="text" placeholder="Password" className={styles.inputField} />
                <div onClick={()=>{
                  if(userLoginMethod){
                    handleLogin();
                  }else{
                    handleRegister();
                  }
                }} className={styles.buttonWithOutline}>
                  {userLoginMethod ? "Sign In" : "Sign Up"}
                </div>
            </div>
          </div>
          <div className={styles.cardContainer_right}>
            
              {userLoginMethod ? "Don't have an account?" : "Already have an account?"}
              <div onClick={()=> {setUserLoginMethod(!userLoginMethod)}} className={styles.buttonWithOutline} style={{textAlign:"center", padding:"10px 20px", borderRadius:"5px", cursor:"pointer", backgroundColor:"#f0f0f0", color:"black", width:"300px"}}>
                {userLoginMethod ? "Switch to Sign Up" : "Switch to Sign In"}
              </div>
            
           
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
export default LoginComponent;
