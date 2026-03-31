import MainLayout from "../../layout/main-layout/MainLayout";
import MainHeader from "../../layout/main-header/MainHeader";
import NavBar from "../../layout/navbar/NavBar";
import Footer from "../../layout/footer/Footer";

import classes from "./information.module.scss"

export default function Information() {

    return (
        <MainLayout>
            <MainHeader title={"En savoir plus"} />
            <NavBar />
            <div className={classes.information}>
                <h2 className={classes.information__title}>La page En savoir plus est encore en cours de développement</h2>
            </div>
            <Footer />
        </MainLayout>
    )
}