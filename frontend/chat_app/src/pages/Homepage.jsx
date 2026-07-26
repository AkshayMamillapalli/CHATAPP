import React, { useState,useEffect } from 'react'
import { useNavigate } from "react-router-dom";

import Login from '../components/Authentication/Login'
import SignUp from '../components/Authentication/SignUp'
import "../styles/Homepage.css"
import shushing from "../assets/shushing.webp"

function Homepage() {
const [page, setPage] = useState("login");
const navigate = useNavigate();

      useEffect(()=>{
          const user = JSON.parse(localStorage.getItem("userInfo"));
  
          if(!user){
              navigate("/");
          }    
      },[navigate]);
  return (
    <div className='homepage'>
      <div className="chat-container" >
        <div className="app-logo">
          <img src={shushing} alt="Logo" className="logo-img" />
          <h2 className="app-title">Usshhh!</h2>
        </div>

        <p className="app-subtitle">
          Real-time messaging made simple
        </p>
        <div className="divider">
          <span>Get Started</span>
        </div>
      <div className='auth-buttons'>
        <button onClick={() => setPage("login")}>Login</button>
        <button onClick={() => setPage("Signup")}>Sign Up</button>
      </div>
        {page === "login" ? <Login /> : <SignUp />}
      </div>
      
    </div>
  )
}

export default Homepage