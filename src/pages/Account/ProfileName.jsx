import { Box, TextField, Typography } from "@mui/material";
import { updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { setUser } from "../../store/accountSlice";

function ProfileName() {
  const [isEditingName, setIsEditingName] = useState(false);
  const user = useSelector((state) => state.account.user);
  const [displayName, setDisplayName] = useState("");
  const dispatch = useDispatch();

  const handleEditNameClick = () => {
    setIsEditingName(true);
  };

  const handleConfirmEditNameClick = async () => {
    setIsEditingName(false);
    await updateProfile(auth.currentUser, {
      displayName,
    });
    dispatch(
      setUser({
        user: {
          ...user,
          displayName,
        },
      })
    );
  };

  const handleCancelEditNameClick = () => {
    setIsEditingName(false);
    setDisplayName("");
  };

  const handleChangingDisplayName = (value) => {
    setDisplayName(value);
  };

  return (
    <Box display="flex" mt={2}>
      {isEditingName ? (
        <>
          <TextField
            onChange={(e) => handleChangingDisplayName(e.target.value)}
            sx={{
              color: "#fff",
              fontSize: "2rem",
              "& .MuiInputBase-input": {
                color: "#fff",
              },
            }}
          />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CheckIcon
              color="success"
              sx={{ cursor: "pointer" }}
              onClick={handleConfirmEditNameClick}
            />
            <CloseIcon
              color="error"
              sx={{ cursor: "pointer" }}
              onClick={handleCancelEditNameClick}
            />
          </Box>
        </>
      ) : (
        <>
          <Typography
            variant="h5"
            title="Nome de usuário. Clique no lápis para mudar."
          >
            {user.displayName ?? "*noname"}
          </Typography>
          <EditIcon
            sx={{
              color: "primary.main",
              cursor: "pointer",
              width: "15px",
              ml: 1,
            }}
            onClick={handleEditNameClick}
          />
        </>
      )}
    </Box>
  );
}

export default ProfileName;
