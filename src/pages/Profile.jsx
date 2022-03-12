import { useState } from "react";
// firebase
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
// firestore
import { updateDoc, doc } from "firebase/firestore";
// firestore db
import { db } from "../firebase/firebase.config";
// react toastify
import { toast } from "react-toastify";

const Profile = () => {
  const auth = getAuth();
  // manage the user name change
  const [changeDetails, setChangeDetails] = useState(false);
  const navigate = useNavigate();

  // state for current user
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  // destructure form data
  const { name, email } = formData;

  // handle user logout
  const handleLogOut = () => {
    auth.signOut();
    navigate("/");
  };

  // handle profile name submit function
  const onSubmit = async () => {
    try {
      auth.currentUser.displayName !== name &&
        // update display name in db
        (await updateProfile(auth.currentUser, {
          displayName: name,
        }));

      // update in firestore
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        name,
      });
      toast.success("Updated successfully");
    } catch (err) {
      toast.error("Could not update profile details");
    }
  };

  // handle user profile name change
  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button className="logOut" onClick={handleLogOut}>
          Logout
        </button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prev) => !prev);
            }}
          >
            {changeDetails ? "done" : "change"}
          </p>
        </div>

        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetails ? "profileName" : "profileNameActive"}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              type="email"
              id="email"
              className={!changeDetails ? "profileEmail" : "profileEmailActive"}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;
