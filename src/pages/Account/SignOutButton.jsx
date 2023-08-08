import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/accountSlice";
import { setAvatars } from "../../store/avatarsSlice";
import { setSeries } from "../../store/seriesSlice";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router";
import { auth } from "../../firebaseConfig";

function SignOutButton() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSignOut = async () => {
    handleClose();

    try {
      await signOut(auth);
      dispatch(setUser(null));
      dispatch(setAvatars(null));
      dispatch(setSeries(null));
      navigate("/");
    } catch (err) {
      console.log("Erro ao sair da conta: " + err);
    }
  };

  return (
    <>
      <Button onClick={handleClickOpen} sx={{ mt: 2 }}>
        Sair
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Tem certeza que quer sair?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" sx={{ mr: 3 }}>
            Cancelar
          </Button>
          <Button onClick={handleSignOut} variant="outlined" sx={{ mr: 3 }}>
            Sair
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SignOutButton;
