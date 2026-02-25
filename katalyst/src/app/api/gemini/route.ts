import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // requests per window
const RATE_WINDOW_MS = 60 * 1000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server configuration error." },
      { status: 500 }
    );
  }

  try {
    const { prompt, systemInstruction } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Invalid request: prompt is required." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const primaryModel = process.env.GEMINI_MODEL || "gemini-3.1-pro-preview";
    const fallbackModel = process.env.GEMINI_FALLBACK_MODEL || "gemini-3-flash-preview";

    try {
      const model = genAI.getGenerativeModel({
        model: primaryModel,
        ...(systemInstruction && { systemInstruction }),
      });
      const result = await model.generateContent(prompt);
      return NextResponse.json({ text: result.response.text() });
    } catch {
      const model = genAI.getGenerativeModel({
        model: fallbackModel,
        ...(systemInstruction && { systemInstruction }),
      });
      const result = await model.generateContent(prompt);
      return NextResponse.json({ text: result.response.text() });
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Failed to get response from AI. Please try again." },
      { status: 500 }
    );
  }
}
