import {
  Typography,
  CardMedia,
  CardContent,
  CardActionArea,
  Card,
  Box,
  LinearProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useSelector } from "react-redux";

const PlayArrowIconWrapper = styled("div")({
  position: "absolute",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100%",
  backgroundColor: "rgb(0, 0, 0, 50%)",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  opacity: 0,
  transition: "opacity 0.3s ease",
  "&:hover": {
    opacity: 1,
  },
});

const ProgressWrapper = styled(Box)({
  width: "100%",
  position: "absolute",
  bottom: 0,
  left: 0,
});

const StyledCard = styled(Card)({
  maxWidth: 300,
  minHeight: "430px",
  margin: "16px",
  cursor: "pointer",
  background: "rgba(0, 0, 0, 0.2)",
  position: "relative",
  transition: "background-color 0.3s ease",

  "&.shadowEffect": {
    backdropFilter: "blur(8px)",
    opacity: 0.3,
  },
});

const EpisodeNumber = styled(Typography)({
  position: "absolute",
  top: 0,
  left: 0,
  background: "rgba(0, 0, 0, 0.5)",
  color: "#fff",
  padding: "4px",
  borderRadius: "4px",
});

function SerieCard({ name, bannerUrl, uid, episodeNumber }) {
  const userSerieHistory = useSelector((state) => state.account.history)[uid];
  const episodeData = userSerieHistory?.[+episodeNumber];
  const exitTime = episodeData?.exitTime || 0;
  const duration = episodeData?.duration || 0;

  const progress = duration > 0 ? (exitTime / duration) * 100 : 0;

  const isDarkShadow = progress >= 90;

  return (
    <StyledCard className={isDarkShadow ? "shadowEffect" : ""}>
      <CardActionArea>
        <CardMedia component="img" height="300" image={bannerUrl} alt={name} />
        <CardContent>
          <Typography variant="h6" component="h2" color="#fff">
            {name}
          </Typography>
          {episodeNumber && (
            <EpisodeNumber variant="subtitle1">{episodeNumber}</EpisodeNumber>
          )}
        </CardContent>
      </CardActionArea>
      <PlayArrowIconWrapper>
        <PlayArrowIcon sx={{ fontSize: "4rem", color: "primary.main" }} />
      </PlayArrowIconWrapper>
      <ProgressWrapper>
        <LinearProgress
          variant="determinate"
          value={progress}
          color="primary"
          sx={{ backgroundColor: "transparent" }}
        />
      </ProgressWrapper>
    </StyledCard>
  );
}

SerieCard.propTypes = {
  name: PropTypes.string.isRequired,
  bannerUrl: PropTypes.string.isRequired,
  uid: PropTypes.string.isRequired,
  episodeNumber: PropTypes.string,
};

export default SerieCard;
