import { useLocation, useNavigate } from "react-router-dom";
// firebase
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// firestore
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
// db
import { db } from "../firebase/firebase.config";
// react toastify
import { toast } from "react-toastify";
// google icon
import googleIcon from "../assets/svg/googleIcon.svg";

const GoogleOAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const user = res.user;

      // check if the user already exists
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      // if the user doesn't exist , create user
      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (err) {
      toast.error("Could not authorize with google");
    }
  };

  return (
    <div className="socialLogin">
      <p>Sign {location.pathname === "/sign-up" ? "Up" : "In"} with</p>
      <button className="socialIconDiv">
        <img
          className="socialIconImg"
          src={googleIcon}
          alt="google icon"
          onClick={onGoogleClick}
        />
      </button>
    </div>
  );
};

export default GoogleOAuth;
