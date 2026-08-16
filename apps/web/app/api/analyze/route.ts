import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const {
      coin,
      name,
      current_price,
      price_change_percentage_24h,
      high_24h,
      low_24h,
      market_cap,
      total_volume,
    } = await request.json();

    if (!coin || current_price === undefined) {
      return NextResponse.json(
        {
          error: "Market data is required.",
        },
        {
          status: 400,
        }
      );
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `
You are a professional cryptocurrency market analyst.

Analyze the following REAL-TIME market data.

Coin: ${name || coin}
Symbol: ${coin.toUpperCase()}

Current Price: $${current_price}
24h Change: ${price_change_percentage_24h}%
24h High: $${high_24h}
24h Low: $${low_24h}
Market Cap: $${market_cap}
24h Trading Volume: $${total_volume}

Based ONLY on the market data provided above, provide a concise analysis.

Return:

📈 Trend: Bullish, Bearish, or Neutral
🎯 Confidence: 0-100%
⚠️ Risk: Low, Medium, or High
😊 Market Sentiment: Positive, Negative, or Neutral

📝 Short Summary:
Explain the current market condition in 3-5 sentences.

Important:
- Do not invent price levels or external news.
- Do not claim to know information that was not provided.
- This is market analysis, not financial advice.
- Keep the entire response under 150 words.
      `,
    });

    return NextResponse.json({
      analysis: response.text,
    });
  } catch (error) {
    console.error("Analysis API error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate analysis.",
      },
      {
        status: 500,
      }
    );
  }
}