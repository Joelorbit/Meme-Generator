export interface MemeTemplate {
  id: string;
  name: string;
  url: string;
  category?: string;
  boxCount?: number;
  isBlank?: boolean;
}

export const localTemplates: MemeTemplate[] = [
  { id: 'girl_running', name: 'Girl Running', url: '/img/girl-running.png', category: 'Classic', isBlank: true },
  { id: 'me_and_boys', name: 'Me and the Boys', url: '/img/me-and-the-boys.png', category: 'Classic', isBlank: true },
  { id: 'you_shall_not_pass', name: 'You Shall Not Pass', url: '/img/you-shall-not-pass.png', category: 'Classic', isBlank: true },
  { id: 'doge', name: 'Doge', url: '/img/doge.png', category: 'Animals', isBlank: true },
  { id: 'popcat', name: 'Popcat', url: '/img/popcat.gif', category: 'Animals', isBlank: true },
  { id: 'knuckles', name: 'Ugandan Knuckles', url: '/img/knuckles.png', category: 'Gaming', isBlank: true },
  { id: 'polite_cat', name: 'Polite Cat', url: '/img/polite-cat.png', category: 'Animals', isBlank: true },
  { id: 'surprised_pikachu', name: 'Surprised Pikachu', url: '/img/surprised-pikachu.png', category: 'Reactions', isBlank: true },
];

export const pureBlankTemplates: MemeTemplate[] = [
  {
    id: 'blank_white_sq',
    name: 'Pure White Square (Blank)',
    url: 'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><rect width="800" height="800" fill="%23ffffff"/></svg>',
    category: 'Pure Blank',
    boxCount: 2,
    isBlank: true
  },
  {
    id: 'blank_dark_sq',
    name: 'Pure Obsidian Dark (Blank)',
    url: 'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><rect width="800" height="800" fill="%23121214"/></svg>',
    category: 'Pure Blank',
    boxCount: 2,
    isBlank: true
  },
  {
    id: 'blank_2_side_by_side',
    name: '2-Panel Side-by-Side (Blank)',
    url: 'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="500"><rect width="1000" height="500" fill="%23f4f4f5"/><line x1="500" y1="0" x2="500" y2="500" stroke="%2327272a" stroke-width="4"/><text x="250" y="260" font-family="sans-serif" font-size="28" font-weight="bold" fill="%23a1a1aa" text-anchor="middle">PANEL 1</text><text x="750" y="260" font-family="sans-serif" font-size="28" font-weight="bold" fill="%23a1a1aa" text-anchor="middle">PANEL 2</text></svg>',
    category: 'Two-Panel',
    boxCount: 2,
    isBlank: true
  },
  {
    id: 'blank_2_stacked',
    name: '2-Panel Top & Bottom (Blank)',
    url: 'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800"><rect width="600" height="800" fill="%23f4f4f5"/><line x1="0" y1="400" x2="600" y2="400" stroke="%2327272a" stroke-width="4"/><text x="300" y="210" font-family="sans-serif" font-size="28" font-weight="bold" fill="%23a1a1aa" text-anchor="middle">TOP PANEL</text><text x="300" y="610" font-family="sans-serif" font-size="28" font-weight="bold" fill="%23a1a1aa" text-anchor="middle">BOTTOM PANEL</text></svg>',
    category: 'Two-Panel',
    boxCount: 2,
    isBlank: true
  },
  {
    id: 'blank_4_grid',
    name: '4-Panel 2x2 Comic (Blank)',
    url: 'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><rect width="800" height="800" fill="%23f4f4f5"/><line x1="400" y1="0" x2="400" y2="800" stroke="%2327272a" stroke-width="4"/><line x1="0" y1="400" x2="800" y2="400" stroke="%2327272a" stroke-width="4"/><text x="200" y="210" font-family="sans-serif" font-size="24" font-weight="bold" fill="%23a1a1aa" text-anchor="middle">1</text><text x="600" y="210" font-family="sans-serif" font-size="24" font-weight="bold" fill="%23a1a1aa" text-anchor="middle">2</text><text x="200" y="610" font-family="sans-serif" font-size="24" font-weight="bold" fill="%23a1a1aa" text-anchor="middle">3</text><text x="600" y="610" font-family="sans-serif" font-size="24" font-weight="bold" fill="%23a1a1aa" text-anchor="middle">4</text></svg>',
    category: 'Multi-Panel',
    boxCount: 4,
    isBlank: true
  }
];

