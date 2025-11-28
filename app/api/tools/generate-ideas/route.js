import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { topic, tone, targetAudience, videoType } = await request.json();

  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList
  });

  // Create a detailed prompt for the AI
  const systemPrompt = `Tu es un expert en création de contenu et brainstorming créatif. Génère 5 à 10 idées de contenu vidéo originales et engageantes basées sur les critères suivants.`;

  const userPrompt = `
Sujet: ${topic}
Ton: ${tone}
Public cible: ${targetAudience}
Type de vidéo: ${videoType}

Génère des idées de contenu créatives et engageantes pour ce type de vidéo. Chaque idée doit être:
- Originale et captivante
- Adaptée au public cible
- Appropriée pour le format ${videoType}
- Écrite dans un ton ${tone}

Format de réponse: Liste numérotée avec un titre accrocheur et une brève description pour chaque idée.
`;

  try {
    const response = await fetch('https://api.aimlapi.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AI_ML_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1500
      })
    });

    const data = await response.json();

    if (data.choices && data.choices[0]) {
      const ideas = data.choices[0].message.content;

      return NextResponse.json({
        ideas,
        success: true
      }, { status: 200 });
    }

    return NextResponse.json({
      error: "Erreur lors de la génération des idées",
      success: false
    }, { status: 500 });

  } catch (error) {
    console.error('Error generating ideas:', error);
    return NextResponse.json({
      error: "Erreur lors de la génération des idées",
      success: false
    }, { status: 500 });
  }
}
