import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; 
import Styles from './NavMobile.module.css'; 
import NavStyles from './Nav.module.css';
import NavToggle from './NavToggel';

function NavMobile() {
  const [open, setOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth(); 

  console.log('open', open);

  return (
    <nav className={`navbar navbar-expand-lg bg-body-tertiary ${Styles.Nav}`}>
      <div className={`container-fluid ${Styles.Nav}`}>

      <NavToggle open={open} onClick={() => setOpen(!open)} />
       <div className={`collapse navbar-collapse${open ? ' show' : ''} ${Styles.Nav}`}id="navbarTogglerDemo03">
          <ul className={`navbar-nav me-auto mb-2 mb-lg-0 ${Styles.Nav}`}>
            <li className={`nav-item ${Styles.Nav}`}>
              <Link className={`nav-link active ${Styles.Nav}`} aria-current="page" to="/">
                Destinasjon
              </Link>
            </li>
            
            {!isLoggedIn ? (
              
              <>
                <li className={`nav-item ${Styles.Nav}`}>
                  <Link className={`nav-link ${Styles.Nav}`} to="/register">
                    Registrer
                  </Link>
                </li>
                <li className={`nav-item ${Styles.Nav}`}>
                  <Link className={`nav-link ${Styles.Nav}`} to="/login">
                    Log in
                  </Link>
                </li>
              </>
            ) : (
              
              <>
                <li className={`nav-item ${Styles.Nav}`}>
                  <Link className={`nav-link ${Styles.Nav}`} to="/my-bookings">
                    My Bookings
                  </Link>
                </li>
                <li className={`nav-item ${Styles.Nav}`}>
                  <span className={`nav-link ${Styles.Nav} ${Styles.welcomeText}`}>
                    Welcome, {user?.name}!
                  </span>
                </li>
                <li className={`nav-item ${Styles.Nav}`}>
                  <button 
                    className={`nav-link btn ${Styles.Nav} ${Styles.logoutBtn}`}
                    onClick={() => {
                      logout();
                      setOpen(false); 
                    }}
                  >
                    Log out
                  </button>
                </li>
              </>
            )}
          </ul>
          <form className={`d-flex ${Styles.Nav}`} role="search">
            <input className={`form-control me-2 ${Styles.Nav}`} type="search" placeholder="Search" aria-label="Search"/>
            <button className={`btn btn-outline-success  ${NavStyles.srcButton}`} type="submit">Search</button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default NavMobile;