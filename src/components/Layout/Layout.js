import Styles from './Layout.module.css';
import Nav from '../nav/Nav';

function Layout({ children }) {
    return (
        <div className={Styles.layout}>
            <header className={Styles.header}>
            <Nav />
            </header>
            <main className={Styles.main}>{children}</main>
            <footer className={Styles.footer}>
                <p>&copy; 2023 Holidaze. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Layout;