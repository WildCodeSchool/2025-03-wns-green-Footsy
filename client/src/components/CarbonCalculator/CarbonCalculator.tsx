import classes from "./CarbonCalculator.module.scss";

export default function CarbonCalculator() {
  return (
    <div className={classes.carbonCalculator}>
      <div className={classes.carbonCalculator__content}>
        <h2 className={classes.carbonCalculator__title}>
          Calculateur d'impact carbone
        </h2>
        
        <div className={classes.carbonCalculator__imageContainer}>
          <img 
            src="/src/assets/img/illus/login_carbon_calculator.jpg" 
            alt="Calculateur d'impact carbone"
            className={classes.carbonCalculator__image}
          />
        </div>
        <p className={classes.carbonCalculator__description}>
          Découvrez comment vos choix quotidiens influent sur votre empreinte carbone
        </p>
      </div>
    </div>
  );
}
