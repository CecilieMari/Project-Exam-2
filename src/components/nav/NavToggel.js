import Style from "./NavToggel.module.css";

function NavToggle({ open, onClick }) {
  return (
    <button
      className={`navbar-toggler ms-auto ${Style.toggler}`}
      type="button"
      aria-expanded={open}
      aria-label="Toggle navigation"
      onClick={onClick}
    >
      {open ? (
        // Kryss-ikon (X)
        <span style={{ fontSize: "2rem", lineHeight: 1, color: "#FE3301" }}>
          &#10005;
        </span>
      ) : (
        // Hamburger-ikon (≡)
        <span style={{ fontSize: "2rem", lineHeight: 1, color: "#FE3301" }}>
          &#9776;
        </span>
      )}
    </button>
  );
}

export default NavToggle;
