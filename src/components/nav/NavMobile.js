import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; 
import Styles from './NavMobile.module.css'; 
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
                Destination
              </Link>
            </li>
            <li className={`nav-item ${Styles.Nav}`}>
              <Link className={`nav-link ${Styles.Nav}`} to="/all-venues">
                All Venues
              </Link>
            </li>
            {!isLoggedIn ? (
              
              <>
                <li className={`nav-item ${Styles.Nav}`}>
                  <Link className={`nav-link ${Styles.Nav}`} to="/register">
                   Register
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
        </div>
      </div>
    </nav>
  );
}

export default NavMobile;