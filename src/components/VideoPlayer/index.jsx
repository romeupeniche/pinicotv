import { useRef, useEffect, useCallback, useState } from "react";
import videojs from "video.js";
import PropTypes from "prop-types";
import "video.js/dist/video-js.css";
import "videojs-playlist";
import "./styles.css";
import { Box, IconButton, Typography } from "@mui/material";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import HandleUpdateHistory from "./HandleUpdateHistory";

const VideoPlayer = ({ allEpisodes, episodeIndex, serieID }) => {
  const playerRef = useRef(null);
  const videoRef = useRef(null);
  const [episodeNumber, setEpisodeNumber] = useState(episodeIndex);
  const [episodeTitle, setEpisodeTitle] = useState("");

  const onPlaylistItemChanged = useCallback(() => {
    const playlist = playerRef.current.playlist();
    if (playlist) {
      const currentItem = playerRef.current.playlist.currentItem();
      setEpisodeNumber(playlist[currentItem].index);
      setEpisodeTitle(playlist[currentItem].sources[0].title);
    }
  }, []);

  const skipForward = (player, seconds) => {
    player.currentTime(player.currentTime() + seconds);
  };

  const skipBackward = (player, seconds) => {
    player.currentTime(player.currentTime() - seconds);
  };

  const addCustomButtons = useCallback((player) => {
    const controlBar = player.controlBar;

    const skipBackwardButton = controlBar.addChild("button", {
      text: "Retroceder 10s",
      el: videojs.dom.createEl("button", {
        className: "vjs-control vjs-button",
        innerHTML: '<span class="vjs-icon-replay-10"></span>',
      }),
    });

    skipBackwardButton.on("click", () => skipBackward(player, 10));

    const skipForwardButton = controlBar.addChild("button", {
      text: "Avançar 10s",
      el: videojs.dom.createEl("button", {
        className: "vjs-control vjs-button",
        innerHTML: '<span class="vjs-icon-forward-30"></span>',
      }),
    });

    const skipNextButton = controlBar.addChild("button", {
      text: "Próximo Episódio",
      el: videojs.dom.createEl("button", {
        className: "vjs-control vjs-button",
        innerHTML: '<span class="vjs-icon-next-item"></span>',
      }),
    });

    skipNextButton.on("click", () => player.playlist.next());

    skipForwardButton.on("click", () => skipForward(player, 30));

    controlBar
      .el()
      .insertBefore(
        skipBackwardButton.el(),
        controlBar.getChild("progressControl").el()
      );
    controlBar
      .el()
      .insertBefore(
        skipForwardButton.el(),
        controlBar.getChild("progressControl").el()
      );
    controlBar.el().appendChild(skipNextButton.el());
  }, []);

  function toggleVideoFullscreen() {
    const videoElement = document.getElementById("video");
    const isVideoFullscreen =
      document.fullscreenElement === videoElement ||
      document.webkitFullscreenElement === videoElement ||
      document.mozFullScreenElement === videoElement ||
      document.msFullscreenElement === videoElement;

    if (!isVideoFullscreen) {
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else if (videoElement.webkitRequestFullscreen) {
        videoElement.webkitRequestFullscreen();
      } else if (videoElement.mozRequestFullScreen) {
        videoElement.mozRequestFullScreen();
      } else if (videoElement.msRequestFullscreen) {
        videoElement.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }

  var down = false;
  document.addEventListener(
    "keydown",
    function () {
      if (down) return;
      down = true;

      const player = videojs.getPlayer("video");
      const video = videoRef.current;

      if (event.which === 32) {
        if (player.paused()) {
          player.play();
        } else {
          player.pause();
        }
      } else if (event.which === 70) {
        toggleVideoFullscreen();
      } else if (event.keyCode === 37) {
        video.currentTime -= 10;
      } else if (event.keyCode === 39) {
        video.currentTime += 30;
      }
    },
    false
  );

  document.addEventListener(
    "keyup",
    function () {
      down = false;
    },
    false
  );

  useEffect(() => {
    if (!videoRef.current) return;
    const videoJsOptions = {
      autoplay: true,
      autofocus: true,
      controls: true,
      playbackRates: [0.25, 0.5, 1, 1.5, 2],
      controlBar: {
        children: [
          "playToggle",
          "volumePanel",
          "progressControl",
          "RemainingTimeDisplay",
          "playbackRateMenuButton",
          "pictureInPictureToggle",
          "fullscreenToggle",
        ],
      },
    };

    playerRef.current = videojs(videoRef.current, videoJsOptions);

    const playlistItems = allEpisodes.map((episode, index) => {
      return {
        sources: [
          {
            src: episode.episodeData.videoUrl,
            type: "video/mp4",
            title: episode.episodeData.title,
          },
        ],
        poster: episode.episodeData.imgUrl,
        index: index + 1,
      };
    });
    playerRef.current.playlist(playlistItems, episodeIndex - 1);
    playerRef.current.playlist.autoadvance(0);
    addCustomButtons(playerRef.current);

    const buttons = playerRef.current.controlBar.children();
    buttons.forEach((button) => {
      button.on("click", function () {
        this.blur();
      });
    });

    return () => {
      playerRef.current.dispose();
    };
  }, [allEpisodes, addCustomButtons, episodeIndex]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.on("playlistitem", onPlaylistItemChanged);
      return () => {
        playerRef.current.off("playlistitem", onPlaylistItemChanged);
      };
    }
  }, [onPlaylistItemChanged]);

  return (
    <div>
      <HandleUpdateHistory
        ref={playerRef}
        episodeNumber={episodeNumber}
        serieID={serieID}
      />
      <Typography variant="h5" ml={4}>
        Episódio {episodeNumber} &gt; {episodeTitle}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-around", mb: 5 }}>
        <IconButton
          title="Episódio Anterior"
          onClick={() => playerRef.current.playlist.previous()}
        >
          <SkipPreviousIcon sx={{ color: "primary.main" }} fontSize="large" />
        </IconButton>
        <IconButton
          title="Próximo Episódio"
          onClick={() => playerRef.current.playlist.next()}
        >
          <SkipNextIcon sx={{ color: "primary.main" }} fontSize="large" />
        </IconButton>
      </Box>
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-fluid"
          id="video"
          style={{ minWidth: "80vw", height: "auto" }}
        ></video>
      </div>
    </div>
  );
};

VideoPlayer.propTypes = {
  allEpisodes: PropTypes.array.isRequired,
  episodeIndex: PropTypes.number.isRequired,
  serieID: PropTypes.string.isRequired,
};

export default VideoPlayer;
