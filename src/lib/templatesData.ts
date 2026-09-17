import rawMemeTemplates from './memeTemplates.json';

export interface MemeTemplate {
  id: string;
  name: string;
  url: string;
  category?: string;
  boxCount?: number;
}

// Local image meme templates bundled with the app
export const localTemplates: MemeTemplate[] = [
  { id: 'girl_running', name: 'Girl Running', url: '/img/girl-running.png', category: 'Classic' },
  { id: 'me_and_boys', name: 'Me and the Boys', url: '/img/me-and-the-boys.png', category: 'Classic' },
  { id: 'you_shall_not_pass', name: 'You Shall Not Pass', url: '/img/you-shall-not-pass.png', category: 'Classic' },
  { id: 'doge', name: 'Doge', url: '/img/doge.png', category: 'Animals' },
  { id: 'popcat', name: 'Popcat', url: '/img/popcat.gif', category: 'Animals' },
  { id: 'knuckles', name: 'Ugandan Knuckles', url: '/img/knuckles.png', category: 'Gaming' },
  { id: 'polite_cat', name: 'Polite Cat', url: '/img/polite-cat.png', category: 'Animals' },
  { id: 'surprised_pikachu', name: 'Surprised Pikachu', url: '/img/surprised-pikachu.png', category: 'Reactions' },
];

// Hand-picked curated real meme image templates
export const curatedMemes: MemeTemplate[] = [
  { id: 'drake', name: 'Drake Hotline Bling', url: 'https://i.imgflip.com/30b1gx.jpg', category: 'Classic' },
  { id: 'two_buttons', name: 'Two Buttons', url: 'https://i.imgflip.com/1g8my4.jpg', category: 'Classic' },
  { id: 'distracted_bf', name: 'Distracted Boyfriend', url: 'https://i.imgflip.com/1ur9b0.jpg', category: 'Classic' },
  { id: 'bernie_asking', name: 'Bernie Asking', url: 'https://i.imgflip.com/3oevdk.jpg', category: 'Reactions' },
  { id: 'uno_draw_25', name: 'UNO Draw 25', url: 'https://i.imgflip.com/3lmzyx.jpg', category: 'Classic' },
  { id: 'left_exit_12', name: 'Left Exit 12', url: 'https://i.imgflip.com/22bdq6.jpg', category: 'Classic' },
  { id: 'always_has_been', name: 'Always Has Been', url: 'https://i.imgflip.com/46e43q.png', category: 'Classic' },
  { id: 'anakin_padme', name: 'Anakin Padme 4 Panel', url: 'https://i.imgflip.com/5c7lwq.png', category: 'Classic' },
  { id: 'epic_handshake', name: 'Epic Handshake', url: 'https://i.imgflip.com/28j0te.jpg', category: 'Classic' },
  { id: 'running_balloon', name: 'Running Away Balloon', url: 'https://i.imgflip.com/261o3j.jpg', category: 'Classic' },
  { id: 'buff_doge_cheems', name: 'Buff Doge vs Cheems', url: 'https://i.imgflip.com/43a45p.png', category: 'Classic' },
  { id: 'woman_yelling_cat', name: 'Woman Yelling at Cat', url: 'https://i.imgflip.com/345v97.jpg', category: 'Classic' },
  { id: 'expanding_brain', name: 'Expanding Brain', url: 'https://i.imgflip.com/1jwhww.jpg', category: 'Classic' },
  { id: 'change_my_mind', name: 'Change My Mind', url: 'https://i.imgflip.com/24y43o.jpg', category: 'Classic' },
  { id: 'trade_offer', name: 'Trade Offer', url: 'https://i.imgflip.com/54hjww.jpg', category: 'Classic' },
  { id: 'sad_pablo', name: 'Sad Pablo Escobar', url: 'https://i.imgflip.com/1c1uej.jpg', category: 'Reactions' },
  { id: 'disaster_girl', name: 'Disaster Girl', url: 'https://i.imgflip.com/23ls.jpg', category: 'Classic' },
  { id: 'roll_safe', name: 'Roll Safe Think', url: 'https://i.imgflip.com/1h7in3.jpg', category: 'Reactions' },
  { id: 'panik_kalm_panik', name: 'Panik Kalm Panik', url: 'https://i.imgflip.com/3qqcim.png', category: 'Reactions' },
  { id: 'is_this_pigeon', name: 'Is This a Pigeon?', url: 'https://i.imgflip.com/1o00in.jpg', category: 'Classic' },
  { id: 'clown_makeup', name: 'Clown Makeup', url: 'https://i.imgflip.com/38el31.jpg', category: 'Classic' },
  { id: 'car_drift_exit', name: 'Car Drift Exit', url: 'https://i.imgflip.com/16iyn1.jpg', category: 'Classic' },
  { id: 'hide_pain_harold', name: 'Hide the Pain Harold', url: 'https://i.imgflip.com/gk5el.jpg', category: 'Reactions' },
  { id: 'monkey_puppet', name: 'Monkey Puppet', url: 'https://i.imgflip.com/2gnnjh.jpg', category: 'Reactions' },
  { id: 'i_bet_he_thinking', name: 'I Bet He Thinking', url: 'https://i.imgflip.com/1tl71a.jpg', category: 'Classic' },
  { id: 'spider_man_pointing', name: 'Spider-Man Pointing', url: 'https://i.imgflip.com/1tkjq9.jpg', category: 'Classic' },
  { id: 'batman_slapping', name: 'Batman Slapping Robin', url: 'https://i.imgflip.com/9ehk.jpg', category: 'Classic' },
  { id: 'tuxedo_winnie', name: 'Tuxedo Winnie Pooh', url: 'https://i.imgflip.com/2ybua0.png', category: 'Classic' },
  { id: 'boardroom_meeting', name: 'Boardroom Meeting', url: 'https://i.imgflip.com/m78d.jpg', category: 'Classic' },
  { id: 'gigachad', name: 'Gigachad', url: 'https://i.imgflip.com/58eyvu.png', category: 'Reactions' },
  { id: 'chad_vs_virgin', name: 'Yes Chad vs Virgin', url: 'https://i.imgflip.com/46e5a4.png', category: 'Classic' },
  { id: 'they_same_picture', name: 'Same Picture (Pam)', url: 'https://i.imgflip.com/2za3u1.jpg', category: 'Classic' },
  { id: 'mocking_spongebob', name: 'Mocking Spongebob', url: 'https://i.imgflip.com/1otk96.jpg', category: 'Reactions' },
  { id: 'leo_dicaprio_cheers', name: 'Leo DiCaprio Cheers', url: 'https://i.imgflip.com/4acd7j.png', category: 'Reactions' },
  { id: 'success_kid', name: 'Success Kid', url: 'https://i.imgflip.com/1bhk.jpg', category: 'Classic' },
  { id: 'grumpy_cat', name: 'Grumpy Cat', url: 'https://i.imgflip.com/8p0a.jpg', category: 'Animals' },
  { id: 'y_u_no', name: 'Y U NO', url: 'https://i.imgflip.com/1bh3.jpg', category: 'Classic' },
  { id: 'one_does_not_simply', name: 'One Does Not Simply', url: 'https://i.imgflip.com/1bij.jpg', category: 'Classic' },
  { id: 'ancient_aliens', name: 'Ancient Aliens Guy', url: 'https://i.imgflip.com/26am.jpg', category: 'Reactions' },
  { id: 'futurama_fry', name: 'Futurama Fry', url: 'https://i.imgflip.com/1bgw.jpg', category: 'Reactions' },
  { id: 'first_world_problems', name: 'First World Problems', url: 'https://i.imgflip.com/1bhf.jpg', category: 'Classic' },
  { id: 'bad_luck_brian', name: 'Bad Luck Brian', url: 'https://i.imgflip.com/1bip.jpg', category: 'Classic' },
  { id: 'squidward_window', name: 'Squidward Window', url: 'https://i.imgflip.com/145qvv.jpg', category: 'Reactions' },
  { id: 'hard_to_swallow', name: 'Hard to Swallow Pills', url: 'https://i.imgflip.com/271ps6.jpg', category: 'Classic' },
  { id: 'whisper_goosebumps', name: 'Whisper Goosebumps', url: 'https://i.imgflip.com/1jgr70.jpg', category: 'Classic' },
  { id: 'who_killed_hannibal', name: 'Who Killed Hannibal', url: 'https://i.imgflip.com/28s2gu.jpg', category: 'Classic' },
  { id: 'overly_attached_gf', name: 'Overly Attached GF', url: 'https://i.imgflip.com/1b71.jpg', category: 'Classic' },
  { id: 'philosoraptor', name: 'Philosoraptor', url: 'https://i.imgflip.com/1bgs.jpg', category: 'Animals' },
];

