import { useMediaQuery } from "react-responsive";
import NavDesktop from "./NavDesktop";
import NavMobile from "./NavMobile";

function Nav() {
  const isMobile = useMediaQuery({ maxWidth: 991 });

  return isMobile ? <NavMobile /> : <NavDesktop />;
}

export default Nav;
