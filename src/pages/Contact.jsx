import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
// firestore
import { doc, getDoc } from "firebase/firestore";
// db
import { db } from "../firebase/firebase.config";
// react toastify
import { toast } from "react-toastify";

const Contact = () => {
  const [message, setMessage] = useState("");
  const [owner, setOwner] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();

  useEffect(() => {
    const getOwner = async () => {
      const docRef = doc(db, "users", params.ownerId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setOwner(docSnap.data());
        console.log(docSnap.data());
      } else {
        toast.error("Couldn't get owner data");
      }
    };
    getOwner();
  }, [params.ownerId]);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Contact Owner</p>
      </header>
      {owner !== null && (
        <main>
          <div className="contactLandLord">
            <p className="landLordName">Contact {owner?.name}</p>
          </div>

          <form className="messageForm">
            <div className="messageDiv">
              <label htmlFor="message" className="messageLabel">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                className="textarea"
                value={message}
                onChange={handleChange}
              />
            </div>

            <a
              href={`mailto:${owner.email}?Subject=${searchParams.get(
                "listingName"
              )}&body=${message}`}
            >
              <button type="button" className="primaryButton">
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  );
};

export default Contact;
