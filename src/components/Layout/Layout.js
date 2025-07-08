import Styles from './Layout.module.css';
import Nav from '../nav/Nav';
import logo from '../../img/logo-holidaze.png';
import { Link } from 'react-router-dom';

function Layout({children}) {
    return (
        <div className={Styles.layout}>
            <header className={Styles.header}>
                <div className={Styles.headerContent}>
                    <div className={Styles.logoContainer}>
                        <Link to="/">
                            <img src={logo} alt="Logo" className={Styles.logo}/>
                        </Link>
                    </div>
                    <div className={Styles.navContainer}>
                        <Nav/>
                    </div>
                </div>
            </header>
            <main className={Styles.main}>{children}</main>
            <footer className={Styles.footer}>
                <p>&copy; 2023 Holidaze. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Layout;