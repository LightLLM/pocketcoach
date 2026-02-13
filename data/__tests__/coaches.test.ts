import { COACH_CATEGORIES, SEEDED_COACHES } from '../coaches';
import type { Coach } from '@/types/coach';

describe('coaches data', () => {
  describe('COACH_CATEGORIES', () => {
    it('has 8 categories', () => {
      expect(COACH_CATEGORIES).toHaveLength(8);
    });

    it('each entry has key and label', () => {
      COACH_CATEGORIES.forEach((cat) => {
        expect(cat).toHaveProperty('key');
        expect(cat).toHaveProperty('label');
        expect(typeof cat.key).toBe('string');
        expect(typeof cat.label).toBe('string');
      });
    });

    it('includes habits, focus, decisions, systems, creativity, mindset, career, relationships', () => {
      const keys = COACH_CATEGORIES.map((c) => c.key);
      expect(keys).toContain('habits');
      expect(keys).toContain('focus');
      expect(keys).toContain('decisions');
      expect(keys).toContain('systems');
      expect(keys).toContain('creativity');
      expect(keys).toContain('mindset');
      expect(keys).toContain('career');
      expect(keys).toContain('relationships');
    });
  });

  describe('SEEDED_COACHES', () => {
    it('has at least 8 coaches', () => {
      expect(SEEDED_COACHES.length).toBeGreaterThanOrEqual(8);
    });

    it('each coach has required fields', () => {
      const required: (keyof Coach)[] = [
        'id',
        'name',
        'tagline',
        'longDescription',
        'styleRules',
        'starterPrompts',
        'category',
        'isPro',
      ];
      SEEDED_COACHES.forEach((coach) => {
        required.forEach((key) => {
          expect(coach).toHaveProperty(key);
        });
      });
    });

    it('styleRules and starterPrompts are arrays', () => {
      SEEDED_COACHES.forEach((coach) => {
        expect(Array.isArray(coach.styleRules)).toBe(true);
        expect(Array.isArray(coach.starterPrompts)).toBe(true);
      });
    });

    it('each coach has 5 starter prompts', () => {
      SEEDED_COACHES.forEach((coach) => {
        expect(coach.starterPrompts).toHaveLength(5);
      });
    });

    it('category is one of COACH_CATEGORIES keys', () => {
      const validKeys = new Set(COACH_CATEGORIES.map((c) => c.key));
      SEEDED_COACHES.forEach((coach) => {
        expect(validKeys.has(coach.category)).toBe(true);
      });
    });

    it('has Atomic Habits Coach and Focus Sprint Coach as free (isPro false)', () => {
      const atomic = SEEDED_COACHES.find((c) => c.id === 'atomic-habits');
      const focus = SEEDED_COACHES.find((c) => c.id === 'focus-sprint');
      expect(atomic).toBeDefined();
      expect(atomic?.isPro).toBe(false);
      expect(focus).toBeDefined();
      expect(focus?.isPro).toBe(false);
    });

    it('has expected coach ids', () => {
      const ids = SEEDED_COACHES.map((c) => c.id);
      expect(ids).toContain('atomic-habits');
      expect(ids).toContain('focus-sprint');
      expect(ids).toContain('decision-clarity');
      expect(ids).toContain('minimalist-systems');
      expect(ids).toContain('creator-consistency');
      expect(ids).toContain('anxiety-to-action');
      expect(ids).toContain('career-strategy');
      expect(ids).toContain('relationship-communication');
    });
  });
});
