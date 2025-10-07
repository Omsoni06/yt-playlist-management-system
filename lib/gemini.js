import { GoogleGenerativeAI } from "@google/generative-ai";
import { getVideoTranscript } from "./youtube-transcript";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateVideoSummary(
  videoTitle,
  videoDescription,
  videoId = null
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    let content = "";
    let transcriptAvailable = false;

    // Try to get video transcript first
    if (videoId) {
      console.log("Fetching transcript for video:", videoId);
      const transcript = await getVideoTranscript(videoId);

      if (transcript && transcript.length > 100) {
        // Limit transcript to 10,000 characters to avoid token limits
        content = transcript.substring(0, 10000);
        transcriptAvailable = true;
        console.log("✅ Using video transcript for summary");
      }
    }

    // Fallback to title + description if no transcript
    if (!transcriptAvailable) {
      content = `Title: ${videoTitle}\nDescription: ${
        videoDescription || "No description available"
      }`;
      console.log("⚠️ No transcript available, using title + description");
    }

    const prompt = `${
      transcriptAvailable
        ? "Based on this video transcript"
        : "Based on this video information"
    }:

${content}

Create a comprehensive, structured summary:

📚 **Main Topics Covered**
- List 4-6 key topics discussed in detail

💡 **Key Takeaways**
- List 5-7 most important concepts or lessons
- Focus on actionable insights

🎯 **Practical Applications**
- How can viewers apply this knowledge?

👥 **Target Audience**
- Who will benefit most from this content? (1-2 sentences)

📊 **Difficulty Level**
- Beginner, Intermediate, or Advanced (with brief explanation)

${
  transcriptAvailable
    ? "⏱️ **Key Timestamps** (if applicable)\n- Important moments in the video"
    : ""
}

Format clearly with proper spacing and emojis.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI error:", error);
    throw error;
  }
}

export async function generateQuizFromVideo(videoTitle, videoId) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Get transcript
    const transcript = await getVideoTranscript(videoId);

    if (!transcript || transcript.length < 200) {
      throw new Error("Insufficient video content to generate quiz");
    }

    // Use first 5000 characters of transcript
    const content = transcript.substring(0, 5000);

    const prompt = `Based on this video transcript from "${videoTitle}":

${content}

Generate 5 challenging multiple-choice questions that test understanding:

Format each question exactly like this:

Q1: [Question based on video content]
A) [Plausible option]
B) [Plausible option]
C) [Plausible option]
D) [Plausible option]
✓ Correct Answer: [Letter]
💭 Explanation: [Brief explanation of why this is correct]

Make questions test comprehension, not just memory.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Quiz generation error:", error);
    throw error;
  }
}

// Keep existing functions...
export async function generateQuizFromNotes(videoTitle, notes) {
  // ... (keep your existing code)
}

export async function generateFlashcards(notes) {
  // ... (keep your existing code)
}
