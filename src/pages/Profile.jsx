import { useState, useEffect } from "react";
// firebase
import { getAuth } from "firebase/auth";

const Profile = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  useEffect(() => {
    setUser(auth.currentUser);
  }, []);
  return user ? <h1>{user.displayName}</h1> : "not logged in";
};

export default Profile;
