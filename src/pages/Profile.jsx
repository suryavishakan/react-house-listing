import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// firebase
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
// firestore
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
// firestore db
import { db } from "../firebase/firebase.config";
// components
import ListingItem from "./../components/ListingItem";
// react toastify
import { toast } from "react-toastify";
// icons
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";

const Profile = () => {
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
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

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "listings");
      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid)
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    };
    fetchUserListings();
  }, [auth.currentUser.uid]);

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

  // handle delete
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "listings", id));
    const updatedListings = listings.filter((listing) => listing.id !== id);
    setListings(updatedListings);
    toast.success("Successfully deleted listing");
  };

  // handle edit
  const handleEdit = (id) => navigate(`/edit-listing/${id}`);

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
        <Link to="/create-listing" className="createListing">
          <img src={homeIcon} alt="home" />
          <p>Sell or Rent your Home</p>
          <img src={arrowRight} alt="arrow right" />
        </Link>

        {!loading && listings?.length > 0 && (
          <>
            <p className="listingText">Your Listings</p>
            <ul className="listingsList">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  handleDelete={() => handleDelete(listing.id)}
                  handleEdit={() => handleEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
};

export default Profile;
