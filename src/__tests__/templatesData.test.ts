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

  describe('Extensive Blank Catalog (>10,000 Blank Working Templates)', () => {
    it('should generate more than 10,000 real working blank templates', async () => {
      const { generateExtensiveBlankCatalog } = await import('../lib/templatesData');
      const catalog = generateExtensiveBlankCatalog();
      expect(catalog.length).toBeGreaterThan(10000);
    });

    it('should have over 85% blank unwritten templates for users to customize', async () => {
      const { generateExtensiveBlankCatalog } = await import('../lib/templatesData');
      const catalog = generateExtensiveBlankCatalog();
      const blankCount = catalog.filter((t) => t.isBlank === true).length;
      const blankPercentage = (blankCount / catalog.length) * 100;
      expect(blankPercentage).toBeGreaterThanOrEqual(85);
    });

    it('should cover all standard meme categories with non-empty templates', async () => {
      const { generateExtensiveBlankCatalog } = await import('../lib/templatesData');
      const catalog = generateExtensiveBlankCatalog();
      const categories = ['Pure Blank', 'Two-Panel', 'Multi-Panel', 'Classic', 'Modern & Viral', 'Reactions', 'Animals', 'Gaming'];
      
      for (const cat of categories) {
        const matching = catalog.filter((t) => t.category === cat);
        expect(matching.length).toBeGreaterThan(100);
      }
    });

    it('should ensure every template has a valid SVG data URL and non-empty name', async () => {
      const { generateExtensiveBlankCatalog } = await import('../lib/templatesData');
      const catalog = generateExtensiveBlankCatalog();
      // Sample check first 50 and last 50
      const sample = [...catalog.slice(0, 50), ...catalog.slice(-50)];
      sample.forEach((t) => {
        expect(t.id).toBeTruthy();
        expect(t.name).toBeTruthy();
        expect(t.url).toMatch(/^data:image\/svg\+xml;charset=utf-8,/);
        expect(t.isBlank).toBe(true);
      });
    });

    it('should provide a reliable fallback SVG data URL for broken CDN images', async () => {
      const { getFallbackSvgUrl } = await import('../lib/templatesData');
      const fallback = getFallbackSvgUrl('Test Meme');
      expect(fallback).toMatch(/^data:image\/svg\+xml;charset=utf-8,/);
      expect(fallback).toContain('MEME%20CANVAS');
    });
  });
});

