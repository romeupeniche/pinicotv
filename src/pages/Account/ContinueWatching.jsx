import { Typography, Box, styled } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined";
import handleContinueFromLastWatched from "../../helpers/handleContinueFromLastWatched";

const PlayCircleIconWrapper = styled("div")({
  position: "absolute",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "150px",
  top: "48%",
  left: "50%",
  backgroundColor: "rgb(0, 0, 0, 50%)",
  borderRadius: "9px",
  transform: "translate(-50%, -50%)",
  opacity: 0,
  transition: "opacity 0.3s ease",
  "&:hover": {
    opacity: 1,
  },
});

function ContinueWatching() {
  const userHistory = useSelector((state) => state.account.history);
  const seriesData = useSelector((state) => state.series.series);
  const navigate = useNavigate();

  let serieTitle;
  let serieId;

  const findSeriesById = (seriesData, seriesId) => {
    serieTitle = Object.keys(seriesData).find(
      (title) => seriesData[title].uid === seriesId
    );

    const lastEpisodeInfo = handleContinueFromLastWatched(
      seriesId,
      serieTitle,
      userHistory,
      seriesData[serieTitle],
      navigate,
      true
    );

    for (const series of Object.values(seriesData)) {
      if (series.uid === seriesId) {
        return {
          ...series,
          episodeTitle: lastEpisodeInfo.episodeTitle,
          episodeNumber: lastEpisodeInfo.episodeNumber,
        };
      }
    }
    return null;
  };

  const watchedSeries = Object.entries(userHistory)
    .map(([seriesId]) => {
      const seriesDetails = findSeriesById(seriesData, seriesId);
      serieId = seriesId;

      return {
        id: seriesId,
        episodeTitle: seriesDetails?.episodeTitle || "Série não encontrada",
        episodeNumber: seriesDetails?.episodeNumber || "",
        imgUrl: seriesDetails?.assets.banner || "",
      };
    })
    .filter((series) => series.imgUrl !== "");

  const navigateToSerie = () => {
    handleContinueFromLastWatched(
      serieId,
      serieTitle,
      userHistory,
      seriesData[serieTitle],
      navigate
    );
  };

  if (watchedSeries.length === 0) {
    return null;
  }

  return (
    <div>
      <Typography variant="h4" mt={10} mb={3} textAlign="center">
        Continue Assistindo
      </Typography>
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          scrollBehavior: "smooth",
        }}
      >
        {watchedSeries.map((series) => (
          <Box
            title={serieTitle}
            key={series.id}
            mx={1}
            textAlign="center"
            sx={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                opacity: "0.8",
              },
            }}
            onClick={() => navigateToSerie()}
          >
            <Box sx={{ position: "relative" }}>
              <img
                src={series.imgUrl}
                alt={series.title}
                style={{ width: "auto", height: "150px", borderRadius: "8px" }}
              />
              <PlayCircleIconWrapper>
                <PlayCircleOutlinedIcon
                  sx={{
                    fontSize: "4rem",
                    color: "primary.main",
                  }}
                />
              </PlayCircleIconWrapper>
            </Box>
            <Typography maxWidth={200} mt={1}>
              {" "}
              {series.episodeNumber} &gt; {series.episodeTitle}
            </Typography>
          </Box>
        ))}
      </Box>
    </div>
  );
}

export default ContinueWatching;
