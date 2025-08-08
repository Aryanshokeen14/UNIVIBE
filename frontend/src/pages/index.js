import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/navigation";
import UserLayout from "../layout/userLayout";

const inter = Inter({ subsets: ["latin"] });


export default function Home() {
   
  const router = useRouter();
  return (
    <UserLayout>
      <div className={styles.container}>

        <div className={styles.mainContainer}>

          <div className={styles.mainContainer_left}>
            <p>Connect with Friends without <br />Exaggeration</p>
            <p>A true social media platform, with stories no blufs !</p>
            <div onClick={()=>{
              router.push("/login")
            }} className="buttonJoin" style={{border:"1px solid white", padding:"10px 20px", borderRadius:"5px", cursor:"pointer", backgroundColor:"#000000ff", width:"fit-content", marginTop:"20px"}}>
              <p>Join Now</p>
              </div>
          </div>


          <div className={styles.mainContainer_right}>
            <Image style={{width:"90%"}} src="/images/landingImage.png" alt="connection image" />
          </div>


        </div>

      </div>
    </UserLayout>
  );
}
