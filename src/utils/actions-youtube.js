

/**
 * Extract video information from YouTube API response
 * @param {Object} data - YouTube API response data
 * @returns {Object} Video info with thumbnail, title, keywords, and viewCount
 */
export const getVideoInfo = (data) => {
  try {
    // Get best quality thumbnail (largest resolution)
    const bestThumbnail = data.thumbnails?.reduce((best, current) => {
      const bestArea = (best.width || 0) * (best.height || 0);
      const currentArea = (current.width || 0) * (current.height || 0);
      return currentArea > bestArea ? current : best;
    }) || null;

    // Extract keywords from description or use empty string
    const keywordsString = "";

    return {
      thumbnail: bestThumbnail?.url || null,
      title: data.title || "",
      keywords: keywordsString,
      viewCount: data.viewCount?.toString() || "0",
      duration: data.duration || data.lengthSeconds || data.length || 0,
    };
  } catch (error) {
    console.error("Error extracting video info:", error);
    throw error;
  }
};

/**
 * Extract MP4 formats from 360p to 1080p
 * @param {Object} data - YouTube API response data
 * @returns {Array} Array of MP4 formats with quality, url, and size
 */
export const getMP4Formats = (data) => {
  try {
    const targetQualities = ["360p", "480p", "720p", "1080p"];
    const qualityMap = new Map();

    // Get videos from the new API structure
    const videos = data.videos?.items || [];

    // Filter MP4 formats and deduplicate by quality (keep first/best for each quality)
    videos.forEach((video) => {
      const quality = video.quality || "";
      const isMp4 = video.extension === "mp4";

      // Only include target qualities and MP4 format
      if (targetQualities.includes(quality) && isMp4) {
        // Keep the first (best) format for each quality
        if (!qualityMap.has(quality)) {
          qualityMap.set(quality, {
            qualityLabel: quality,
            url: video.url,
            bitrate: 0,
            size: video.size || 0,
            sizeText: video.sizeText || "",
          });
        }
      }
    });

    // Sort by quality (360p -> 1080p)
    const sortedFormats = targetQualities
      .filter((quality) => qualityMap.has(quality))
      .map((quality) => qualityMap.get(quality));

    return sortedFormats;
  } catch (error) {
    console.error("Error extracting MP4 formats:", error);
    throw error;
  }
};
/**
 * Main function to process YouTube API response
 * @param {Object} data - YouTube API response data
 * @returns {Object} Object containing videoInfo and formats
 */
export const processYoutubeData = (data) => {
  try {
    return {
      videoInfo: getVideoInfo(data),
      mp4Formats: getMP4Formats(data),
    };
  } catch (error) {
    console.error("Error processing YouTube data:", error);
    throw error;
  }
};



export function extractYouTubeId(url) {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }

  return null;
}







export function getVideoId(url) {
  const match = url.match(/v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/)
  return match ? match[1] : null
}

