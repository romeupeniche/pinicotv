import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, MenuItem, Avatar, Box, IconButton } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { updateProfile } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { setUser } from "../../store/accountSlice";

const AvatarSelector = () => {
  const user = useSelector((state) => state.account.user);
  const avatars = useSelector((state) => state.avatars.avatars);
  const dispatch = useDispatch();
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [editing, setEditing] = useState(false);

  const handleAvatarChange = (event) => {
    setSelectedAvatar(event.target.value);
  };

  const handleEditButtonClick = () => {
    setEditing(true);
  };

  const handleCancelButtonClick = () => {
    setSelectedAvatar(null);
    setEditing(false);
  };

  const handleConfirmButtonClick = async () => {
    const photoURL = avatars[selectedAvatar];
    await updateProfile(auth.currentUser, {
      photoURL,
    });
    dispatch(
      setUser({
        user: {
          ...user,
          photoURL,
        },
      })
    );
    setEditing(false);
  };

  const userAvatarIndex = avatars.indexOf(user.photoURL);

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {editing ? (
        <>
          <Select
            value={selectedAvatar || userAvatarIndex}
            onChange={handleAvatarChange}
            variant="standard"
            sx={{ minWidth: "100px" }}
            IconComponent={ArrowDropDownIcon}
            renderValue={() => (
              <Avatar
                src={selectedAvatar ? avatars[selectedAvatar] : user.photoURL}
                variant="rounded"
                sx={{ width: "100px", height: "100px" }}
              />
            )}
            MenuProps={{
              PaperProps: {
                sx: {
                  height: "270px",
                },
              },
            }}
          >
            {Object.keys(avatars).map((avatarKey) => (
              <MenuItem value={avatarKey} key={avatarKey}>
                <Avatar
                  src={avatars[avatarKey]}
                  variant="rounded"
                  sx={{ width: "100px", height: "100px" }}
                />
              </MenuItem>
            ))}
          </Select>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <IconButton onClick={handleConfirmButtonClick}>
              <CheckIcon fontSize="small" color="success" />
            </IconButton>
            <IconButton onClick={handleCancelButtonClick}>
              <CloseIcon fontSize="small" color="error" />
            </IconButton>
          </Box>
        </>
      ) : (
        <Avatar
          src={user.photoURL}
          title="Clique para mudar seu avatar"
          variant="rounded"
          sx={{ width: "100px", height: "100px", cursor: "pointer" }}
          onClick={handleEditButtonClick}
        />
      )}
    </Box>
  );
};

export default AvatarSelector;
