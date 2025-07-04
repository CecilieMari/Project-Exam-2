function NavToggle({ open, onClick }) {
  return (
    <button
      className="navbar-toggler ms-auto"
      type="button"
      aria-expanded={open}
      aria-label="Toggle navigation"
      onClick={onClick}
      style={{ border: 'none', background: 'transparent' }}
    >
      {open ? (
        // Kryss-ikon (X)
        <span style={{ fontSize: '2rem', lineHeight: 1 }}>&#10005;</span>
      ) : (
        // Hamburger-ikon (≡)
        <span style={{ fontSize: '2rem', lineHeight: 1 }}>&#9776;</span>
      )}
    </button>
  );
}

export default NavToggle;