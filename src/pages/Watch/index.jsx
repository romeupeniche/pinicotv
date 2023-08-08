import { Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import VideoPlayer from "../../components/VideoPlayer";
import { useEffect } from "react";
import Banner from "../../components/Banner";

function Watch() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state) {
      navigate(-1);
    }
  }, [location.state, navigate]);

  if (!location.state) {
    return null;
  }

  const { serieTitle, serieID, allEpisodes, episodeNumber, serieData } =
    location.state;

  return (
    <>
      <Banner
        bannerLink={serieData.assets.secondBanner}
        serieTitle={serieTitle}
        serieYear={serieData.serieYear}
        seasonsNumber={serieData.seasonsNumber}
        description={serieData.description}
        watching={true}
        serieID={serieID}
      />
      <Box
        sx={{
          width: "100%",
          mt: "80vh",
          pt: { xs: 5 },
          p: { md: 5 },
          background: "linear-gradient(to top, transparent, #111 )",
        }}
      >
        <VideoPlayer
          episodeIndex={+episodeNumber}
          allEpisodes={allEpisodes}
          serieID={serieID}
        />
      </Box>
    </>
  );
}

export default Watch;
