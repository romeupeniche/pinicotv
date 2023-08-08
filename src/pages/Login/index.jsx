import {
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { auth } from "../../firebaseConfig";
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
  "& .MuiInputBase-input": {
    color: "#fff",
  },
});

const LoginButton = styled(Button)({
  marginTop: "1rem",
});

function Login() {
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isWrongPass, setIsWrongPass] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.account.isLoggedIn);

  if (isLoggedIn) {
    return <Navigate to="/series" />;
  }

  const changeToSignUpHandler = () => {
    navigate("/signup");
  };

  const resetWrongPassHandler = () => {
    if (isWrongPass) {
      setIsWrongPass(false);
    }
  };

  const handleAuthAction = async () => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, currentEmail, currentPassword);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      if (err.code === "auth/wrong-password") {
        setIsWrongPass(true);
      } else if (err.code === "auth/user-not-found") {
        // navigate("/signup", { state: { email: currentEmail, password: currentPassword } })
        window.alert("Usuário não encontrado"); // temp
      } else if (err.code === "auth/too-many-requests") {
        window.alert("Tentou muito paizao, espera um poco");
      } else {
        window.alert("Algo de errado aconteceu. Error code: " + err.code);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <LoginForm elevation={3}>
          <Typography variant="h4" mb={5} fontWeight={600}>
            Login
          </Typography>
          <LoginTextField
            label="E-Mail"
            type="email"
            value={currentEmail}
            onChange={(e) => setCurrentEmail(e.target.value)}
            error={isWrongPass}
            helperText={isWrongPass && "Seu e-mail pode estar errado."}
            onFocus={resetWrongPassHandler}
          />
          <LoginTextField
            label="Senha"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            error={isWrongPass}
            helperText={isWrongPass && "Sua senha pode estar errada."}
            onFocus={resetWrongPassHandler}
          />
          <LoginButton
            variant="contained"
            color="primary"
            onClick={handleAuthAction}
          >
            Login
          </LoginButton>
          <Typography mt={10}>
            Novo no PinicoTV?
            <Button
              sx={{ textTransform: "none", fontSize: "1rem" }}
              onClick={changeToSignUpHandler}
            >
              Se cadastre agora!
            </Button>
          </Typography>
        </LoginForm>
      )}
    </>
  );
}

export default Login;
