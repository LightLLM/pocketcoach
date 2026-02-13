import Constants from 'expo-constants';
import type { Coach } from '@/types/coach';
import type { UserProfile } from '@/types/coach';

const AI_MODE = (Constants.expoConfig?.extra?.EXPO_PUBLIC_AI_MODE ?? process.env.EXPO_PUBLIC_AI_MODE ?? 'mock') as string;
const OPENAI_API_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_OPENAI_API_KEY ?? process.env.EXPO_PUBLIC_OPENAI_API_KEY;

const MOCK_REPLIES = [
  "Start with one tiny step. What's the smallest action you could take in the next 10 minutes?",
  "Clarity comes from constraints. What's the one outcome that would make today a win?",
  "Let's break it down. What's the first decision you need to make?",
  "Focus on the system, not the goal. What habit would make this easier?",
  "Take a breath. What's actually in your control right now?",
  "One question to consider: What would you do if you knew you couldn't fail?",
  "Small steps compound. What's one thing you can do before the day ends?",
  "Your next step doesn't need to be perfect—it just needs to be next. What's that step?",
  "What would your future self thank you for doing today?",
  "Let's make it concrete. What's the very next action?",
];

function buildSystemPrompt(coach: Coach, profile: UserProfile | null): string {
  const rules = coach.styleRules.join('\n');
  const context = profile
    ? `User context - use sparingly to personalize:\nValues: ${profile.values ?? 'Not set'}\nGoals: ${profile.goals ?? 'Not set'}\nConstraints: ${profile.constraints ?? 'Not set'}`
    : '';
  return `You are "${coach.name}". ${coach.longDescription}

Style and rules:
${rules}
${context}

Keep responses concise (2-4 sentences). Be direct and supportive. Ask one clarifying question when helpful.`;
}

export async function sendChatMessage(
  coach: Coach,
  profile: UserProfile | null,
  userMessage: string,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  if (AI_MODE === 'real' && OPENAI_API_KEY) {
    try {
      const systemPrompt = buildSystemPrompt(coach, profile);
      const messages: { role: 'user' | 'assistant' | 'system'; content: string }[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-20).map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage },
      ];
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          max_tokens: 256,
          temperature: 0.7,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || `API ${res.status}`);
      }
      const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const content = data.choices?.[0]?.message?.content?.trim();
      return content ?? MOCK_REPLIES[0];
    } catch (e) {
      console.warn('OpenAI request failed, falling back to mock:', e);
      return getMockReply();
    }
  }
  return getMockReply();
}

function getMockReply(): string {
  return MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
}
