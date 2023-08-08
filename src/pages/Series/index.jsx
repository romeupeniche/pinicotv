import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import SerieCard from "../../components/SerieCard";
import FeaturedSerie from "../../components/FeaturedSerie";
import { useEffect, useState } from "react";

const Series = () => {
  const availableSeries = useSelector((state) => state.series.series);
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

  if (!isLoaded) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Box>
        <FeaturedSerie />
      </Box>
      <Box
        sx={{
          width: "100%",
          mt: "100vh",
          background: "linear-gradient(to top, transparent, #111 )",
        }}
      >
        <Container>
          <Typography
            variant="h2"
            mt={20}
            sx={{ fontSize: { xs: "3rem", md: "3.75rem" } }}
          >
            Outros títulos
          </Typography>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            {Object.entries(availableSeries).map(([name, data]) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={name}>
                <Link to={`/series/${data.uid}`}>
                  <SerieCard
                    name={name}
                    bannerUrl={data.assets.banner}
                    uid={data.uid}
                  />
                </Link>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Series;
