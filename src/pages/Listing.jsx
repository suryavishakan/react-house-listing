import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
// leaflet
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
// firebase
import { getAuth } from "firebase/auth";
// firestore
import { getDoc, doc } from "firebase/firestore";
// db
import { db } from "../firebase/firebase.config";
//components
import Spinner from "../components/Spinner";
// swiper
import { Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

// icon
import ShareIcon from "../assets/svg/shareIcon.svg";
// react toastify
import { toast } from "react-toastify";

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sharedLinkCopied, setSharedLinkCopied] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log(docSnap.data());
        setListing(docSnap.data());
        setLoading(false);
      } else {
        toast.error("couldn't fetch listing");
      }
    };
    fetchListing();
  }, [navigate, params.listingId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <Swiper
        modules={[Pagination, Scrollbar, A11y]}
        slidesPerView={1}
        pagination={{ clickable: true }}
      >
        {listing.imageUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div className="swiperSliderDiv">
              <img
                src={listing.imageUrls[index]}
                alt="house listings"
                style={{
                  background: "center no-repeat",
                  objectFit: "cover",
                  width: "100%",
                  maxHeight: "300px",
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="shareIconDiv">
        <img
          src={ShareIcon}
          alt="share icon"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setSharedLinkCopied(true);
            setTimeout(() => {
              setSharedLinkCopied(false);
            }, 1000);
          }}
        />
      </div>
      {sharedLinkCopied && <p className="linkCopied">Link Copied!</p>}

      <div className="listingDetails">
        <p className="listingName">
          {listing.name} - $
          {listing.offer
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <p className="listingLocation">{listing.location}</p>
        <p className="listingType">
          For {listing.type === "rent" ? "Rent" : "Sale"}
        </p>
        {listing.offer && (
          <p className="discountPrice">
            $ {listing.regularPrice - listing.discountedPrice} discount
          </p>
        )}

        <ul className="listingDetailsList">
          <li>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Bedrooms`
              : "1 Bedroom"}
          </li>
          <li>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Bathrooms`
              : "1 Bathrooms"}
          </li>
          <li>{listing.parking && "Parking Spot"}</li>
          <li>{listing.furnished && "Furnished"}</li>
        </ul>

        <p className="listingLocationTitle">Location</p>

        <div className="leafletContainer">
          <MapContainer
            style={{ height: "100%", width: "100%" }}
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
            />
            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}
            >
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className="primaryButton"
          >
            Contact Owner
          </Link>
        )}
      </div>
    </main>
  );
};

export default Listing;
