const handleContinueFromLastWatched = (
  uid,
  serieTitle,
  userHistory,
  serieData,
  navigate,
  getEpisodeInfo = false
) => {
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

  const seasons = Object.keys(serieData).filter((season) =>
    season.includes("Season")
  );

  const sortedSeasons = sortSeasons(seasons);

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

  let lastWatchedEpisodeNumber = null;
  let lastWatchedPercentage = 0;
  let selectedEpisodeNumber = null;
  let selectedEpisodeTitle = null;

  const userSerieHistory = userHistory[uid];

  if (userSerieHistory) {
    for (const [episodeNumber, episodeData] of Object.entries(
      userSerieHistory
    )) {
      if (episodeData.exitTime && episodeData.duration) {
        const percentageWatched =
          (episodeData.exitTime / episodeData.duration) * 100;

        if (percentageWatched >= 10) {
          if (
            selectedEpisodeNumber === null ||
            percentageWatched >= lastWatchedPercentage
          ) {
            lastWatchedPercentage = percentageWatched;
            lastWatchedEpisodeNumber = +episodeNumber;
          }
        }

        if (percentageWatched >= 90) {
          const remainingPercentage = 100 - percentageWatched;
          if (remainingPercentage <= 5) {
            selectedEpisodeNumber = +episodeNumber + 1;
          }
        }
      }
    }
  }

  if (selectedEpisodeNumber === null && lastWatchedEpisodeNumber !== null) {
    selectedEpisodeNumber = lastWatchedEpisodeNumber;
  }

  let selectedEpisode;

  if (selectedEpisodeNumber !== null) {
    const episodes = getAllEpisodes();
    selectedEpisode = episodes.find(
      (episode) => +episode.episodeNumber === selectedEpisodeNumber
    );

    if (selectedEpisode) {
      selectedEpisodeTitle = selectedEpisode.episodeData.title;
    }
  }

  if (selectedEpisodeNumber === null) {
    const firstEpisode = getAllEpisodes()[0];
    selectedEpisodeNumber = firstEpisode?.episodeNumber || null;
    selectedEpisodeTitle = firstEpisode?.episodeData.title || null;
  }

  if (getEpisodeInfo) {
    return {
      episodeNumber: selectedEpisodeNumber,
      episodeTitle: selectedEpisodeTitle,
    };
  } else {
    navigate(`/series/${uid}/watch`, {
      state: {
        serieTitle,
        serieID: uid,
        allEpisodes: getAllEpisodes(),
        episodeNumber: selectedEpisodeNumber,
      },
    });
  }
};

export default handleContinueFromLastWatched;
