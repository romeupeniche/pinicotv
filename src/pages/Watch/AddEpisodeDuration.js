import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateHistory } from "../../store/accountSlice";

function AddEpisodeDuration(serieID, episodeNumber, duration) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.account.user);
  const userHistory = useSelector((state) => state.account.history);

  useEffect(() => {
    if (!user || !user.uid || !userHistory) return;

    if (!userHistory[serieID]) {
      const updatedHistory = {
        ...userHistory,
        [serieID]: {},
      };
      dispatch(updateHistory(updatedHistory));
      return;
    }

    if (!userHistory[serieID][episodeNumber]) {
      const updatedHistory = {
        ...userHistory,
        [serieID]: {
          ...userHistory[serieID],
          [episodeNumber]: {
            duration,
          },
        },
      };
      dispatch(updateHistory(updatedHistory));
      return;
    }
  }, [user, userHistory, dispatch, serieID, episodeNumber, duration]);
}

export default AddEpisodeDuration;
