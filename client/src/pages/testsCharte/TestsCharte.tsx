import { useNavigate } from "react-router-dom";
import MainButton from "../../components/mainButton/MainButton";

import classes from "./TestsCharte.module.scss";
import Footer from "../../layout/footer/Footer";
import NavBar from "../../layout/navbar/NavBar";
import Header from "../../layout/header/Header";


export default function TestCharte() {
  const navigate = useNavigate();

  return (
    <section >
      {<Header title={"Charte Test"} />}
      <div className={`${classes["test-charte"]}`}>
      <div className={`${classes["test-charte__light"]}`}>
        <p>Light mode Tests</p>
        <MainButton
          mode="light"
          content="Short"
          onClick={() => {
            navigate("/");
          }}
        />
        <MainButton mode="light" accent={true} content="Accent Color" />
      </div>
      <div className={`${classes["test-charte__dark"]}`}>
        <p>Dark mode tests</p>
        <MainButton mode="dark" content="This is a longer and dark button" />
        <MainButton mode="dark" accent={true} content="Accent Color" />
      </div>
      </div>
      <NavBar />
      <Footer />
    </section>
  );
}