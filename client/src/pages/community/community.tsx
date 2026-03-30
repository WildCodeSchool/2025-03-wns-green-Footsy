import MainLayout from "../../layout/main-layout/MainLayout";
import MainHeader from "../../layout/main-header/MainHeader";
import NavBar from "../../layout/navbar/NavBar";
import Footer from "../../layout/footer/Footer";

import classes from "./community.module.scss"

export default function Community() {

    return (
        <MainLayout>
            <MainHeader title={"Communauté carbonne"} />
            <NavBar />
            <div className={classes.community}>
                <h2 className={classes.community__title}>La page Communauté carbonne est encore en cours de développement</h2>
            </div>
            <Footer />
        </MainLayout>
    )
}