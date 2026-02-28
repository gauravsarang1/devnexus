import { GoogleGenAI } from "@google/genai";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from "../../config/prisma.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export class AIService {
  static async suggestSearchTerms(query: string) {
    const model = 'gemini-3-flash-preview';
    const prompt = `You are a search assistant for a skill-exchange platform.
    User input: "${query}"
    Task: Suggest 5 highly relevant, specific skills or niche topics related to this input that users would likely want to learn or teach.
    Format: Return ONLY a comma-separated list of strings. No extra text, no numbers.
    Example for "Code": React Hooks, Python Data Science, Rust Systems, Frontend Performance, Backend Scaling.`;

    try {
      const response = await ai.models.generateContent({ model, contents: prompt });
      return response.text?.split(',').map(s => s.trim()).filter(s => s.length > 0) || [];
    } catch (e) {
      console.error("AI Search Suggestion Error:", e);
      return [];
    }
  }

  static async suggestUids(input: string) {
    const model = 'gemini-3-flash-preview';
    const prompt = `Generate 5 creative, short, professional, and cool unique user IDs for a person named or interested in "${input}". 
    Format: Return ONLY a comma-separated list of strings. No numbering, no extra text. 
    Examples: dev_aryan, pixelpioneer, codebound, sky_builder.`;

    const response = await ai.models.generateContent({ model, contents: prompt });
    const suggestions = response.text?.split(',').map(s => s.trim().toLowerCase().replace(/[^a-z0-9_]/g, '')) || [];
    
    const available = [];
    for (const sug of suggestions) {
      if (sug.length < 4) continue;
      const exists = await prisma.user.findUnique({ where: { uId: sug } });
      if (!exists) available.push(sug);
    }
    
    return available.slice(0, 5);
  }

  static async refineBio(name: string, bio: string) {
    const model = 'gemini-3-flash-preview';
    const prompt = `You are a premium profile copywriter. Refine the following bio for a user named "${name}" on a skill-exchange platform. 
    Make it professional, engaging, and Gen-Z friendly. Keep it under 150 characters. 
    Bio: ${bio}`;

    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text?.trim() || bio;
  }

  static async refineMessage(text: string) {
    const model = 'gemini-3-flash-preview';
    const prompt = `Optimize this chat message for a peer-to-peer learning collaboration. 
    Make it clear, friendly, and professional while sounding human. Keep the intent the same.
    Original: ${text}`;

    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text?.trim() || text;
  }

  static async askAssistant(question: string) {
    try {
      const kbPath = path.join(__dirname, '../../data/kb.json');
      const kbData = await fs.readFile(kbPath, 'utf-8');
      
      const model = 'gemini-3-flash-preview';
      const prompt = `Context about DevNexus: ${kbData}
      
      User Question: ${question}
      
      Instruction: Answer the user's question based on the context. Be helpful, enthusiastic, and concise (under 80 words). 
      If the info isn't in the context, give a general helpful answer about skill swapping.`;

      const response = await ai.models.generateContent({ model, contents: prompt });
      return response.text?.trim() || "I'm here to help you swap skills and build great things!";
    } catch (e) {
      return "I'm DevNexus's AI guide. How can I help you navigate our community?";
    }
  }

  static async coachChat(userId: string, messages: { role: string, content: string }[]) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { skills: { include: { skill: true } } }
    });

    const skillsText = user?.skills?.map((s: any) => {
      return `${s.skill?.name || 'Unknown'} (${s.role || 'Learning'})`;
    }).join(', ') || 'Exploring new skills';

    const history = messages.slice(0, -1).map(m => `${m.role === 'ai' ? 'Mentor' : 'User'}: ${m.content}`).join('\n');
    const currentInput = messages[messages.length - 1].content;

    const model = 'gemini-3-flash-preview';
    const prompt = `
      You are the DevNexus AI Mentor for an Indian Gen-Z peer-to-peer learning platform.
      User Profile: Name: ${user?.name || 'New Learner'}, Current Skills: [${skillsText}].
      
      Conversation History:
      ${history}
      
      Current User Message: ${currentInput}
      
      Instructions: 
      - Be an expert mentor. 
      - Use professional yet approachable Gen-Z slang occasionally (e.g., 'vibes', 'no cap', 'building').
      - Provide actionable advice based on the Indian tech/creative landscape (e.g., mention UPI, IITs, Indian startups, or local design trends).
      - Focus on mutual benefit: explain how they can teach their strengths to learn their weaknesses.
      - Keep responses under 150 words.
    `;

    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text?.trim() || "I'm analyzing your learning path. Could you rephrase that?";
  }
}