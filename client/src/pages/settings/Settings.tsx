import Footer from "../../layout/footer/Footer";
import NavBar from "../../layout/navbar/NavBar";
import MainHeader from "../../layout/main-header/MainHeader";
import MainLayout from "../../layout/main-layout/MainLayout";
import SettingsForm from "../../components/settingsForm/SettingsForm";

import classes from "./Settings.module.scss";

export default function Settings() {
  return (
    <MainLayout>
      <MainHeader title={"Settings"} />
      <div className={classes.settings}>
        <SettingsForm />    
      </div>
      <NavBar />
      <Footer />
    </MainLayout>
  );
}