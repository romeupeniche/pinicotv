import { Box, CircularProgress, Container } from "@mui/material";
import AvatarSelector from "./AvatarSelector";
import ProfileName from "./ProfileName";
import ContinueWatching from "./ContinueWatching";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import SignOutButton from "./SignOutButton";

function Account() {
  const isLoaded = useSelector((state) => state.series.isLoaded);
  const [loading, setLoading] = useState(!isLoaded);
  const [timerExpired, setTimerExpired] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) {
        setLoading(false);
        setTimerExpired(true);
      }
    }, 5000);

    if (isLoaded) {
      setLoading(false);
      setTimerExpired(false);
    }
    return () => clearTimeout(timer);
  }, [isLoaded]);

  if (timerExpired) {
    navigate("/");
  }

  if (loading) {
    return (
      <Container
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <AvatarSelector />
        <ProfileName />
        <ContinueWatching />
        <SignOutButton />
      </Box>
    </Container>
  );
}

export default Account;
