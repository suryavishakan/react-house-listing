import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// firestore
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  startAfter,
} from "firebase/firestore";
// db
import { db } from "../firebase/firebase.config";
// react toastify
import { toast } from "react-toastify";
// spinner
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

const Category = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // get reference
        const listingsRef = collection(db, "listings");
        // query
        const q = query(
          listingsRef,
          where("type", "==", params.categoryName),
          limit(10)
        );
        // execute query
        const querySnap = await getDocs(q);

        const listings = [];

        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
        setLoading(false);
        console.log(listings);
      } catch (err) {
        toast.error("Could not fetch listings");
      }
    };
    fetchListings();
  }, [params.categoryName]);

  // pagination

  const handleFetchMoreListings = async () => {
    try {
      // get reference
      const listingsRef = collection(db, "listings");
      // query
      const q = query(
        listingsRef,
        where("type", "==", params.categoryName),
        startAfter(lastFetchedListing),
        limit(10)
      );
      // execute query
      const querySnap = await getDocs(q);

      const listings = [];

      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings((prev) => [...prev, ...listings]);
      setLoading(false);
      console.log(listings);
    } catch (err) {
      toast.error("Could not fetch listings");
    }
  };

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          Places for {params.categoryName === "rent" ? "rent" : "sale"}
        </p>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>
          <br />
          <br />
          {lastFetchedListing && (
            <p className="loadMore" onClick={handleFetchMoreListings}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>No listings for {params.categoryName}</p>
      )}
    </div>
  );
};

export default Category;
