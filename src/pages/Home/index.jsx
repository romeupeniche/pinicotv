import { Button, Typography, styled } from "@mui/material";
import { Container } from "@mui/material";
import { Navigate, useNavigate } from "react-router";
import { useSelector } from "react-redux";

const CenteredContainer = styled(Container)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
});

const StyledButton = styled(Button)({
  marginTop: "2rem",
  color: "#fff",
  fontFamily: "'SF Pro Display', sans-serif",
  borderColor: "#c70808",
  "&:hover": {
    backgroundColor: "#8b0000",
  },
});

function Home() {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.account.isLoggedIn);

  if (isLoggedIn) {
    return <Navigate to="/series" />;
  }

  const handleSignUpClick = () => {
    navigate("/signup");
  };
  return (
    <>
      <CenteredContainer>
        <Typography variant="h1" fontSize="3rem" mb={2}>
          Plataforma de streaming gratuita sem lero-lero.
        </Typography>
        <Typography variant="h2" fontSize="2rem">
          Assista tanto no celular quanto no computador.
        </Typography>
        <StyledButton variant="outlined" onClick={handleSignUpClick}>
          Cadastre-se para começar!
        </StyledButton>
      </CenteredContainer>
    </>
  );
}

export default Home;
