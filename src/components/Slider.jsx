import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// firestore
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
// db
import { db } from "../firebase/firebase.config";
// swiper
import { Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
// spinner
import Spinner from "./Spinner";

const Slider = () => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getListings = async () => {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
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
    getListings();
  }, []);

  if (loading) {
    return <Spinner />;
  }
  if (listings.length === 0) {
    return <></>;
  }

  return (
    listings && (
      <>
        <p className="exploreHeading">Recommended</p>
        <Swiper
          modules={[Pagination, Scrollbar, A11y]}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div className="swiperSliderDiv">
                <img
                  src={data.imageUrls[0]}
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
      </>
    )
  );
};

export default Slider;
