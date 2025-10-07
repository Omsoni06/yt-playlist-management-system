import { YoutubeTranscript } from "youtube-transcript";

export async function getVideoTranscript(videoId) {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    // Combine all transcript text
    const fullText = transcript
      .map((item) => item.text)
      .join(" ")
      .replace(/\[.*?\]/g, "") // Remove [Music], [Applause], etc.
      .trim();

    return fullText;
  } catch (error) {
    console.error("Transcript fetch error:", error);
    // Return null if transcript is not available (private videos, no captions)
    return null;
  }
}

export async function getVideoTranscriptWithTimestamps(videoId) {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    return transcript.map((item) => ({
      text: item.text,
      timestamp: Math.floor(item.offset / 1000), // Convert to seconds
      duration: Math.floor(item.duration / 1000),
    }));
  } catch (error) {
    console.error("Transcript fetch error:", error);
    return null;
  }
}
