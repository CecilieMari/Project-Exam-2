import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Styles from './Nav.module.css';

function NavDesktop() {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <nav className={`navbar navbar-expand-lg ${Styles.Nav}`}>
      <div className={`container-fluid ${Styles.Nav}`}>
        <ul className={`navbar-nav me-auto mb-2 mb-lg-0 ${Styles.Nav}`}>
          <li className={`nav-item ${Styles.Nav}`}>
            <Link className={`nav-link active ${Styles.Nav}`} aria-current="page" to="/">
              Destinasjon
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
  <Link
    className={`nav-link ${Styles.Nav}`}
    to={user?.venueManager ? "/my-venue" : "/my-bookings"}
  >
    {user?.venueManager ? "My Venue" : "My Bookings"}
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
                  onClick={logout}
                >
                  Log out
                </button>
              </li>
            </>
          )}
        </ul>
        
        <form className={`d-flex ${Styles.Nav}`} role="search">
          <input 
            className={`form-control me-2 ${Styles.Nav} ${Styles.orderRadius}`} 
            type="search" 
            placeholder="Search" 
            aria-label="Search"
          />
          <button 
            className={`btn btn-outline-success ${Styles.Nav} ${Styles.srcButton}`} 
            type="submit"
          >
            Search
          </button>
        </form>
      </div>
    </nav>
  );
}

export default NavDesktop;