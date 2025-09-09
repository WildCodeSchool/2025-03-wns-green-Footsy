import { useNavigate } from "react-router-dom";
import MainButton from "../../components/MainButton/MainButton";

import classes from "./TestsCharte.module.scss";

export default function TestCharte() {
  const navigate = useNavigate();

  return (
    <section className={`${classes["test-charte"]}`}>
      <p>This is a dev environment to test some chart components</p>
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
    </section>
  );
}
