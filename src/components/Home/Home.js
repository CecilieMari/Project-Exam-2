import Styles from './home.module.css';


function Home() {
    return (
        <div className={`container-fluid ${Styles.home}`} >
        <h1>Welcome to Holidaze</h1>
        <p>Your one-stop destination for all things holiday!</p>
        <p>Explore our wide range of holiday packages, book your dream vacation, and make unforgettable memories.</p>

        <p>Whether you're looking for a relaxing beach getaway, an adventurous mountain retreat, or a cultural city tour, we have something for everyone.</p>
        <p>Check out our latest offers and start planning your next holiday today!</p>
        <p>Happy travels!</p>
        <p>Contact us for more information or to book your holiday.</p>
        <p>Follow us on social media for the latest updates and travel inspiration.</p>
        <p>Thank you for choosing Holidaze!</p>
        <p>We look forward to helping you create unforgettable holiday experiences.</p>
        <p>Visit our website for more details and to start your journey with us.</p>
        <p>Happy holidays from the Holidaze team!</p>
        </div>
    );
}
export default Home;