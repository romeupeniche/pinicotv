import {
  Box,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import SerieCard from "../../components/SerieCard";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Banner from "../../components/Banner";
import handleContinueFromLastWatched from "../../helpers/handleContinueFromLastWatched";

const SeriePage = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const seriesData = useSelector((state) => state.series.series);
  const userHistory = useSelector((state) => state.account.history);
  const [selectedSeason, setSelectedSeason] = useState("");
  let serieData;
  if (seriesData) {
    serieData = Object.values(seriesData).find((series) => series.uid === uid);
  }

  const [loading, setLoading] = useState(!serieData);
  const [timerExpired, setTimerExpired] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!serieData) {
        setLoading(false);
        setTimerExpired(true);
      }
    }, 5000);

    if (serieData) {
      setLoading(false);
      setTimerExpired(false);
      const seasons = Object.keys(serieData).filter((season) =>
        season.includes("Season")
      );
      const sortedSeasons = sortSeasons(seasons);
      setSelectedSeason(sortedSeasons[0]);
    }

    return () => clearTimeout(timer);
  }, [serieData]);

  const sortEpisodes = (episodes) => {
    return Object.entries(episodes)
      .sort((a, b) => parseInt(a[0], 10) - parseInt(b[0], 10))
      .map(([episodeNumber, episodeData]) => ({
        episodeNumber,
        episodeData,
      }));
  };

  const sortSeasons = (seasons) => {
    const sortedSeasons = seasons
      .map((season) => {
        const seasonNumber = parseInt(season.replace("Season", ""), 10);
        return { seasonName: season, seasonNumber };
      })
      .sort((a, b) => a.seasonNumber - b.seasonNumber)
      .map(({ seasonName }) => seasonName);

    return sortedSeasons;
  };

  if (loading) {
    return (
      <Container
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (timerExpired) {
    return (
      <Container>
        <Typography variant="h3">Série não encontrada.</Typography>
      </Container>
    );
  }

  const serieTitle = Object.keys(seriesData).find(
    (key) => seriesData[key].uid === uid
  );

  const seasons = Object.keys(serieData).filter((season) =>
    season.includes("Season")
  );

  const sortedSeasons = sortSeasons(seasons);

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
  };

  const filterEpisodesBySeason = (season) => {
    let filteredEpisodes;
    for (const [episodeSeason, seasonData] of Object.entries(serieData)) {
      if (episodeSeason === season) {
        filteredEpisodes = seasonData;
      }
    }
    return filteredEpisodes;
  };

  const getAllEpisodes = () => {
    const allEpisodes = [];
    for (const season of sortedSeasons) {
      const episodes = sortEpisodes(filterEpisodesBySeason(season));
      allEpisodes.push(...episodes);
    }
    return allEpisodes;
  };

  const handleEpisodeClick = ({ allEpisodes, episodeNumber }) => {
    navigate(`/series/${uid}/watch`, {
      state: {
        serieTitle,
        serieID: uid,
        allEpisodes,
        episodeNumber,
        serieData,
      },
    });
  };

  const getSeasonName = (season) => {
    const sagaIndex = season.indexOf(" - ");
    if (sagaIndex !== -1) {
      return season.substring(sagaIndex + 3);
    }
    return season;
  };

  return (
    <>
      <Box>
        <Banner
          bannerLink={serieData.assets.secondBanner}
          serieTitle={serieTitle}
          serieYear={serieData.serieYear}
          seasonsNumber={serieData.seasonsNumber}
          description={serieData.description}
        />
      </Box>
      <Box
        sx={{
          width: "100%",
          mt: "80vh",
          background: "linear-gradient(to top, transparent, #111 )",
        }}
      >
        <Container>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Select
              value={selectedSeason}
              title="Selecione a temporada"
              onChange={handleSeasonChange}
              sx={{
                marginTop: 2,
                color: "#fff",
                backgroundColor: "utils.grey.dark",
              }}
            >
              {sortedSeasons.map((season) => (
                <MenuItem key={season} value={season}>
                  {getSeasonName(season)}
                </MenuItem>
              ))}
            </Select>
            <IconButton
              title="Continuar de onde parou"
              onClick={() =>
                handleContinueFromLastWatched(
                  uid,
                  serieTitle,
                  userHistory,
                  serieData,
                  navigate
                )
              }
            >
              <PlayArrowIcon sx={{ fontSize: "4rem", color: "primary.main" }} />
            </IconButton>
          </Box>
          <Grid container spacing={2}>
            {selectedSeason &&
              sortEpisodes(filterEpisodesBySeason(selectedSeason)).map(
                ({ episodeNumber, episodeData }) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={episodeNumber}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    onClick={() =>
                      handleEpisodeClick({
                        episodeNumber,
                        allEpisodes: getAllEpisodes(),
                      })
                    }
                  >
                    <SerieCard
                      name={episodeData.title}
                      bannerUrl={episodeData.imgUrl}
                      uid={uid}
                      episodeNumber={episodeNumber}
                    />
                  </Grid>
                )
              )}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default SeriePage;
