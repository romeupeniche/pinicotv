import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useNavigate } from "react-router";

function Banner({
  bannerLink,
  serieTitle,
  serieYear,
  seasonsNumber,
  description,
  watching = false,
  serieID = "",
}) {
  const navigate = useNavigate();

  const handleBackToSeriePage = () => {
    navigate(`/series/${serieID}`);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "80vh",
        backgroundImage: `url(${bannerLink})`,
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
          {watching && (
            <Typography mt={2} variant="h6">
              <Box
                onClick={handleBackToSeriePage}
                sx={{
                  color: "primary.main",
                  width: "fit-content",
                  ml: 2,
                  mt: 5,
                  cursor: "pointer",
                  "&:hover": { color: "primary.dark" },
                }}
              >
                {" "}
                &lt; Voltar
              </Box>
              <Box sx={{ ml: 5, mt: 5, fontSize: 30 }}>
                Você está assistindo:
              </Box>
            </Typography>
          )}
          <Typography variant="h2" mt={28} ml={5}>
            {serieTitle}
          </Typography>
          <Typography variant="h6" color="utils.grey.light" ml={5}>
            <Box component="span" sx={{ mr: 3 }}>
              {serieYear}
            </Box>{" "}
            <Box component="span">{seasonsNumber} Temporadas</Box>
            <Box sx={{ maxWidth: { xs: 300, md: 500 }, mt: 2 }}>
              {description}
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Banner;

Banner.propTypes = {
  bannerLink: PropTypes.string.isRequired,
  serieTitle: PropTypes.string.isRequired,
  serieYear: PropTypes.string.isRequired,
  seasonsNumber: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  watching: PropTypes.bool,
  serieID: PropTypes.string,
};
