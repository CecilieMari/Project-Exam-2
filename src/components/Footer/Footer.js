import { Link } from "react-router-dom";
import Styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={Styles.footer}>
      <div className={Styles.logoContainer}>
        <Link to="/">
          <img
            className={Styles.miniLogo}
            src={require("../../img/3.png")}
            alt="Logo"
          />
        </Link>
      </div>
      <div className={Styles.footerContent}>
        <div className={Styles.footerLinks}>
          <Link className={Styles.footerLink} to="/all-venues">
            All Venues
          </Link>
          <Link className={Styles.footerLink} to="/login">
            Log in
          </Link>
          <Link className={Styles.footerLink} to="/register">
            Sign up
          </Link>
        </div>
        <div className={Styles.socialMedia}>
          <div>Follow us</div>
          <div className={Styles.socialIcons}>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={require("../../img/face-footer.png")}
                alt="Facebook"
                className={Styles.socialIcon}
              />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={require("../../img/insta-footer.png")}
                alt="Instagram"
                className={Styles.socialIcon}
              />
            </a>
            <a
              href="https://www.gmail.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={require("../../img/Email-footer.png")}
                alt="E-Mail"
                className={Styles.socialIcon}
              />
            </a>
          </div>
        </div>
      </div>
      <div className={Styles.rights}>
        <p>&copy; 2025 Holidaze. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
