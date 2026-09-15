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

export async function fetchAllInitialBlankTemplates(): Promise<MemeTemplate[]> {
  const [imgflip, memegen] = await Promise.all([
    fetchImgflipMemes(),
    fetchMemegenMemes()
  ]);

  const combined = [
    ...pureBlankTemplates,
    ...localTemplates,
    ...curatedMemes,
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
