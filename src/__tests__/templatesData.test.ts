import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  localTemplates,
  curatedMemes,
  fetchImgflipMemes,
  fetchRedditMemes,
  type MemeTemplate
} from '../lib/templatesData';

describe('Templates Data Suite', () => {
  it('should have local templates defined with valid attributes', () => {
    expect(localTemplates.length).toBeGreaterThan(0);
    localTemplates.forEach((t) => {
      expect(t.id).toBeDefined();
      expect(t.name).toBeTruthy();
      expect(t.url).toMatch(/^\/img\/.+/);
    });
  });

  it('should include curated memes including two-panel templates', () => {
    expect(curatedMemes.length).toBeGreaterThanOrEqual(10);
    const twoPanelMemes = curatedMemes.filter(
      (m) => m.category === 'Two-Panel' || m.name.toLowerCase().includes('panel')
    );
    expect(twoPanelMemes.length).toBeGreaterThan(0);
  });

  it('should correctly filter templates by category', () => {
    const all = [...localTemplates, ...curatedMemes];
    const classicOnly = all.filter((t) => t.category === 'Classic');
    expect(classicOnly.length).toBeGreaterThan(0);
    classicOnly.forEach((t) => expect(t.category).toBe('Classic'));
  });

  it('should correctly filter templates by search query', () => {
    const all = [...localTemplates, ...curatedMemes];
    const query = 'doge';
    const matches = all.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()));
    expect(matches.length).toBeGreaterThan(0);
    matches.forEach((m) => expect(m.name.toLowerCase()).toContain('doge'));
  });

  describe('fetchImgflipMemes', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('should parse memes when API returns success', async () => {
      const mockResponse = {
        success: true,
        data: {
          memes: [
            { id: '181913649', name: 'Drake Hotline Bling', url: 'https://i.imgflip.com/30b1gx.jpg', box_count: 2 },
            { id: '87743020', name: 'Two Buttons', url: 'https://i.imgflip.com/1g8my4.jpg', box_count: 3 }
          ]
        }
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        json: async () => mockResponse
      } as Response);

      const memes = await fetchImgflipMemes();
      expect(memes.length).toBe(2);
      expect(memes[0].id).toBe('imgflip_181913649');
      expect(memes[0].name).toBe('Drake Hotline Bling');
      expect(memes[1].category).toBe('Multi-Panel');
    });

    it('should return empty array gracefully when fetch fails', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
      const memes = await fetchImgflipMemes();
      expect(memes).toEqual([]);
    });
  });

  describe('fetchRedditMemes', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('should map Reddit meme items correctly', async () => {
      const mockResponse = {
        count: 2,
        memes: [
          { title: 'Funny Meme 1', url: 'https://i.redd.it/meme1.jpg' },
          { title: 'Funny Meme 2', url: 'https://i.redd.it/meme2.jpg' }
        ]
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        json: async () => mockResponse
      } as Response);

      const memes = await fetchRedditMemes(2);
      expect(memes.length).toBe(2);
      expect(memes[0].name).toBe('Funny Meme 1');
      expect(memes[0].category).toBe('Viral');
    });

    it('should handle API errors safely without throwing', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Reddit 500 error'));
      const memes = await fetchRedditMemes(10);
      expect(memes).toEqual([]);
    });
  });
});
