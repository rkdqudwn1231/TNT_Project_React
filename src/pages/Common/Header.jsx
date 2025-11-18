import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";


const Header = () => {

    return (
        <div className={styles.header}>
            <nav>
                <Link to="/">Home</Link> |
                <Link to="/color">Personal Color</Link>|
                  <Link to="/fitroom">FitRoom</Link>
            </nav>
        </div>
    );
};

export default Header;