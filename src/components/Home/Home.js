import Styles from './home.module.css';


function Home() {
    return (
        <div className={`container-fluid ${Styles.home}`}>
            <div className={`main-heading ${Styles.mainHeading}`}>
                <h1 className={Styles.title}>Your next getaway starts here</h1>
                </div>
                  <form className={`d-flex ${Styles.searchForm}`} role="search">
                    <div className={Styles.searchRow}>
                    <input className={`form-control me-2 ${Styles.srcHotel} `} type="search" placeholder="Where" aria-label="Search" />
                    <input className={`form-control me-2 ${Styles.srcHotel} `} type="date" placeholder="Check in and out" aria-label="Check in and out" />
                    <input className={`form-control me-2 ${Styles.srcHotel} `} type="number" placeholder="Travellers" aria-label="Travellers" />
                    </div>
<button className={`btn btn-outline-success ${Styles.srcButton}`} type="submit">Search</button>
</form>
        </div>
    );
}
export default Home;