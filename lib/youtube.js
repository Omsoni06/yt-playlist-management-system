import axios from "axios";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

export function extractPlaylistId(url) {
  // Remove any await/async - make it synchronous
  const regex = /[?&]list=([^&]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export async function getPlaylistDetails(playlistId) {
  try {
    const response = await axios.get(`${YOUTUBE_API_BASE}/playlists`, {
      params: {
        part: "snippet,contentDetails",
        id: playlistId,
        key: YOUTUBE_API_KEY,
      },
    });

    if (response.data.items.length === 0) {
      throw new Error("Playlist not found");
    }

    const playlist = response.data.items[0];
    return {
      title: playlist.snippet.title,
      description: playlist.snippet.description,
      channelTitle: playlist.snippet.channelTitle,
      thumbnail:
        playlist.snippet.thumbnails.high?.url ||
        playlist.snippet.thumbnails.default.url,
      videoCount: playlist.contentDetails.itemCount,
    };
  } catch (error) {
    console.error("Error fetching playlist details:", error.message);
    throw new Error("Failed to fetch playlist details");
  }
}

export async function getPlaylistVideos(playlistId) {
  try {
    let allVideos = [];
    let nextPageToken = null;

    do {
      const response = await axios.get(`${YOUTUBE_API_BASE}/playlistItems`, {
        params: {
          part: "snippet,contentDetails",
          playlistId: playlistId,
          maxResults: 50,
          pageToken: nextPageToken,
          key: YOUTUBE_API_KEY,
        },
      });

      const videoIds = response.data.items
        .map((item) => item.contentDetails.videoId)
        .join(",");

      const videoDetailsResponse = await axios.get(
        `${YOUTUBE_API_BASE}/videos`,
        {
          params: {
            part: "contentDetails,statistics",
            id: videoIds,
            key: YOUTUBE_API_KEY,
          },
        }
      );

      const videoDetailsMap = {};
      videoDetailsResponse.data.items.forEach((video) => {
        videoDetailsMap[video.id] = {
          duration: video.contentDetails.duration,
          viewCount: video.statistics.viewCount,
        };
      });

      const videos = response.data.items.map((item, index) => {
        const videoId = item.contentDetails.videoId;
        return {
          videoId: videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail:
            item.snippet.thumbnails.medium?.url ||
            item.snippet.thumbnails.default.url,
          duration: videoDetailsMap[videoId]?.duration || "PT0S",
          position: item.snippet.position,
          publishedAt: item.snippet.publishedAt,
        };
      });

      allVideos = allVideos.concat(videos);
      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    return allVideos;
  } catch (error) {
    console.error("Error fetching playlist videos:", error.message);
    throw new Error("Failed to fetch playlist videos");
  }
}

export function parseDuration(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = (match[1] || "").replace("H", "") || 0;
  const minutes = (match[2] || "").replace("M", "") || 0;
  const seconds = (match[3] || "").replace("S", "") || 0;

  return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
}

export function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m ${secs}s`;
}
