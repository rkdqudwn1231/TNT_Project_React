import { NavLink, useLocation } from "react-router-dom";
import styles from "./Header.module.css";

const SubTabs = ({ cx , onClickItem  }) => {
  const { pathname } = useLocation();

  let tabs = [];

  if (pathname.startsWith("/color")) {
    tabs = [

    ];
  }

  if (pathname.startsWith("/body")) {
    tabs = [

    ];
  }

  if (pathname.startsWith("/fitroom")) {
    tabs = [
      { label: "FitRoom", path: "/fitroom", end: true }, 
      { label: "Closet", path: "/fitroom/closet" },
      { label: "Model", path: "/fitroom/model" },
      { label: "History", path: "/fitroom/history" },
    ];
  }

  return (
<div className={styles.subTabs}>
    {tabs.map((tab) => (
      <NavLink
        key={tab.label}
        to={tab.path} 
        end={tab.end || false}  
        onClick={onClickItem}          
        className={cx(styles.subTab, styles.subTabActive)}
      >
        {tab.label}
      </NavLink>
    ))}
  </div>
  );
};

export default SubTabs;        