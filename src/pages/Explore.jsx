import { Link } from "react-router-dom";
// components
import Slider from "../components/Slider";
// images
import rentCategoryImage from "../assets/jpg/rentCategoryImage.jpg";
import sellCategoryImage from "../assets/jpg/sellCategoryImage.jpg";

const Explore = () => {
  return (
    <div className="explore">
      <header>
        <p className="pageHeader">Explore</p>
        <main>
          <Slider />
          <p className="exploreCategoryHeading">Categories</p>
          <div className="exploreCategories">
            <Link to="/category/rent">
              <img
                src={rentCategoryImage}
                alt="rent"
                className="exploreCategoryImg"
              />
              <p className="exploreCategoryName">Places for rent</p>
            </Link>
            <Link to="/category/sale">
              <img
                src={sellCategoryImage}
                alt="sell"
                className="exploreCategoryImg"
              />
              <p className="exploreCategoryName">Places for sale</p>
            </Link>
          </div>
        </main>
      </header>
    </div>
  );
};

export default Explore;
