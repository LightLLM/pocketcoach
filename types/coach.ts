export type CoachCategory =
  | 'habits'
  | 'focus'
  | 'decisions'
  | 'systems'
  | 'creativity'
  | 'mindset'
  | 'career'
  | 'relationships';

export interface Coach {
  id: string;
  name: string;
  tagline: string;
  longDescription: string;
  styleRules: string[];
  starterPrompts: string[];
  category: CoachCategory;
  isPro: boolean;
  isCustom?: boolean;
}

export interface UserProfile {
  values?: string;
  goals?: string;
  constraints?: string;
  updatedAt?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  coachId: string;
  messages: ChatMessage[];
  updatedAt: number;
}
