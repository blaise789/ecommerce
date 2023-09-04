import React from "react";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";

const Header = () => {
  // const [searchItem, setSearchItem] = useState("");
  return (
    <div className={`${styles.section} `}>
      <div className="hidden md:flex md:justify-between p-16">
        <div>
          <Link to="/">
            <img
              src="https://shopo.quomodothemes.website/assets/images/logo.svg"
              alt="header"
            />
          </Link>
        </div>
        {/* search box */}
        <div className="relative w-[50%]">
          <input
            type="text"
            placeholder="Search Product ..."
            // value={searchItem}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
