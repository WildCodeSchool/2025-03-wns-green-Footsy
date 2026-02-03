import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";

import community from "../../../assets/img/logos_icons/community.png";
import community_dark from "../../../assets/img/logos_icons/community_dark.png";
import dashboard from "../../../assets/img/logos_icons/dashboard.png";
import dashboard_dark from "../../../assets/img/logos_icons/dashboard_dark.png";
import footprint from "../../../assets/img/logos_icons/footprint.png";
import footprint_dark from "../../../assets/img/logos_icons/footprint_dark.png";
import history from "../../../assets/img/logos_icons/history.png";
import history_dark from "../../../assets/img/logos_icons/history_dark.png";
import information from "../../../assets/img/logos_icons/information.png";
import information_dark from "../../../assets/img/logos_icons/information_dark.png";

import { LOGOUT } from "../../../graphql/operations";
import classes from "./NavBarMobile.module.scss";

interface NavBarMobileProps {
  mode: string;
}

export default function NavBarMobile({ mode }: NavBarMobileProps) {
  const navigate = useNavigate();
  const [logoutMutation] = useMutation(LOGOUT);

  const footprintIcon = mode === "dark" ? footprint_dark : footprint;
  const dashboardIcon = mode === "dark" ? dashboard_dark : dashboard;
  const historyIcon = mode === "dark" ? history_dark : history;
  const communityIcon = mode === "dark" ? community_dark : community;
  const infoIcon = mode === "dark" ? information_dark : information;

  const handleLogout = async () => {
    try {
      await logoutMutation();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <section className={classes.navbarmobile}>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className={classes.navbarmobile__button}
      >
        <img
          src={dashboardIcon}
          alt="dashboard-icon"
          className={classes.navbarmobile__img}
        />
      </button>
      <button
        type="button"
        onClick={() => navigate("/history")}
        className={classes.navbarmobile__button}
      >
        <img
          src={historyIcon}
          alt="history-icon"
          className={classes.navbarmobile__img}
        />
      </button>
      <button
        type="button"
        onClick={() => navigate("/add-activity")}
        className={classes.navbarmobile__button}
      >
        <img
          src={footprintIcon}
          alt="footprint"
          className={classes.navbarmobile__footprint}
        />
      </button>
      <button
        type="button"
        onClick={() => navigate("/community")}
        className={classes.navbarmobile__button}
      >
        <img
          src={communityIcon}
          alt="community-icon"
          className={classes.navbarmobile__img}
        />
      </button>
      <button
        type="button"
        onClick={() => navigate("/information")}
        className={classes.navbarmobile__button}
      >
        <img
          src={infoIcon}
          alt="information-icon"
          className={classes.navbarmobile__img}
        />
      </button>
    </section>
  );
}
