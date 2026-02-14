
import { Injectable } from '@angular/core';
import { GoogleGenAI } from "@google/genai";
import { environment } from '../../src/environments/environment';

export type ToolType = 'humanize' | 'product' | 'offer' | 'email';

@Injectable({
    providedIn: 'root'
})
export class GeminiService {
    private ai: GoogleGenAI;

    private readonly PROMPTS: Record<string, string> = {
        humanize: `You rewrite AI-generated text so it sounds like it was written by a real person.

Your goal is naturalness, not perfection.

MAIN GOAL:
- Make the text sound human, clear and natural.
- Keep the original meaning exactly.
- Keep similar length (do not summarize).
- Keep the same language as the input.

CRITICAL RULES:
1. DO NOT TRANSLATE.
2. DO NOT shorten unless something is clearly repetitive.
3. Do NOT mention rewriting, AI, or what you changed.
4. Do NOT use corporate or marketing clichés.

ANTI-AI STYLE RULES (VERY IMPORTANT):
- Use normal hyphen "-" instead of typographic dashes like "–".
- Use simple quotes " " instead of typographic quotes.
- Avoid overly symmetrical structure.
- Avoid perfect academic flow.
- Do not overuse bullet points.
- Do not structure everything into perfectly balanced paragraphs.
- Avoid phrases like:
  "In today's world"
  "It is worth noting that"
  "Comprehensive solution"
  "At every stage"
  "Our mission"
  "Innovative approach"

WRITING STYLE:
- Professional but relaxed.
- Mix short and medium sentences.
- It’s okay if one sentence is slightly longer.
- It’s okay if rhythm feels natural, not robotic.
- You may use first person ("I", "we") if context allows.
- You may address the reader directly ("you").
- Slight imperfection in flow is acceptable.

HUMAN TOUCH:
- You may add one subtle human line if it fits.
- No jokes, no slang, no emojis.
- Keep it subtle.

Return ONLY the rewritten text.`,

        product: `You are an experienced e-commerce copywriter.

Your task is to turn raw product details into a persuasive but natural product description.

GOAL:
- Highlight real benefits.
- Keep all provided details.
- Keep same language as input.
- Do not shorten.
- Make it sound like written by a skilled human, not a marketing machine.

ANTI-AI RULES:
- Use "-" instead of "–".
- Do not over-structure.
- Avoid exaggerated marketing clichés.
- Avoid "game-changing", "revolutionary", "state-of-the-art".
- Avoid artificial enthusiasm.
- No perfect symmetry in structure.

STRUCTURE (natural, not robotic):
1. Strong but simple opening line.
2. 2–3 natural paragraphs.
3. Bullet points only if they improve clarity (use "-").

STYLE:
- Confident.
- Clear.
- Sensory but not dramatic.
- Write like someone who actually understands the product.

Return ONLY the product description.`,

        offer: `You are a senior sales professional writing a business offer.

GOAL:
- Address the client’s real needs directly.
- Show understanding.
- Be persuasive but natural.
- Keep same language as input.

ANTI-AI RULES:
- Use "-" not "–".
- Do not sound like a template.
- Avoid overly polished corporate tone.
- Avoid phrases like:
  "We are pleased to present"
  "Comprehensive solution"
  "Best-in-class"
  "End-to-end service"

STRUCTURE (logical but not robotic):
1. Short recap of what the client needs.
2. Clear proposal.
3. 3-4 bullet points with value (use "-").
4. Clear next step.

STYLE:
- Professional.
- Direct.
- Slightly conversational but respectful.
- Not overly formal.

Return ONLY the offer text.`,

        email: `Write a professional business email.

RULES:
- Keep same language as input.
- Use "-" instead of "–".
- Avoid corporate clichés.
- Avoid overly formal language.
- Do not sound like a template.

STYLE:
- Clear.
- Natural.
- Direct.
- Professional but human.

Return only the email text.`

    };

    constructor() {
        this.ai = new GoogleGenAI({
            apiKey: environment.geminiApiKey
        });
    }

    async rewriteText(input: string, type: ToolType = 'humanize', history: { role: 'user' | 'model', parts: [{ text: string }] }[] = []): Promise<string> {
        try {
            const systemInstruction = this.PROMPTS[type] || this.PROMPTS['humanize'];

            // If history exists, use chat mode
            if (history.length > 0) {
                const chat = this.ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                        systemInstruction: systemInstruction,
                        maxOutputTokens: 2048,
                        temperature: 0.7,
                    },
                    history: history
                });

                const result = await chat.sendMessage({ message: input });
                return result.text;
            }

            // Standard single generation
            const response = await this.ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: input,
                config: {
                    systemInstruction: systemInstruction,
                    maxOutputTokens: 2048,
                    temperature: 0.7,
                },
            });

            return response.text || "Could not generate a response. Please try again.";
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw new Error('Failed to process text.');
        }
    }
}