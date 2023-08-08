import { Box, Button, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router";
import handleContinueFromLastWatched from "../../helpers/handleContinueFromLastWatched";

function FeaturedSerie() {
  const availableSeries = useSelector((state) => state.series.series);
  const [serieTitle, serieData] = Object.entries(availableSeries)[0];
  const userHistory = useSelector((state) => state.account.history);
  const navigate = useNavigate();

  const handleSeeMoreClick = () => {
    navigate(`/series/${serieData.uid}`);
  };

  const handleWatchClick = () => {
    handleContinueFromLastWatched(
      serieData.uid,
      serieTitle,
      userHistory,
      serieData,
      navigate
    );
  };

  const hasWatchedSeries = serieData.uid in userHistory;

  const buttonWidth = hasWatchedSeries ? 260 : 150;

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "100vh",
        backgroundImage: `url(${serieData.assets.banner})`,
      }}
    >
      <Box
        sx={{
          width: "inherit",
          height: "101%",
          background: "linear-gradient(to top, #111 10%, transparent 90%)",
        }}
      >
        <Box
          sx={{
            width: "inherit",
            height: "inherit",
            background: "linear-gradient(to right, #111, transparent)",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography
            ml={4}
            variant="h1"
            sx={{ fontSize: { xs: "3.5rem", md: "6rem" } }}
          >
            {serieTitle}
          </Typography>
          <Typography ml={6} variant="h6" color="utils.grey.light">
            <Box component="span" sx={{ color: "utils.green" }}>
              {serieData.imdbRating}
            </Box>{" "}
            • {serieData.serieYear} • {serieData.seasonsNumber} temporadas
            <Box sx={{ width: { xs: 300, md: 500 }, mt: 2 }}>
              {serieData.description}
            </Box>
          </Typography>
          <Box
            sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
          >
            <Button
              onClick={handleWatchClick}
              variant="contained"
              sx={{
                ml: 6,
                fontSize: "1.3rem",
                mt: 2,
                width: buttonWidth,
                textTransform: "none",
              }}
            >
              <PlayArrowIcon sx={{ mr: 1 }} />{" "}
              {hasWatchedSeries ? "Continuar Assistindo" : "Assistir"}
            </Button>
            <Button
              onClick={handleSeeMoreClick}
              variant="outlined"
              sx={{
                ml: 6,
                fontSize: "1.3rem",
                mt: 2,
                width: 150,
                textTransform: "none",
              }}
            >
              <InfoIcon sx={{ mr: 1 }} /> Ver Mais
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default FeaturedSerie;
