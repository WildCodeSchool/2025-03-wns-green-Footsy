import classes from "./CguDetails.module.scss";

export default function CGUDetails() {
  return (
    <main className={classes.cguDetails}>

      {/* ── PARTIE 1 : CGU ── */}

      <section className={classes.cguDetails__section} id="presentation">
        <h2>Article 1 — Présentation du site</h2>
        <p>Le site <strong>Footsy</strong> est une application web développée dans le cadre d'un projet pédagogique de <strong>Wild Code School / Simplon</strong>, en vue de l'obtention du titre professionnel de Concepteur Développeur d'Applications (CDA).</p>
        <p>Footsy permet à ses utilisateurs de suivre et d'évaluer leur empreinte carbone personnelle à travers catégories issus de  l'API Impact CO₂ de l'ADEME.</p>
        <p>⚠️ Ce site est un prototype développé à des fins éducatives. Il n'est pas destiné à un usage commercial ou à une diffusion grand public.</p>
        <ul>
          <li><strong>Équipe :</strong> Claire Cellier, Veronica Cussi, Antoine Foubert, Aude Nectoux</li>
          <li><strong>École :</strong> Wild Code School chez Simplon, 14 Rue de la Beaune, 93100 Montreuil</li>
          <li><strong>Contact :</strong> claire-cellier_student2025@wilder.school</li>
          <li><strong>Hébergeur :</strong>  OVH SAS 2 rue Kellermann - 59100 Roubaix - France</li>
        </ul>
      </section>

      <section className={classes.cguDetails__section} id="acces">
        <h2>Article 2 — Accès au site</h2>
        <p>Le site est accessible gratuitement en tout lieu à tout Utilisateur ayant un accès à Internet. Tous les frais supportés par l'Utilisateur pour accéder au service (matériel informatique, logiciels, connexion Internet, etc.) sont à sa charge. En accédant au Site, vous déclarez avoir lu et accepté les présentes CGU.</p>
        <p>L'équipe se réserve le droit de suspendre ou interrompre l'accès au Site à tout moment, notamment pour des raisons de maintenance ou de fin de projet, sans préavis ni indemnité.</p>
      </section>

      <section className={classes.cguDetails__section} id="compte">
        <h2>Article 3 — Création de compte</h2>
        <p>L'utilisation des fonctionnalités de Footsy nécessite la création d'un compte personnel. Lors de l'inscription, vous fournissez :</p>
        <ul>
          <li>Un nom et prénom</li>
          <li>Une adresse e-mail</li>
          <li>Une date de naissance</li>
          <li>Un mot de passe</li>
        </ul>
        <p>Vous êtes responsable de la confidentialité de vos identifiants. En cas de compromission, contactez l'équipe à <strong>claire-cellier_student2025@wilder.school</strong>.</p>
      </section>

      <section className={classes.cguDetails__section} id="utilisation">
        <h2>Article 4 — Utilisation du site</h2>
        <p>En utilisant Footsy, vous vous engagez à :</p>
        <ul>
          <li>Fournir des informations sincères lors de l'inscription</li>
          <li>Ne pas tenter de porter atteinte au bon fonctionnement du site (attaque, injection, scraping…)</li>
          <li>Ne pas usurper l'identité d'un autre utilisateur</li>
          <li>Utiliser le site uniquement dans un cadre légal et personnel</li>
        </ul>
        <p>Tout manquement pourra entraîner la suppression du compte sans préavis.</p>
      </section>

      <section className={classes.cguDetails__section} id="propriete">
        <h2>Article 5 — Propriété intellectuelle</h2>
        <p>L'ensemble des éléments du Site (code, design, textes, logos) est la propriété de l'équipe Footsy et protégé par le droit d'auteur. Toute reproduction sans autorisation préalable est interdite.</p>
        <p>Les données saisies par l'utilisateur lui appartiennent. L'équipe Footsy ne revendique aucun droit sur ces données.</p>
      </section>

      <section className={classes.cguDetails__section} id="responsabilite">
        <h2>Article 6 — Limitation de responsabilité</h2>
        <p>Footsy étant un projet éducatif, les calculs d'empreinte carbone sont des estimations à titre indicatif, basées sur des données publiques. L'équipe ne peut en garantir l'exactitude.</p>
        <p>L'équipe ne saurait être tenue responsable de dommages directs ou indirects résultant de l'utilisation du Site.</p>
      </section>

      {/* ── PARTIE 2 : RGPD ── */}

      <section className={classes.cguDetails__section} id="traitement">
        <h2>Article 7 — Traitement des données personnelles</h2>
        <p>Conformément au RGPD (UE 2016/679) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée, nous vous informons de la manière dont vos données sont collectées et traitées.</p>

        <h3>Responsable du traitement</h3>
        <p>Claire Cellier — claire-cellier_student2025@wilder.school</p>

        <h3>Données collectées, finalités et bases légales</h3>
        <div className={classes.cguDetails__tableWrapper}>
        <table className={classes.cguDetails__table}>
          <thead>
            <tr>
              <th>Donnée</th>
              <th>Finalité</th>
              <th>Base légale</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Nom, prénom</td><td>Identification, personnalisation</td><td>Consentement (art. 6.1.a)</td></tr>
            <tr><td>Adresse e-mail</td><td>Authentification, communication</td><td>Consentement (art. 6.1.a)</td></tr>
            <tr><td>Date de naissance</td><td>Personnalisation du profil carbone</td><td>Consentement (art. 6.1.a)</td></tr>
            <tr><td>Mot de passe (hashé)</td><td>Sécurisation de l'accès au compte</td><td>Consentement (art. 6.1.a)</td></tr>
            <tr><td>Données transport</td><td>Calcul empreinte carbone — déplacements</td><td>Consentement (art. 6.1.a)</td></tr>
            <tr><td>Données alimentation</td><td>Calcul empreinte carbone — alimentation</td><td>Consentement (art. 6.1.a)</td></tr>
            <tr><td>Données énergie</td><td>Calcul empreinte carbone — énergie</td><td>Consentement (art. 6.1.a)</td></tr>
            <tr><td>Données achats</td><td>Calcul empreinte carbone — consommation</td><td>Consentement (art. 6.1.a)</td></tr>
          </tbody>
        </table>
        </div>

        <h3>Durée de conservation</h3>
        <p>Les données sont conservées pendant la durée du projet et supprimées au plus tard un an après la dernière utilisation.</p>

        <h3>Destinataires</h3>
        <p>Les données sont réservées à l'usage interne de l'équipe. Elles ne sont ni vendues, ni cédées, ni communiquées à des tiers, à l'exception de l'hébergeur OVH pour le stockage.</p>
      </section>

      <section className={classes.cguDetails__section} id="droits">
        <h2>Article 8 — Vos droits</h2>
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul>
          <li><strong>Droit d'accès (art. 15)</strong> : obtenir une copie des données vous concernant</li>
          <li><strong>Droit de rectification (art. 16)</strong> : corriger des données inexactes</li>
          <li><strong>Droit à l'effacement (art. 17)</strong> : demander la suppression de vos données</li>
          <li><strong>Droit à la portabilité (art. 20)</strong> : recevoir vos données dans un format lisible</li>
          <li><strong>Droit d'opposition (art. 21)</strong> : vous opposer au traitement</li>
          <li><strong>Retrait du consentement</strong> : à tout moment, sans affecter les traitements antérieurs</li>
        </ul>
        <p>Pour exercer ces droits : <strong>claire-cellier_student2025@wilder.school</strong>. Délai de réponse : 1 mois maximum.</p>
        <p>En cas de réponse insatisfaisante, vous pouvez saisir la <a className={classes.link} href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a>.</p>
      </section>

      <section className={classes.cguDetails__section} id="securite">
        <h2>Article 9 — Sécurité des données</h2>
        <p>Mesures mises en œuvre :</p>
        <ul>
          <li>Mots de passe hashés via un algorithme sécurisé (bcrypt)</li>
          <li>Communications chiffrées via HTTPS</li>
          <li>Accès aux données restreint aux membres de l'équipe</li>
          <li>Aucune donnée partagée avec des services tiers sans information préalable</li>
        </ul>
        <p>En cas de violation de données, vous serez informé dans les meilleurs délais (art. 34 RGPD).</p>
      </section>

      <section className={classes.cguDetails__section} id="cookies">
        <h2>Article 10 — Cookies</h2>
        <p>Le Site utilise uniquement des cookies strictement nécessaires au fonctionnement (gestion de session). Ces cookies ne nécessitent pas de consentement préalable.</p>
        <div className={classes.cguDetails__tableWrapper}>
        <table className={classes.cguDetails__table}>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Finalité</th>
              <th>Durée</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>[session_id]</td><td>Maintien de la session utilisateur</td><td>Durée de la session</td></tr>
          </tbody>
        </table>
        </div>
        <p>Aucun cookie de tracking publicitaire ou analytique tiers n'est utilisé.</p>
      </section>

      <section className={classes.cguDetails__section} id="modifications">
        <h2>Article 11 — Modifications des CGU</h2>
        <p>L'équipe Footsy se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés des modifications substantielles par e-mail ou via le Site.</p>
        <p>La poursuite de l'utilisation du Site après modification vaut acceptation des nouvelles conditions.</p>
      </section>

      <section className={classes.cguDetails__section} id="contact">
        <h2>Article 12 — Droit applicable &amp; contact</h2>
        <p>Les présentes CGU sont soumises au droit français.</p>
        <address className={classes.cguDetails__address}>
          <strong>Équipe Footsy</strong><br />
          Projet pédagogique CDA — Wild Code School / Simplon<br />
          Email : claire-cellier_student2025@wilder.school<br />
          Adresse : Wild Code School chez Simplon, 14 Rue de la Beaune, 93100 Montreuil
        </address>
      </section>

    </main>
  );
}