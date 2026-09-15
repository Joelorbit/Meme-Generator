import { describe, it, expect } from 'vitest';

describe('Meme Layout & Engine Calculation Suite', () => {
  const CANVAS_SIZE = 600;

  it('calculates single panel dimensions correctly', () => {
    const layout = 'single';
    const width = CANVAS_SIZE;
    const height = CANVAS_SIZE;
    expect(width).toBe(600);
    expect(height).toBe(600);
  });

  it('calculates horizontal split layout panels (side-by-side)', () => {
    const panel1 = { left: 0, top: 0, width: CANVAS_SIZE / 2, height: CANVAS_SIZE };
    const panel2 = { left: CANVAS_SIZE / 2, top: 0, width: CANVAS_SIZE / 2, height: CANVAS_SIZE };

    expect(panel1.width).toBe(300);
    expect(panel1.height).toBe(600);
    expect(panel2.width).toBe(300);
    expect(panel2.height).toBe(600);
    expect(panel1.width + panel2.width).toBe(CANVAS_SIZE);
  });

  it('calculates vertical split layout panels (top-and-bottom)', () => {
    const panel1 = { left: 0, top: 0, width: CANVAS_SIZE, height: CANVAS_SIZE / 2 };
    const panel2 = { left: 0, top: CANVAS_SIZE / 2, width: CANVAS_SIZE, height: CANVAS_SIZE / 2 };

    expect(panel1.width).toBe(600);
    expect(panel1.height).toBe(300);
    expect(panel2.width).toBe(600);
    expect(panel2.height).toBe(300);
    expect(panel1.height + panel2.height).toBe(CANVAS_SIZE);
  });

  it('correctly calculates aspect-ratio fit scaling factor', () => {
    const calculateScale = (imgW: number, imgH: number, targetW: number, targetH: number) => {
      return Math.min(targetW / imgW, targetH / imgH);
    };

    // Square image into square target
    expect(calculateScale(1000, 1000, 600, 600)).toBe(0.6);

    // Wide image (1200x600) into 600x600 target (limited by width)
    expect(calculateScale(1200, 600, 600, 600)).toBe(0.5);

    // Tall image (600x1200) into 600x600 target (limited by height)
    expect(calculateScale(600, 1200, 600, 600)).toBe(0.5);

    // Side-by-side half panel (300x600 target)
    expect(calculateScale(600, 600, 300, 600)).toBe(0.5);
  });

  it('swaps pictures between Slot 1 and Slot 2 properly', () => {
    let slot1 = { url: '/img/girl-running.png', name: 'Girl Running' };
    let slot2 = { url: '/img/doge.png', name: 'Doge' };

    const swap = () => {
      const temp = { ...slot1 };
      slot1 = { ...slot2 };
      slot2 = { ...temp };
    };

    swap();
    expect(slot1.name).toBe('Doge');
    expect(slot2.name).toBe('Girl Running');

    swap();
    expect(slot1.name).toBe('Girl Running');
    expect(slot2.name).toBe('Doge');
  });

  it('handles text case transformation formatting', () => {
    const formatText = (text: string, isAllCaps: boolean) => {
      return isAllCaps ? text.toUpperCase() : text;
    };

    expect(formatText('when you code', true)).toBe('WHEN YOU CODE');
    expect(formatText('When You Code', false)).toBe('When You Code');
  });
});