export const curatedMemes: MemeTemplate[] = [
  { id: 'drake', name: 'Drake Hotline Bling (2 Panel)', url: 'https://i.imgflip.com/30b1gx.jpg', category: 'Two-Panel', isBlank: true },
  { id: 'two_buttons', name: 'Two Buttons (Daily Struggle)', url: 'https://i.imgflip.com/1g8my4.jpg', category: 'Two-Panel', isBlank: true },
  { id: 'distracted_bf', name: 'Distracted Boyfriend', url: 'https://i.imgflip.com/1ur9b0.jpg', category: 'Classic', isBlank: true },
  { id: 'bernie_asking', name: 'Bernie I Am Once Again Asking', url: 'https://i.imgflip.com/3oevdk.jpg', category: 'Reactions', isBlank: false },
  { id: 'uno_draw_25', name: 'UNO Draw 25 Cards (2 Panel)', url: 'https://i.imgflip.com/3lmzyx.jpg', category: 'Two-Panel', isBlank: true },
  { id: 'left_exit_12', name: 'Left Exit 12 Off Ramp', url: 'https://i.imgflip.com/22bdq6.jpg', category: 'Classic', isBlank: true },
  { id: 'always_has_been', name: 'Always Has Been (2 Astronauts)', url: 'https://i.imgflip.com/46e43q.png', category: 'Two-Panel', isBlank: true },
  { id: 'anakin_padme', name: 'Anakin Padme 4 Panel', url: 'https://i.imgflip.com/5c7lwq.png', category: 'Two-Panel', isBlank: true },
  { id: 'epic_handshake', name: 'Epic Handshake', url: 'https://i.imgflip.com/28j0te.jpg', category: 'Classic', isBlank: true },
  { id: 'running_balloon', name: 'Running Away Balloon', url: 'https://i.imgflip.com/261o3j.jpg', category: 'Two-Panel', isBlank: true },
  { id: 'buff_doge_cheems', name: 'Buff Doge vs Cheems (2 Panel)', url: 'https://i.imgflip.com/43a45p.png', category: 'Two-Panel', isBlank: true },
  { id: 'woman_yelling_cat', name: 'Woman Yelling at a Cat (2 Panel)', url: 'https://i.imgflip.com/345v97.jpg', category: 'Two-Panel', isBlank: true },
  { id: 'expanding_brain', name: 'Expanding Brain (Multi Panel)', url: 'https://i.imgflip.com/1jwhww.jpg', category: 'Two-Panel', isBlank: true },
  { id: 'change_my_mind', name: 'Change My Mind (Steven Crowder)', url: 'https://i.imgflip.com/24y43o.jpg', category: 'Classic', isBlank: false },
  { id: 'trade_offer', name: 'Trade Offer (TikTok Guy)', url: 'https://i.imgflip.com/54hjww.jpg', category: 'Classic', isBlank: false },
  { id: 'sad_pablo', name: 'Sad Pablo Escobar (Waiting)', url: 'https://i.imgflip.com/1c1uej.jpg', category: 'Two-Panel', isBlank: true },
  { id: 'disaster_girl', name: 'Disaster Girl Smirking', url: 'https://i.imgflip.com/23ls.jpg', category: 'Classic', isBlank: true },
  { id: 'roll_safe', name: 'Roll Safe (Think About It)', url: 'https://i.imgflip.com/1h7in3.jpg', category: 'Reactions', isBlank: true },
  { id: 'panik_kalm_panik', name: 'Panik Kalm Panik (3 Panel Meme Man)', url: 'https://i.imgflip.com/3qqcim.png', category: 'Two-Panel', isBlank: true },
  { id: 'is_this_pigeon', name: 'Is This a Pigeon? (Anime Butterfly)', url: 'https://i.imgflip.com/1o00in.jpg', category: 'Classic', isBlank: true },
  { id: 'clown_makeup', name: 'Putting on Clown Makeup (4 Panel)', url: 'https://i.imgflip.com/38el31.jpg', category: 'Two-Panel', isBlank: true },
  { id: 'car_drift_exit', name: 'Car Drift Highway Exit', url: 'https://i.imgflip.com/16iyn1.jpg', category: 'Classic', isBlank: true },
  { id: 'hide_pain_harold', name: 'Hide the Pain Harold', url: 'https://i.imgflip.com/gk5el.jpg', category: 'Reactions', isBlank: true },
  { id: 'monkey_puppet', name: 'Monkey Puppet (Looking Away)', url: 'https://i.imgflip.com/2gnnjh.jpg', category: 'Two-Panel', isBlank: true },
  { id: 'i_bet_he_thinking', name: 'I Bet He Thinking of Other Girls', url: 'https://i.imgflip.com/1tl71a.jpg', category: 'Two-Panel', isBlank: true },
  { id: 'spider_man_pointing', name: 'Spider-Man Pointing at Spider-Man', url: 'https://i.imgflip.com/1tkjq9.jpg', category: 'Two-Panel', isBlank: true },
  { id: 'batman_slapping', name: 'Batman Slapping Robin (2 Panel)', url: 'https://i.imgflip.com/9ehk.jpg', category: 'Two-Panel', isBlank: true },
  { id: 'tuxedo_winnie', name: 'Tuxedo Winnie the Pooh (2 Panel)', url: 'https://i.imgflip.com/2ybua0.png', category: 'Two-Panel', isBlank: true },
  { id: 'boardroom_meeting', name: 'Boardroom Meeting Suggestion (3 Panel)', url: 'https://i.imgflip.com/m78d.jpg', category: 'Two-Panel', isBlank: true },
  { id: 'gigachad', name: 'Gigachad Gray Face', url: 'https://i.imgflip.com/58eyvu.png', category: 'Reactions', isBlank: true },
  { id: 'chad_vs_virgin', name: 'Yes Chad vs Virgin', url: 'https://i.imgflip.com/46e5a4.png', category: 'Two-Panel', isBlank: true },
  { id: 'they_same_picture', name: 'They Are The Same Picture (Pam Office)', url: 'https://i.imgflip.com/2za3u1.jpg', category: 'Two-Panel', isBlank: true },
  { id: 'mocking_spongebob', name: 'Mocking Spongebob', url: 'https://i.imgflip.com/1otk96.jpg', category: 'Reactions', isBlank: true },
  { id: 'leo_dicaprio_cheers', name: 'Leonardo DiCaprio Laughing Cheers', url: 'https://i.imgflip.com/4acd7j.png', category: 'Reactions', isBlank: true },
  { id: 'success_kid', name: 'Success Kid (Beach Fist)', url: 'https://i.imgflip.com/1bhk.jpg', category: 'Classic', isBlank: true },
  { id: 'grumpy_cat', name: 'Grumpy Cat No', url: 'https://i.imgflip.com/8p0a.jpg', category: 'Animals', isBlank: true },
  { id: 'y_u_no', name: 'Y U NO Guy', url: 'https://i.imgflip.com/1bh3.jpg', category: 'Classic', isBlank: true },
  { id: 'one_does_not_simply', name: 'One Does Not Simply (Boromir)', url: 'https://i.imgflip.com/1bij.jpg', category: 'Classic', isBlank: false },
  { id: 'ancient_aliens', name: 'Ancient Aliens Guy', url: 'https://i.imgflip.com/26am.jpg', category: 'Reactions', isBlank: false },
  { id: 'futurama_fry', name: 'Futurama Fry (Not Sure If)', url: 'https://i.imgflip.com/1bgw.jpg', category: 'Reactions', isBlank: true },
  { id: 'first_world_problems', name: 'First World Problems (Woman Crying)', url: 'https://i.imgflip.com/1bhf.jpg', category: 'Classic', isBlank: true },
  { id: 'bad_luck_brian', name: 'Bad Luck Brian', url: 'https://i.imgflip.com/1bip.jpg', category: 'Classic', isBlank: true },
  { id: 'confused_travolta', name: 'Confused John Travolta (Pulp Fiction)', url: 'https://i.imgflip.com/1bip.jpg', category: 'Reactions', isBlank: true },
  { id: 'squidward_window', name: 'Squidward Looking Out Window', url: 'https://i.imgflip.com/145qvv.jpg', category: 'Two-Panel', isBlank: true },
  { id: 'hard_to_swallow', name: 'Hard to Swallow Pills', url: 'https://i.imgflip.com/271ps6.jpg', category: 'Classic', isBlank: false },
  { id: 'whisper_and_goosebumps', name: 'Whisper in Ear Goosebumps', url: 'https://i.imgflip.com/1jgr70.jpg', category: 'Two-Panel', isBlank: true },
  { id: 'who_killed_hannibal', name: 'Who Killed Hannibal (Eric Andre Shoot)', url: 'https://i.imgflip.com/28s2gu.jpg', category: 'Two-Panel', isBlank: true },
  { id: 'scumbag_steve', name: 'Scumbag Steve', url: 'https://i.imgflip.com/1bgy.jpg', category: 'Classic', isBlank: true },
  { id: 'overly_attached_gf', name: 'Overly Attached Girlfriend', url: 'https://i.imgflip.com/1b71.jpg', category: 'Classic', isBlank: true },
  { id: 'philosoraptor', name: 'Philosoraptor', url: 'https://i.imgflip.com/1bgs.jpg', category: 'Animals', isBlank: true }
];

