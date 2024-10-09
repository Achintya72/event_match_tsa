"use client";

import DataContext from "@/backend/datacontext";
import Button from "@/components/button";
import { useContext } from "react";
import { LoginModal } from "@/components/loginModal";
import { signOut } from "firebase/auth";
import { auth } from "@/backend/firebase";
import { useStudent } from "@/backend/hook";
import OnboardingModal from "@/components/onboardingModal";
export default function Home() {
  const { students, loggedIn, teams, events } = useContext(DataContext);
  const [ student ] = useStudent();

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      window.alert(err);
    }
  }


  return (
    <div className="w-full min-h-screen">
      <nav className="w-full py-[25px] max-w-[1440px] mx-auto z-0 top-0 flex items-center gap-[20px]">
        <h4 className="flex-1 font-rubik">TSA Event Match</h4>
        {loggedIn ?
          <Button className="font-rubik font-semibold" onClick={logOut}>Log Out</Button>
          :
          <Button className="font-rubik font-semibold" >Log In</Button>}
      </nav>
      <main className="w-full min-h-screen max-w-[1440px] mx-auto">
        {loggedIn == false && <LoginModal />}
        {student != undefined && 
          !student.onboarded ? <OnboardingModal /> : <p>Ready for Registration</p>
        
        }
      </main>
    </div>
  );
}
