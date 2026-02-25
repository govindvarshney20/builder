import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

const PRIMARY_MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-3.1-pro-preview";
const FALLBACK_MODEL = process.env.NEXT_PUBLIC_GEMINI_FALLBACK_MODEL || "gemini-3-flash-preview";

export async function askGemini(prompt: string, systemInstruction?: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: PRIMARY_MODEL,
      ...(systemInstruction && { systemInstruction }),
    });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch {
    try {
      const fallbackModel = genAI.getGenerativeModel({
        model: FALLBACK_MODEL,
        ...(systemInstruction && { systemInstruction }),
      });
      const result = await fallbackModel.generateContent(prompt);
      return result.response.text();
    } catch (fallbackError) {
      console.error("Gemini API error:", fallbackError);
      throw new Error("Failed to get response from AI. Please try again.");
    }
  }
}

export async function streamGemini(
  prompt: string,
  onChunk: (text: string) => void,
  systemInstruction?: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: PRIMARY_MODEL,
      ...(systemInstruction && { systemInstruction }),
    });
    const result = await model.generateContentStream(prompt);
    let fullText = "";
    for await (const chunk of result.stream) {
      const text = chunk.text();
      fullText += text;
      onChunk(fullText);
    }
    return fullText;
  } catch {
    try {
      const fallbackModel = genAI.getGenerativeModel({
        model: FALLBACK_MODEL,
        ...(systemInstruction && { systemInstruction }),
      });
      const result = await fallbackModel.generateContentStream(prompt);
      let fullText = "";
      for await (const chunk of result.stream) {
        const text = chunk.text();
        fullText += text;
        onChunk(fullText);
      }
      return fullText;
    } catch (fallbackError) {
      console.error("Gemini streaming error:", fallbackError);
      throw new Error("Failed to get response from AI. Please try again.");
    }
  }
}