export async function fetchImgflipMemes(): Promise<MemeTemplate[]> {
  try {
    const res = await fetch('https://api.imgflip.com/get_memes');
    const json = await res.json();
    if (json.success && Array.isArray(json.data.memes)) {
      return json.data.memes.map((m: any) => ({
        id: 'imgflip_' + m.id,
        name: m.name,
        url: m.url,
        boxCount: m.box_count,
        category: m.box_count > 2 ? 'Multi-Panel' : (m.name.toLowerCase().includes('panel') ? 'Two-Panel' : 'Viral'),
        isBlank: true
      }));
    }
  } catch (e) {
    console.warn('Imgflip fetch failed, fallback to curated list', e);
  }
  return [];
}

export async function fetchMemegenMemes(): Promise<MemeTemplate[]> {
  try {
    const res = await fetch('https://api.memegen.link/templates');
    const json = await res.json();
    if (Array.isArray(json)) {
      return json.map((t: any) => ({
        id: 'memegen_' + t.id,
        name: t.name || t.id,
        url: t.blank || `https://api.memegen.link/images/${t.id}.jpg`,
        boxCount: t.lines || 2,
        category: (t.lines && t.lines > 2) ? 'Multi-Panel' : (t.name?.toLowerCase().includes('panel') ? 'Two-Panel' : 'Classic'),
        isBlank: true
      }));
    }
  } catch (e) {
    console.warn('Memegen fetch failed', e);
  }
  return [];
}

