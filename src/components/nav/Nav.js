import { useState } from 'react';
import { Link } from 'react-router-dom';
import Styles from './Nav.module.css';

function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className={`navbar navbar-expand-lg bg-body-tertiary ${Styles.Nav}`}>
      <div className={`container-fluid ${Styles.Nav}`}>
        <button
          className={`navbar-toggler ${Styles.Nav}`}
          type="button"
          aria-controls="navbarTogglerDemo03"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
        >
          <span className={`navbar-toggler-icon ${Styles.Nav}`}></span>
        </button>
        <Link className={`navbar-brand ${Styles.Nav}`} to="/">Navbar</Link>
        <div className={`collapse navbar-collapse${open ? ' show' : ''} ${Styles.Nav}`} id="navbarTogglerDemo03">
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
            <input className={`form-control me-2 ${Styles.Nav}`} type="search" placeholder="Search" aria-label="Search"/>
            <button className={`btn btn-outline-success ${Styles.Nav}`} type="submit">Search</button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Nav;