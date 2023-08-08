import {
  AppBar,
  Toolbar,
  Button,
  useScrollTrigger,
  Slide,
  IconButton,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import pinicotvLogo from "../../assets/pinicotvLogo.svg";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const HeaderAppBar = styled(AppBar)(() => ({
  background: `linear-gradient(45deg, #000000 0%, #1c1c1c 70%, #000 100%)`,
}));

const Logo = styled("img")({
  width: "150px",
  cursor: "pointer",
});

const LoginButton = styled(Button)(({ theme }) => ({
  color: "#fff",
  backgroundColor: theme.palette.primary.main,
  fontFamily: "'SF Pro Display', sans-serif",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

function Header(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.account.isLoggedIn);
  const user = useSelector((state) => state.account.user);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogoClick = () => {
    if (!isLoggedIn) {
      navigate("/");
    } else if (location.pathname !== "/series") {
      navigate("/series");
    } else {
      scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleAccountClick = () => {
    if (location.pathname === "/account") {
      scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      navigate("/account");
    }
  };

  const isNotAtTheHomePage = location.pathname !== "/";

  return (
    <HideOnScroll {...props}>
      <HeaderAppBar>
        <Toolbar sx={{ justifyContent: "space-around" }}>
          <Logo
            src={pinicotvLogo}
            alt="PinicoTV Logo"
            onClick={handleLogoClick}
          />
          {!isNotAtTheHomePage ? (
            <LoginButton onClick={handleLoginClick}>Login</LoginButton>
          ) : (
            isLoggedIn && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ ml: 2 }}
                onClick={handleAccountClick}
              >
                <Avatar src={user.photoURL} sx={{ width: 35, height: 35 }} />
              </IconButton>
            )
          )}
        </Toolbar>
      </HeaderAppBar>
    </HideOnScroll>
  );
}

export default Header;