export async function fetchRedditMemes(count = 50, subreddit = 'MemeTemplatesOfficial'): Promise<MemeTemplate[]> {
  try {
    const res = await fetch(`https://meme-api.com/gimme/${subreddit}/${count}`);
    const json = await res.json();
    if (json.memes && Array.isArray(json.memes)) {
      return json.memes
        .filter((m: any) => {
          if (!m.url) return false;
          const lower = m.url.toLowerCase();
          return lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.webp');
        })
        .map((m: any) => {
          // Clean title
          let cleanTitle = (m.title || 'Meme Template')
            .replace(/\[.*?\]/g, '')
            .replace(/\(.*?\)/g, '')
            .replace(/template/gi, '')
            .trim();
          if (!cleanTitle) cleanTitle = 'Community Template';

          return {
            id: 'reddit_' + Math.random().toString(36).substr(2, 9),
            name: cleanTitle,
            url: m.url,
            category: 'Viral',
            isBlank: true
          };
        });
    }
  } catch (e) {
    console.warn('Reddit fetch failed', e);
  }
  return [];
}

let cachedCatalog: MemeTemplate[] | null = null;

export function getFallbackSvgUrl(title = 'Meme Canvas'): string {
  const cleanTitle = (title || 'Meme Canvas').replace(/[<>&"]/g, '').slice(0, 30);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="600" height="600" fill="#18181b"/><rect x="20" y="20" width="560" height="560" rx="16" fill="#27272a" stroke="#87a665" stroke-width="3"/><text x="300" y="280" font-family="sans-serif" font-size="28" font-weight="700" fill="#87a665" text-anchor="middle">MEME CANVAS</text><text x="300" y="325" font-family="sans-serif" font-size="18" fill="#a1a1aa" text-anchor="middle">${cleanTitle}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function generateExtensiveBlankCatalog(): MemeTemplate[] {
  if (cachedCatalog) return cachedCatalog;

  function makeSvgUrl(svg: string): string {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  const templates: MemeTemplate[] = [];

  const blankColors = [
    { name: 'Obsidian Noir', bg: '#09090b', border: '#27272a', text: '#71717a' },
    { name: 'Studio White', bg: '#ffffff', border: '#e4e4e7', text: '#71717a' },
    { name: 'Slate Midnight', bg: '#0f172a', border: '#1e293b', text: '#64748b' },
    { name: 'Cyber Charcoal', bg: '#18181b', border: '#3f3f46', text: '#a1a1aa' },
    { name: 'Warm Parchment', bg: '#fef3c7', border: '#fde68a', text: '#92400e' },
    { name: 'Forest Shadow', bg: '#022c22', border: '#064e3b', text: '#34d399' },
    { name: 'Deep Amethyst', bg: '#2e1065', border: '#581c87', text: '#c084fc' },
    { name: 'Midnight Navy', bg: '#020617', border: '#1e1b4b', text: '#60a5fa' },
    { name: 'Crimson Velvet', bg: '#450a0a', border: '#7f1d1d', text: '#f87171' },
    { name: 'Desert Amber', bg: '#451a03', border: '#78350f', text: '#fbbf24' }
  ];

  const blankThemes = [
    'Minimalist', 'Raw Canvas', 'Studio', 'Unwritten', 'Clean Slate',
    'Zero Distraction', 'High Contrast', 'Framed', 'Creative Blank', 'Universal'
  ];

  // 1. Pure Blank (1,500)
  for (let i = 0; i < 1500; i++) {
    const c = blankColors[i % blankColors.length];
    const t = blankThemes[Math.floor(i / blankColors.length) % blankThemes.length];
    const num = i + 1;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="600" height="600" fill="${c.bg}"/><rect x="16" y="16" width="568" height="568" rx="8" fill="none" stroke="${c.border}" stroke-width="2"/><text x="300" y="300" font-family="sans-serif" font-size="20" font-weight="700" fill="${c.text}" text-anchor="middle" letter-spacing="2">${t.toUpperCase()} #${num}</text></svg>`;
    templates.push({
      id: `blank_${num}`,
      name: `${t} Canvas (${c.name}) #${num}`,
      url: makeSvgUrl(svg),
      category: 'Pure Blank',
      boxCount: 2,
      isBlank: true
    });
  }

  // 2. Two-Panel (2,600)
  const twoPanelPairs = [
    ['Expectation', 'Reality'],
    ['Me at 3 AM', 'Me at 8 AM'],
    ['How It Started', 'How It is Going'],
    ['Code in Dev', 'Code in Production'],
    ['What I Planned', 'What Happened'],
    ['Client Budget', 'Client Demands'],
    ['Friday 5 PM', 'Monday 9 AM'],
    ['Brain at Night', 'Brain in Exam'],
    ['Before Coffee', 'After Coffee'],
    ['Theory', 'Practice'],
    ['Social Media', 'Real Life'],
    ['Year 2016', 'Year 2026'],
    ['Introvert Mode', 'Extrovert Mode'],
    ['Dog Logic', 'Cat Logic'],
    ['Hardware', 'Software'],
    ['Frontend', 'Backend'],
    ['Junior Dev', 'Senior Dev'],
    ['Self Control', 'Impulse Buying'],
    ['Sleep Schedule', 'One More Episode'],
    ['Gym Goals', 'Midnight Pizza'],
    ['5 Mins on Phone', '5 Hours on Phone'],
    ['Saying No Problem', 'Dying Inside'],
    ['Left Brain', 'Right Brain'],
    ['Dating Profile', 'Sunday Morning'],
    ['First Day on Job', 'One Year Later'],
    ['Healthy Diet Plan', '2 AM Fast Food']
  ];

  for (let i = 0; i < 2600; i++) {
    const pair = twoPanelPairs[i % twoPanelPairs.length];
    const num = i + 1;
    const isVertical = i % 2 === 1;
    const c = blankColors[i % blankColors.length];
    let svg = '';
    if (!isVertical) {
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="480"><rect width="720" height="480" fill="${c.bg}"/><line x1="360" y1="0" x2="360" y2="480" stroke="${c.border}" stroke-width="4"/><rect x="20" y="20" width="320" height="50" rx="8" fill="${c.border}" opacity="0.3"/><text x="180" y="52" font-family="sans-serif" font-size="16" font-weight="700" fill="${c.text}" text-anchor="middle">${pair[0].toUpperCase()}</text><rect x="380" y="20" width="320" height="50" rx="8" fill="${c.border}" opacity="0.3"/><text x="540" y="52" font-family="sans-serif" font-size="16" font-weight="700" fill="${c.text}" text-anchor="middle">${pair[1].toUpperCase()}</text><text x="360" y="450" font-family="sans-serif" font-size="12" fill="${c.text}" text-anchor="middle" opacity="0.6">2-PANEL #${num}</text></svg>`;
    } else {
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="720"><rect width="520" height="720" fill="${c.bg}"/><line x1="0" y1="360" x2="520" y2="360" stroke="${c.border}" stroke-width="4"/><rect x="20" y="20" width="480" height="50" rx="8" fill="${c.border}" opacity="0.3"/><text x="260" y="52" font-family="sans-serif" font-size="16" font-weight="700" fill="${c.text}" text-anchor="middle">${pair[0].toUpperCase()}</text><rect x="20" y="380" width="480" height="50" rx="8" fill="${c.border}" opacity="0.3"/><text x="260" y="412" font-family="sans-serif" font-size="16" font-weight="700" fill="${c.text}" text-anchor="middle">${pair[1].toUpperCase()}</text><text x="260" y="690" font-family="sans-serif" font-size="12" fill="${c.text}" text-anchor="middle" opacity="0.6">2-PANEL STACKED #${num}</text></svg>`;
    }
    templates.push({
      id: `twopanel_${num}`,
      name: `${pair[0]} vs ${pair[1]} (${isVertical ? 'Stacked' : 'Dual'}) #${num}`,
      url: makeSvgUrl(svg),
      category: 'Two-Panel',
      boxCount: 2,
      isBlank: true
    });
  }

  // 3. Multi-Panel (2,200)
  const multiTypes = [
    { name: '3-Panel Evolution', panels: ['NORMAL', 'PANIK', 'TRANSCEND'], boxes: 3 },
    { name: '4-Panel Comic Strip', panels: ['SETUP', 'HOPE', 'TWIST', 'REALITY'], boxes: 4 },
    { name: 'Clown Makeup 4-Stage', panels: ['STAGE 1', 'STAGE 2', 'STAGE 3', 'CIRCUS'], boxes: 4 },
    { name: '6-Panel Alignment Matrix', panels: ['LG', 'NG', 'CG', 'LN', 'TN', 'CE'], boxes: 6 },
    { name: '3-Panel Decision Branch', panels: ['OPTION A', 'OPTION B', 'CHAOS'], boxes: 3 },
    { name: 'Progressive Breakdown 4x', panels: ['PLAN', 'PROGRESS', 'DISASTER', 'ACCEPTANCE'], boxes: 4 }
  ];

  for (let i = 0; i < 2200; i++) {
    const m = multiTypes[i % multiTypes.length];
    const num = i + 1;
    const c = blankColors[i % blankColors.length];
    let svg = '';
    if (m.boxes === 4) {
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="600" height="600" fill="${c.bg}"/><line x1="300" y1="0" x2="300" y2="600" stroke="${c.border}" stroke-width="4"/><line x1="0" y1="300" x2="600" y2="300" stroke="${c.border}" stroke-width="4"/><text x="150" y="160" font-family="sans-serif" font-size="15" font-weight="700" fill="${c.text}" text-anchor="middle">${m.panels[0]}</text><text x="450" y="160" font-family="sans-serif" font-size="15" font-weight="700" fill="${c.text}" text-anchor="middle">${m.panels[1]}</text><text x="150" y="460" font-family="sans-serif" font-size="15" font-weight="700" fill="${c.text}" text-anchor="middle">${m.panels[2]}</text><text x="450" y="460" font-family="sans-serif" font-size="15" font-weight="700" fill="${c.text}" text-anchor="middle">${m.panels[3]}</text></svg>`;
    } else if (m.boxes === 3) {
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="600" height="600" fill="${c.bg}"/><line x1="0" y1="200" x2="600" y2="200" stroke="${c.border}" stroke-width="4"/><line x1="0" y1="400" x2="600" y2="400" stroke="${c.border}" stroke-width="4"/><text x="300" y="110" font-family="sans-serif" font-size="16" font-weight="700" fill="${c.text}" text-anchor="middle">${m.panels[0]}</text><text x="300" y="310" font-family="sans-serif" font-size="16" font-weight="700" fill="${c.text}" text-anchor="middle">${m.panels[1]}</text><text x="300" y="510" font-family="sans-serif" font-size="16" font-weight="700" fill="${c.text}" text-anchor="middle">${m.panels[2]}</text></svg>`;
    } else {
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="600" height="600" fill="${c.bg}"/><line x1="200" y1="0" x2="200" y2="600" stroke="${c.border}" stroke-width="3"/><line x1="400" y1="0" x2="400" y2="600" stroke="${c.border}" stroke-width="3"/><line x1="0" y1="300" x2="600" y2="300" stroke="${c.border}" stroke-width="3"/><text x="100" y="160" font-family="sans-serif" font-size="14" font-weight="700" fill="${c.text}" text-anchor="middle">LG</text><text x="300" y="160" font-family="sans-serif" font-size="14" font-weight="700" fill="${c.text}" text-anchor="middle">NG</text><text x="500" y="160" font-family="sans-serif" font-size="14" font-weight="700" fill="${c.text}" text-anchor="middle">CG</text><text x="100" y="460" font-family="sans-serif" font-size="14" font-weight="700" fill="${c.text}" text-anchor="middle">LN</text><text x="300" y="460" font-family="sans-serif" font-size="14" font-weight="700" fill="${c.text}" text-anchor="middle">TN</text><text x="500" y="460" font-family="sans-serif" font-size="14" font-weight="700" fill="${c.text}" text-anchor="middle">CE</text></svg>`;
    }
    templates.push({
      id: `multipanel_${num}`,
      name: `${m.name} Blank #${num}`,
      url: makeSvgUrl(svg),
      category: 'Multi-Panel',
      boxCount: m.boxes,
      isBlank: true
    });
  }

  // 4. Classic (1,600)
  const classicStyles = [
    'Demotivational Poster Frame',
    'Advice Sunburst Gradient Rays',
    'Breaking News TV Lower Third',
    'Vintage Wanted Poster',
    'Press F Memorial Plaque',
    'Change My Mind Outdoor Banner',
    'Newspaper Front Page Banner',
    'Top 10 Video Thumbnail Frame'
  ];

  for (let i = 0; i < 1600; i++) {
    const style = classicStyles[i % classicStyles.length];
    const num = i + 1;
    const c = blankColors[i % blankColors.length];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="600" height="600" fill="#000000"/><rect x="25" y="25" width="550" height="420" fill="${c.bg}" stroke="#ffffff" stroke-width="2"/><text x="300" y="510" font-family="Times New Roman, serif" font-size="28" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="3">${style.toUpperCase().slice(0, 18)} #${num}</text><text x="300" y="550" font-family="Times New Roman, serif" font-size="15" fill="#a1a1aa" text-anchor="middle">Insert Classic Punchline Here</text></svg>`;
    templates.push({
      id: `classic_${num}`,
      name: `${style} #${num}`,
      url: makeSvgUrl(svg),
      category: 'Classic',
      boxCount: 2,
      isBlank: true
    });
  }

  // 5. Modern & Viral (1,600)
  const modernStyles = [
    'Twitter Post Blank Mockup',
    'Reddit Card Blank Post',
    'Discord Chat Message Frame',
    'iOS Notification Alert Bubble',
    'Search Engine Did You Mean',
    'Spotify Track Lyrics Card',
    'YouTube 3AM Thumbnail Frame',
    'TikTok Subtitle Card Header'
  ];

  for (let i = 0; i < 1600; i++) {
    const style = modernStyles[i % modernStyles.length];
    const num = i + 1;
    const c = blankColors[i % blankColors.length];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="600" height="600" fill="${c.bg}"/><rect x="20" y="20" width="560" height="110" rx="16" fill="${c.border}" opacity="0.4"/><circle cx="65" cy="75" r="25" fill="#87a665"/><text x="105" y="70" font-family="sans-serif" font-size="16" font-weight="700" fill="#ffffff">Viral Creator @handle</text><text x="105" y="92" font-family="sans-serif" font-size="13" fill="${c.text}">Just now • 10.4M views</text><rect x="20" y="145" width="560" height="435" rx="12" fill="${c.bg}" stroke="${c.border}" stroke-width="2"/><text x="300" y="360" font-family="sans-serif" font-size="18" font-weight="600" fill="${c.text}" text-anchor="middle">${style.toUpperCase()} #${num}</text></svg>`;
    templates.push({
      id: `modern_${num}`,
      name: `${style} #${num}`,
      url: makeSvgUrl(svg),
      category: 'Modern & Viral',
      boxCount: 2,
      isBlank: true
    });
  }

  // 6. Reactions (850)
  const reactionStyles = [
    'Speech Bubble Left',
    'Speech Bubble Right',
    'Shouting Jagged Burst',
    'Internal Monologue Cloud',
    'Anime Radial Speed Lines',
    'Dramatic Cinematic Letterbox',
    'Dramatic Police Spotlight',
    'Shockwave Distortion Rings'
  ];

  for (let i = 0; i < 850; i++) {
    const style = reactionStyles[i % reactionStyles.length];
    const num = i + 1;
    const c = blankColors[i % blankColors.length];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="600" height="600" fill="${c.bg}"/><path d="M 50 100 Q 50 50 100 50 L 500 50 Q 550 50 550 100 L 550 250 Q 550 300 500 300 L 250 300 L 150 400 L 180 300 L 100 300 Q 50 300 50 250 Z" fill="${c.border}" opacity="0.3" stroke="${c.text}" stroke-width="3"/><text x="300" y="170" font-family="sans-serif" font-size="20" font-weight="700" fill="#ffffff" text-anchor="middle">${style.toUpperCase()}</text><text x="300" y="210" font-family="sans-serif" font-size="14" fill="${c.text}" text-anchor="middle">Write Your Reaction Here #${num}</text></svg>`;
    templates.push({
      id: `reaction_${num}`,
      name: `${style} Reaction #${num}`,
      url: makeSvgUrl(svg),
      category: 'Reactions',
      boxCount: 1,
      isBlank: true
    });
  }

  // 7. Animals (450)
  const animalStyles = [
    'Dogelore Multi-Quote Canvas',
    'Cat Supreme Court Tribunal',
    'Golden Retriever vs Black Cat',
    'Wildlife Documentary Narrator',
    'He Screm Dramatic Frame',
    'Pet Adoption Chaos Profile'
  ];

  for (let i = 0; i < 450; i++) {
    const style = animalStyles[i % animalStyles.length];
    const num = i + 1;
    const c = blankColors[i % blankColors.length];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="600" height="600" fill="${c.bg}"/><rect x="20" y="20" width="560" height="560" rx="20" fill="none" stroke="${c.border}" stroke-width="4"/><text x="300" y="270" font-family="Comic Sans MS, sans-serif" font-size="24" font-weight="700" fill="#87a665" text-anchor="middle">much blank • very meme</text><text x="300" y="320" font-family="sans-serif" font-size="16" font-weight="600" fill="${c.text}" text-anchor="middle">${style.toUpperCase()} #${num}</text></svg>`;
    templates.push({
      id: `animal_${num}`,
      name: `${style} #${num}`,
      url: makeSvgUrl(svg),
      category: 'Animals',
      boxCount: 2,
      isBlank: true
    });
  }

  // 8. Gaming (550)
  const gamingStyles = [
    '8-Bit Retro RPG Dialogue Box',
    'Dark Souls You Died Canvas',
    'Skyrim Skill 100 Card',
    'Steam Achievement Unlocked',
    'Cyberpunk 2077 Terminal HUD',
    'Minecraft Chat & Item Tooltip',
    'GTA Wasted Vignette Frame',
    'Arcade Choose Your Fighter'
  ];

  for (let i = 0; i < 550; i++) {
    const style = gamingStyles[i % gamingStyles.length];
    const num = i + 1;
    const c = blankColors[i % blankColors.length];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="600" height="600" fill="#0c0a09"/><rect x="25" y="380" width="550" height="190" rx="10" fill="#1e1b4b" stroke="#fbbf24" stroke-width="4"/><polygon points="50,420 70,435 50,450" fill="#fbbf24"/><text x="90" y="440" font-family="monospace" font-size="18" font-weight="700" fill="#ffffff">QUEST: ${style.toUpperCase()}</text><text x="90" y="480" font-family="monospace" font-size="15" fill="#a5b4fc">Objective: Customize your caption #${num}</text></svg>`;
    templates.push({
      id: `gaming_${num}`,
      name: `${style} #${num}`,
      url: makeSvgUrl(svg),
      category: 'Gaming',
      boxCount: 2,
      isBlank: true
    });
  }

  cachedCatalog = templates;
  return cachedCatalog;
}

export async function fetchAllInitialBlankTemplates(): Promise<MemeTemplate[]> {
  const [imgflip, memegen] = await Promise.all([
    fetchImgflipMemes(),
    fetchMemegenMemes()
  ]);

  const combined = [
    ...pureBlankTemplates,
    ...localTemplates,
    ...curatedMemes,
    ...generateExtensiveBlankCatalog(),
    ...imgflip,
    ...memegen
  ];

  // Deduplicate by URL
  const seenUrls = new Set<string>();
  const unique: MemeTemplate[] = [];
  for (const item of combined) {
    if (!seenUrls.has(item.url)) {
      seenUrls.add(item.url);
      unique.push(item);
    }
  }

  return unique;
}
