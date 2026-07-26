import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";

function SignUp() {
  const [show, setShow] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    setShow(!show);
  };

  const postDetails = () => {};

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (!name || !email || !password || !confirmpassword) {
      toast.error("Please fill all the fields");
      setLoading(false);
      return;
    }

    if (password !== confirmpassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user",
        { name, email, password },
        config
      );

      toast.success("Registration Successful");

      localStorage.setItem("userInfo", JSON.stringify(data));

      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast.error("Error occurred");
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Password</label>

          <div className="password-box">
            <input
              type={show ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="show-btn" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="input-group">
          <label>Confirm Password</label>

          <div className="password-box">
            <input
              type={show ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button className="show-btn" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

export default SignUp;