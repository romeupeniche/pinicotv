import { forwardRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { updateHistory } from "../../store/accountSlice";

const HandleUpdateHistory = forwardRef(function HandleUpdateHistory(
  { episodeNumber, serieID },
  ref
) {
  const user = useSelector((state) => state.account.user);
  const userHistory = useSelector((state) => state.account.history);
  const dispatch = useDispatch();
  const playerRef = ref;

  const handleUpdateHistory = async (exitTime) => {
    const userDoc = doc(db, "history", user.uid);
    const updatedHistory = {
      ...userHistory,
      [serieID]: {
        ...userHistory[serieID],
        [episodeNumber]: {
          ...userHistory[serieID]?.[episodeNumber],
          exitTime,
        },
      },
    };
    await updateDoc(userDoc, updatedHistory);
    dispatch(updateHistory(updatedHistory));
  };

  useEffect(() => {
    if (playerRef.current) {
      const player = playerRef.current;

      let intervalId;

      const handlePlaying = () => {
        intervalId = setInterval(() => {
          if (!player.paused()) {
            const currentTime = player.currentTime();
            handleUpdateHistory(currentTime);
          }
        }, 30000);
      };

      const handlePause = () => {
        clearInterval(intervalId);

        const currentTime = player.currentTime();
        handleUpdateHistory(currentTime);
      };

      const handleLoadedMetadata = () => {
        const duration = player.duration();

        if (!isNaN(duration)) {
          const userHistorySnapshot = JSON.parse(JSON.stringify(userHistory));
          if (!userHistorySnapshot[serieID]) {
            userHistorySnapshot[serieID] = {};
          }
          if (!userHistorySnapshot[serieID][episodeNumber]) {
            userHistorySnapshot[serieID][episodeNumber] = {};
          }

          if (!userHistorySnapshot[serieID][episodeNumber].duration) {
            userHistorySnapshot[serieID][episodeNumber].duration = duration;
          }

          if (userHistorySnapshot[serieID][episodeNumber].exitTime) {
            player.currentTime(
              userHistorySnapshot[serieID][episodeNumber].exitTime
            );
          }

          const userDoc = doc(db, "history", user.uid);
          updateDoc(userDoc, userHistorySnapshot);
          dispatch(updateHistory(userHistorySnapshot));
        }
      };

      player.on("play", handlePlaying);
      player.on("pause", handlePause);
      player.on("loadedmetadata", handleLoadedMetadata);

      return () => {
        player.off("play", handlePlaying);
        player.off("pause", handlePause);
        player.off("loadedmetadata", handleLoadedMetadata);
        clearInterval(intervalId);
      };
    }
  }, [
    playerRef.current,
    episodeNumber,
    playerRef,
    userHistory,
    dispatch,
    handleUpdateHistory,
    serieID,
    user.uid,
  ]);

  return null;
});

export default HandleUpdateHistory;

HandleUpdateHistory.propTypes = {
  episodeNumber: PropTypes.number.isRequired,
  serieID: PropTypes.string.isRequired,
};
