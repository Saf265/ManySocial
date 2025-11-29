
/**
 * Extract video information from YouTube API response
 * @param {Object} data - YouTube API response data
 * @returns {Object} Video info with thumbnail, title, keywords, and viewCount
 */
export const getVideoInfo = (data) => {
  try {
    // Get best quality thumbnail (largest resolution)
    const bestThumbnail = data.thumbnail?.reduce((best, current) => {
      const bestArea = (best.width || 0) * (best.height || 0);
      const currentArea = (current.width || 0) * (current.height || 0);
      return currentArea > bestArea ? current : best;
    }) || null;

    // Convert keywords array to hashtag string
    const keywordsString = data.keywords
      ?.map((keyword) => `#${keyword.replace(/\s+/g, "")}`)
      .join(" ") || "";

    return {
      thumbnail: bestThumbnail?.url || null,
      title: data.title || "",
      keywords: keywordsString,
      viewCount: data.viewCount || "0",
    };
  } catch (error) {
    console.error("Error extracting video info:", error);
    throw error;
  }
};

/**
 * Extract MP4 formats from 360p to 1080p, removing duplicates
 * @param {Object} data - YouTube API response data
 * @returns {Array} Array of unique MP4 formats with qualityLabel, url, and bitrate
 */
export const getMP4Formats = (data) => {
  try {
    const targetQualities = ["360p", "480p", "720p", "1080p"];
    const qualityMap = new Map();

    // Process all formats (both regular and adaptive)
    const allFormats = [
      ...(data.formats || []),
      ...(data.adaptiveFormats || []),
    ];

    // Filter MP4 formats and deduplicate by quality
    allFormats.forEach((format) => {
      const qualityLabel = format.qualityLabel || "";
      const isMp4 = format.mimeType?.includes("video/mp4") || false;

      // Only include target qualities and MP4 format
      if (targetQualities.includes(qualityLabel) && isMp4) {
        // Keep the format with highest bitrate for each quality
        if (!qualityMap.has(qualityLabel)) {
          qualityMap.set(qualityLabel, {
            qualityLabel,
            url: format.url,
            bitrate: format.bitrate || 0,
          });
        } else {
          const existing = qualityMap.get(qualityLabel);
          if (format.bitrate > existing.bitrate) {
            qualityMap.set(qualityLabel, {
              qualityLabel,
              url: format.url,
              bitrate: format.bitrate || 0,
            });
          }
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
      formats: getMP4Formats(data),
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


