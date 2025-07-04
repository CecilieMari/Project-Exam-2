import { useState } from 'react';
import { Link } from 'react-router-dom';
import Styles from './NavMobile.module.css'; 
import NavToggle from './NavToggel';


function NavMobile() {
  const [open, setOpen] = useState(false);

  console.log('open', open);

  return (
    <nav className={`navbar navbar-expand-lg bg-body-tertiary ${Styles.Nav}`}>
      <div className={`container-fluid ${Styles.Nav}`}>

      <NavToggle open={open} onClick={() => setOpen(!open)} />
       <div className={`collapse navbar-collapse${open ? ' show' : ''} ${Styles.Nav}`}id="navbarTogglerDemo03">
          <ul className={`navbar-nav me-auto mb-2 mb-lg-0 ${Styles.Nav}`}>
            <li className={`nav-item ${Styles.Nav}`}>
              <Link className={`nav-link active ${Styles.Nav}`} aria-current="page" to="/">Destinasjon</Link>
            </li>
            <li className={`nav-item ${Styles.Nav}`}>
              <Link className={`nav-link ${Styles.Nav}`} to="/link">Registrer</Link>
            </li>
            <li className={`nav-item ${Styles.Nav}`}>
              <Link className={`nav-link ${Styles.Nav}`} to="/link">Log in</Link>
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

export default NavMobile;