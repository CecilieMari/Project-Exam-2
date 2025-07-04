import { Link } from 'react-router-dom';
import Styles from './Nav.module.css';

function NavDesktop() {
  return (
    <nav className={`navbar navbar-expand-lg bg-body-tertiary ${Styles.Nav}`}>
      <div className={`container-fluid ${Styles.Nav}`}>
        <ul className={`navbar-nav me-auto mb-2 mb-lg-0 ${Styles.Nav}`}>
          <li className={`nav-item ${Styles.Nav}`}>
            <Link className={`nav-link active ${Styles.Nav}`} aria-current="page" to="/">Home</Link>
          </li>
          <li className={`nav-item ${Styles.Nav}`}>
            <Link className={`nav-link ${Styles.Nav}`} to="/link">Link</Link>
          </li>
          <li className={`nav-item ${Styles.Nav}`}>
            <span className={`nav-link disabled ${Styles.Nav}`} aria-disabled="true">Disabled</span>
          </li>
        </ul>
        <form className={`d-flex ${Styles.Nav}`} role="search">
          <input className={`form-control me-2 ${Styles.Nav} ${Styles.orderRadius}`} type="search" placeholder="Search" aria-label="Search"/>
          <button className={`btn btn-outline-success ${Styles.Nav}`} type="submit">Search</button>
        </form>
      </div>
    </nav>
  );
}

export default NavDesktop;