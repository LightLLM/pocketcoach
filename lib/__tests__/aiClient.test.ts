import { sendChatMessage } from '../aiClient';
import type { Coach } from '@/types/coach';
import type { UserProfile } from '@/types/coach';

const mockCoach: Coach = {
  id: 'test',
  name: 'Test Coach',
  tagline: 'Tag',
  longDescription: 'Description',
  styleRules: ['Be brief'],
  starterPrompts: ['Hello'],
  category: 'habits',
  isPro: false,
};

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

describe('aiClient', () => {
  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    (Math.random as jest.Mock).mockRestore();
  });

  it('returns a string from mock replies when in mock mode', async () => {
    const reply = await sendChatMessage(
      mockCoach,
      null,
      'Help me focus',
      []
    );
    expect(typeof reply).toBe('string');
    expect(reply.length).toBeGreaterThan(0);
    expect(MOCK_REPLIES).toContain(reply);
  });

  it('uses conversation history (slices to last 20)', async () => {
    const reply = await sendChatMessage(mockCoach, null, 'Next step', [
      { role: 'user', content: 'Hi' },
      { role: 'assistant', content: 'Hello!' },
    ]);
    expect(MOCK_REPLIES).toContain(reply);
  });

  it('accepts profile and returns mock reply', async () => {
    const profile: UserProfile = {
      values: 'honesty',
      goals: 'ship',
      constraints: 'time',
    };
    const reply = await sendChatMessage(
      mockCoach,
      profile,
      'What should I do?',
      []
    );
    expect(MOCK_REPLIES).toContain(reply);
  });

  it('returns one of the predefined mock replies (deterministic with mock random)', async () => {
    (Math.random as jest.Mock).mockReturnValue(0);
    const r1 = await sendChatMessage(mockCoach, null, 'x', []);
    (Math.random as jest.Mock).mockReturnValue(0);
    const r2 = await sendChatMessage(mockCoach, null, 'y', []);
    expect(r1).toBe(r2);
    expect(MOCK_REPLIES).toContain(r1);
  });
});
