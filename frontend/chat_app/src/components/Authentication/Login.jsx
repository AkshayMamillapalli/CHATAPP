import React, { useState } from 'react'
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/auth.css"

function Login() {
const [show, setShow] = useState(false);
  const [email,setEmail] = useState();
  const [password,setPassword] = useState();
  const [loading,setLoading] = useState(false);

  const navigate = useNavigate();
  const handleClick = (e) =>{
    e.preventDefault();
    setShow(!show);
  }
  const postDetails = () =>{

  }
  const handleSubmit = async (e) =>{
    e.preventDefault();
    setLoading(true);
    if(!email || !password){
      toast.error("Please fill all the fields");
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type":"application/json",
        },
      };
      const {data} = await axios.post("/api/user/login",{email,password},config);
      toast.success("Login Successfull");
      localStorage.setItem("userInfo",JSON.stringify(data));
      setLoading(false);
      if (data.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/chats");
      }
    } 
      catch (error) {
      toast.error("Error Ocurred");
      setLoading(false);
    }
  }
  return (
    <div>
      <h1>Login</h1>
      <form className='auth-form'>
        <label>Email</label>
        <input type="email" name="email" placeholder='Enter your Email' onChange={(e)=>{setEmail(e.target.value)}} />
        <br />
<div className="password-box">
    <input
        type={show ? "text" : "password"}
        placeholder="Enter your Password"
        onChange={(e)=>setPassword(e.target.value)}
    />

    <button
        className="show-btn"
        onClick={handleClick}
    >
        {show ? "Hide" : "Show"}
    </button>
</div>
        <br />
<button
    type="submit"
    className="submit-btn"
    onClick={handleSubmit}
    disabled={loading}
>
    {loading ? "Loading..." : "Login"}
</button>      </form>
    </div>
  )
}
export default Login