// Combine all real meme image templates with zero duplicates
const seenUrls = new Set<string>();
const combinedCatalog: MemeTemplate[] = [];

for (const item of [...localTemplates, ...curatedMemes, ...(rawMemeTemplates as MemeTemplate[])]) {
  if (item && item.url && !seenUrls.has(item.url)) {
    seenUrls.add(item.url);
    combinedCatalog.push(item);
  }
}

export const allImageTemplates: MemeTemplate[] = combinedCatalog;

// Fetch meme templates from Reddit communities for "Load More"
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
            category: 'Community',
          };
        });
    }
  } catch (e) {
    console.warn('Reddit fetch failed', e);
  }
  return [];
}

export function getFallbackSvgUrl(title = 'Meme Canvas'): string {
  const cleanTitle = (title || 'Meme Canvas').replace(/[<>&"]/g, '').slice(0, 30);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="600" height="600" fill="#18181b"/><rect x="20" y="20" width="560" height="560" rx="16" fill="#27272a" stroke="#87a665" stroke-width="3"/><text x="300" y="280" font-family="sans-serif" font-size="28" font-weight="700" fill="#87a665" text-anchor="middle">MEME CANVAS</text><text x="300" y="325" font-family="sans-serif" font-size="18" fill="#a1a1aa" text-anchor="middle">${cleanTitle}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export async function fetchAllTemplates(): Promise<MemeTemplate[]> {
  return allImageTemplates;
}
