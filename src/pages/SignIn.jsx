import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// react toastify
import { toast } from "react-toastify";
// firebase
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// icons
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
// components
import GoogleOAuth from "../components/GoogleOAuth";

const SignIn = () => {
  // state
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  // destructure form data
  const { email, password } = formData;
  // initialize hook
  const navigate = useNavigate();

  // handle input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredentials.user) {
        navigate("/");
      }
    } catch (err) {
      toast.error("Wrong User Credentials");
    }
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="emailInput"
            placeholder="Email"
            id="email"
            value={email}
            onChange={handleChange}
          />
          <div className="passwordInputDiv">
            {/* if showPassword is true, then change the password input type to text input type */}
            <input
              type={showPassword === true ? "text" : "password"}
              className="passwordInput"
              id="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
            />

            <img
              src={visibilityIcon}
              alt="show password"
              className="showPassword"
              onClick={() => setShowPassword((prev) => !prev)}
            />
          </div>
          <Link to="/forgot-password" className="forgotPasswordLink">
            Forgot Password
          </Link>

          <div className="signInBar">
            <p className="signInText">Sign In</p>
            <button className="signInButton">
              <ArrowRightIcon fill="#fff" width="32px" height="32px" />
            </button>
          </div>
        </form>

        <GoogleOAuth />

        <Link to="/sign-up" className="registerLink">
          Sign Up
        </Link>
      </div>
    </>
  );
};

export default SignIn;
