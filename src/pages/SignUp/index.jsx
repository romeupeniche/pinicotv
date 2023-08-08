import { Paper, Typography, TextField, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Navigate, useNavigate } from "react-router";
import { useSelector } from "react-redux";

const LoginForm = styled(Paper)({
  padding: "2rem",
  display: "flex",
  flexDirection: "column",
  background: "rgba(0, 0, 0, 0.2)",
  color: "#fff",
});

const LoginTextField = styled(TextField)({
  marginBottom: "1rem",
  width: 300,
  background: "rgba(0, 0, 0, 0.3)",
  borderRadius: 10,
});

const LoginButton = styled(Button)({
  marginTop: "1rem",
});

function SignUp() {
  const navigate = useNavigate();
  // const location = useLocation();
  // const { user } = location.state;
  const isLoggedIn = useSelector((state) => state.account.isLoggedIn);

  if (isLoggedIn) {
    return <Navigate to="/series" />;
  }

  const changeToLoginHandler = () => {
    navigate("/login");
  };

  const signUpHandler = () => {
    window.alert(
      "Por enquanto você não pode criar uma conta. Peça para o desenvolvedor e ele adicionará sua conta no sistema."
    );
  };

  return (
    <LoginForm elevation={3}>
      <Typography variant="h4" mb={5} fontWeight={600}>
        Cadastro
      </Typography>
      <LoginTextField label="E-Mail" type="email" autoComplete="off" />
      <LoginTextField label="Senha" type="password" autoComplete="off" />
      <LoginTextField
        label="Digite a senha novamente"
        type="password"
        autoComplete="off"
      />
      <LoginButton variant="contained" color="primary" onClick={signUpHandler}>
        Cadastrar
      </LoginButton>
      <Typography mt={10}>
        Já tem uma conta?
        <Button
          sx={{ textTransform: "none", fontSize: "1rem" }}
          onClick={changeToLoginHandler}
        >
          Entre nela agora!
        </Button>
      </Typography>
    </LoginForm>
  );
}

export default SignUp;
