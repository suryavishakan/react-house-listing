import { useEffect, useState } from "react";
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

const Offers = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // get reference
        const listingsRef = collection(db, "listings");
        // query
        const q = query(listingsRef, where("offer", "==", true), limit(10));
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
      } catch (err) {
        toast.error("Could not fetch listings");
      }
    };
    fetchListings();
  }, []);

  // pagination

  const handleFetchMoreListings = async () => {
    try {
      // get reference
      const listingsRef = collection(db, "listings");
      // query
      const q = query(
        listingsRef,
        // query
        where("offer", "==", true),
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
        <p className="pageHeader">Offers</p>
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
        <p>There are no current offers</p>
      )}
    </div>
  );
};

export default Offers;
