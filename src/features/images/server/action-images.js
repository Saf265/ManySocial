"use server"

import { db } from "@/db/drizzle"
import { ImagesGenerated } from "@/db/drizzle/schema"
import { GoogleGenAI } from "@google/genai"
import { eq } from "drizzle-orm"

// get GeneratedImage from ID
export async function getGeneratedImage(id) {
  //drizzle
  const data = await db
    .select()
    .from(ImagesGenerated)
    .where(eq(ImagesGenerated.id, id))
    .limit(1)

  return data[0]
}

export async function enhancePrompt(prompt) {
  const enhancedPrompt = `You are an expert at enhancing image generation prompts. Take this basic prompt and expand it with vivid details, artistic style, lighting, composition, and quality modifiers. Keep it concise but descriptive. Return ONLY the enhanced prompt, nothing else.

Prompt: ${prompt}`;

  const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
  });


  const result = await ai.models.generateContent({ model: "gemini-flash-lite-latest", contents: enhancedPrompt });
  // const response = result.response.text();
  console.log("def", result)
  const response = result.candidates[0].content.parts[0].text;

  return response;
}
