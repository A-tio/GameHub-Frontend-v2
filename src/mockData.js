import ApexPoster from './assets/images/apex.png';
import CounterStrikePoster from './assets/images/counterstrike.png';
import FortnitePoster from './assets/images/fortnite.png';
import GTAPoster from './assets/images/gta.png';
import LeaguePoster from './assets/images/lol.png';
import MinecraftPoster from './assets/images/minecraft.png';
import RobloxPoster from './assets/images/roblox.png';
import ValorantPoster from './assets/images/valorant.png';

const randomId = () => `mock_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
const toTitleCase = (value = '') =>
  value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const buildTag = (value, desc = '') => ({
  value,
  label: value,
  desc,
});

const featuredGameSpecs = [
  { key: 'apex', name: 'Apex Legends', image: ApexPoster, desc: 'Squad up and outplay rivals in high-speed battle royale firefights.', tags: [buildTag('Battle Royale', 'Drop in and survive to the end.'), buildTag('Shooter', 'Fast-paced competitive FPS action.')] },
  { key: 'counterstrike', name: 'Counter-Strike 2', image: CounterStrikePoster, desc: 'Experience tactical, round-based FPS showdowns with precise gunplay.', tags: [buildTag('Shooter', 'Fast-paced competitive FPS action.'), buildTag('Esports', 'Favored by top competitive teams worldwide.')] },
  { key: 'fortnite', name: 'Fortnite', image: FortnitePoster, desc: 'Build, battle, and express yourself across evolving worlds.', tags: [buildTag('Battle Royale', 'Drop in and survive to the end.'), buildTag('Creative', 'Create games, worlds, and experiences.')] },
  { key: 'gta', name: 'GTA Online', image: GTAPoster, desc: 'Create your criminal empire across Los Santos with friends.', tags: [buildTag('Open World', 'Explore vast cities and diverse missions.'), buildTag('Action', 'High-octane heists and street pursuits.')] },
  { key: 'lol', name: 'League of Legends', image: LeaguePoster, desc: 'Master champions, climb the ranks, and own the Rift with your squad.', tags: [buildTag('MOBA', 'Team-based battles across strategic lanes.'), buildTag('Esports', 'Favored by top competitive teams worldwide.')] },
  { key: 'minecraft', name: 'Minecraft', image: MinecraftPoster, desc: 'Craft, explore, and survive in endless blocky worlds.', tags: [buildTag('Sandbox', 'Build anything your imagination sparks.'), buildTag('Survival', 'Gather, craft, and thrive in every biome.')] },
  { key: 'roblox', name: 'Roblox', image: RobloxPoster, desc: 'Play millions of user-created games or design your own adventures.', tags: [buildTag('Creative', 'Create games, worlds, and experiences.'), buildTag('Community', 'Join massive player-made experiences.')] },
  { key: 'valorant', name: 'Valorant', image: ValorantPoster, desc: 'Combine sharp gunplay with agent abilities in tactical 5v5 clashes.', tags: [buildTag('Shooter', 'Fast-paced competitive FPS action.'), buildTag('Esports', 'Favored by top competitive teams worldwide.')] },
];

const buildFeaturedGamesFromAssets = () => {
  const fallbackPoster = 'https://via.placeholder.com/300';

  return featuredGameSpecs.map((spec, index) => ({
    id: `featured-${spec.key}`,
    name: spec.name ?? toTitleCase(spec.key),
    desc: spec.desc ?? `Discover ${spec.name ?? toTitleCase(spec.key)} this week.`,
    tags: spec.tags?.length ? spec.tags : [buildTag('General', 'Open conversation')],
    imageURL: spec.image ?? fallbackPoster,
    order: index,
  }));
};

const initialTags = [
  { id: 'tag-general', name: 'General', desc: 'Open conversation', category: 'General Tags' },
  { id: 'tag-updates', name: 'Updates', desc: 'Latest announcements', category: 'News' },
  { id: 'tag-help', name: 'Help', desc: 'Ask for support', category: 'Community Tags' },
  { id: 'tag-pc', name: 'PC', desc: 'PC related', category: 'Platforms' },
  { id: 'tag-console', name: 'Console', desc: 'Console gaming discussions', category: 'Platforms' },
  { id: 'tag-mobile', name: 'Mobile', desc: 'Mobile game topics', category: 'Platforms' },
  { id: 'tag-feedback', name: 'Feedback', desc: 'Suggestions and feature requests', category: 'Community Tags' },
  { id: 'tag-bug', name: 'Bug Reports', desc: 'Report issues or glitches', category: 'Support' },
  { id: 'tag-events', name: 'Events', desc: 'Tournaments and special events', category: 'News' },
  { id: 'tag-guides', name: 'Guides', desc: 'Tips, walkthroughs, and tutorials', category: 'Resources' },
  { id: 'tag-market', name: 'Marketplace', desc: 'Buy, sell, and trade items', category: 'Community Tags' },
  { id: 'tag-offtopic', name: 'Off-topic', desc: 'Non-gaming discussions', category: 'General Tags' },
  { id: 'tag-art', name: 'Fan Art', desc: 'Share your creative works', category: 'Community Tags' },
  { id: 'tag-memes', name: 'Memes', desc: 'Funny moments and community jokes', category: 'General Tags' },
];

const initialFeaturedGames = buildFeaturedGamesFromAssets();

const toTimestamp = (date) => ({
  seconds: Math.floor(date.getTime() / 1000),
  nanoseconds: date.getMilliseconds() * 1e6,
  toDate: () => date,
});

const initialUsers = [
  {
    id: 'user-alex',
    username: 'Alex Rivers',
    handle: 'alexr',
    email: 'alex@example.com',
    profilePic: "../assets/Emote Pack/Compilation/Frame 2.svg",
    role: 'admin',
    tags: ['General', 'Updates', 'PC'],
    preferredTags: ['General', 'Updates', 'PC'],
    dateJoined: toTimestamp(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)),
    suspension: null,
    banned: false,
  },
  {
    id: 'user-bella',
    username: 'Bella Star',
    handle: 'bellastar',
    email: 'bella@example.com',
    profilePic: "../assets/Emote Pack/Compilation/Frame 4.svg",
    role: 'member',
    tags: ['Community', 'Help'],
    preferredTags: ['Community', 'Help'],
    dateJoined: toTimestamp(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
    suspension: null,
    banned: false,
  },
  {
    id: 'user-cade',
    username: 'Cade Sparks',
    handle: 'cadesparks',
    email: 'cade@example.com',
    profilePic: "../assets/Emote Pack/Compilation/Frame 6.svg",
    role: 'member',
    tags: ['Updates', 'PC'],
    preferredTags: ['Updates', 'PC'],
    dateJoined: toTimestamp(new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)),
    suspension: null,
    banned: false,
  },
];

const initialPosts = [
  {
    id: 'post-001',
    title: 'Welcome to GameHub!',
    body: 'Kick things off in our community thread. Share what you are playing this week and any goals you have set.',
    tags: ['General', 'Community'],
    game: {
      id: 'mock-quest',
      label: 'Mock Quest',
      value: 'mock-quest',
      imageURL: 'https://via.placeholder.com/300',
    },
    hasAttachments: false,
    postDate: toTimestamp(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
    posterId: 'user-alex',
    comments: 4,
  },
  {
    id: 'post-002',
    title: 'Patch 1.2 Balance Notes',
    body: 'A quick summary of the biggest buffs and nerfs in Patch 1.2. Let me know how your mains were affected!',
    tags: ['Updates', 'PC'],
    game: {
      id: 'sample-saga',
      label: 'Sample Saga',
      value: 'sample-saga',
      imageURL: 'https://via.placeholder.com/300',
    },
    hasAttachments: false,
    postDate: toTimestamp(new Date(Date.now() - 18 * 60 * 60 * 1000)),
    posterId: 'user-bella',
    comments: 2,
  },
  {
    id: 'post-003',
    title: 'Speedrun Tips & Tricks',
    body: 'Share your favorite routing tools, leaderboard resources, and controller settings that save seconds.',
    tags: ['Community', 'PC'],
    game: {
      id: 'mock-quest',
      label: 'Mock Quest',
      value: 'mock-quest',
      imageURL: 'https://via.placeholder.com/300',
    },
    hasAttachments: false,
    postDate: toTimestamp(new Date(Date.now() - 6 * 60 * 60 * 1000)),
    posterId: 'user-cade',
    comments: 5,
  },
  {
    id: 'post-004',
    title: 'Looking for Co-op Partners',
    body: 'Weekend raid team forming. Need two support-focused players who can commit to Saturday evenings.',
    tags: ['Community', 'Help'],
    game: {
      id: 'sample-saga',
      label: 'Sample Saga',
      value: 'sample-saga',
      imageURL: 'https://via.placeholder.com/300',
    },
    hasAttachments: false,
    postDate: toTimestamp(new Date(Date.now() - 3 * 60 * 60 * 1000)),
    posterId: 'user-alex',
    comments: 3,
  },
];

const initialCommentsPost001 = [
  {
    id: 'comment-001',
    authorId: 'user-bella',
    body: 'Looking forward to meeting more folks here!',
    createDate: toTimestamp(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
  },
  {
    id: 'comment-002',
    authorId: 'user-cade',
    body: 'Started a retro backlog challenge this month. Anyone else in?',
    createDate: toTimestamp(new Date(Date.now() - 36 * 60 * 60 * 1000)),
  },
];

const initialCommentsPost002 = [
  {
    id: 'comment-003',
    authorId: 'user-alex',
    body: 'Ranged classes finally feel fair again.',
    createDate: toTimestamp(new Date(Date.now() - 12 * 60 * 60 * 1000)),
  },
];

const initialCommentsPost003 = [
  {
    id: 'comment-004',
    authorId: 'user-alex',
    body: 'Timer splitting on split.io helped me clean up sloppy checkpoints.',
    createDate: toTimestamp(new Date(Date.now() - 4 * 60 * 60 * 1000)),
  },
  {
    id: 'comment-005',
    authorId: 'user-bella',
    body: 'Practice the third boss skip with input display on. It exposes missed frames faster.',
    createDate: toTimestamp(new Date(Date.now() - 2 * 60 * 60 * 1000)),
  },
];

const initialCommentsPost004 = [
  {
    id: 'comment-006',
    authorId: 'user-cade',
    body: 'Count me in—support main here with 200+ clears.',
    createDate: toTimestamp(new Date(Date.now() - 150 * 60 * 1000)),
  },
];

const initialReactions = {
  'posts/post-001/reactions': [
    {
      id: 'reaction-001',
      userID: 'user-bella',
      reactType: 1,
      createDate: toTimestamp(new Date(Date.now() - 60 * 60 * 1000)),
    },
    {
      id: 'reaction-002',
      userID: 'user-cade',
      reactType: 1,
      createDate: toTimestamp(new Date(Date.now() - 30 * 60 * 1000)),
    },
  ],
  'posts/post-002/reactions': [
    {
      id: 'reaction-003',
      userID: 'user-alex',
      reactType: 1,
      createDate: toTimestamp(new Date(Date.now() - 20 * 60 * 1000)),
    },
  ],
  'posts/post-003/reactions': [
    {
      id: 'reaction-004',
      userID: 'user-alex',
      reactType: 1,
      createDate: toTimestamp(new Date(Date.now() - 40 * 60 * 1000)),
    },
    {
      id: 'reaction-005',
      userID: 'user-bella',
      reactType: 1,
      createDate: toTimestamp(new Date(Date.now() - 25 * 60 * 1000)),
    },
    {
      id: 'reaction-006',
      userID: 'user-cade',
      reactType: 1,
      createDate: toTimestamp(new Date(Date.now() - 10 * 60 * 1000)),
    },
  ],
  'posts/post-004/reactions': [
    {
      id: 'reaction-007',
      userID: 'user-bella',
      reactType: 1,
      createDate: toTimestamp(new Date(Date.now() - 35 * 60 * 1000)),
    },
  ],
};

const initialLogs = [
  { id: randomId(), date: new Date(Date.now() - 4 * 60 * 60 * 1000), message: 'System bootstrapped with sample data.' },
  { id: randomId(), date: new Date(Date.now() - 90 * 60 * 1000), message: 'User @alexr created the welcome thread.' },
  { id: randomId(), date: new Date(Date.now() - 45 * 60 * 1000), message: 'User @bellastar published Patch 1.2 notes.' },
  { id: randomId(), date: new Date(Date.now() - 22 * 60 * 1000), message: 'User @cadesparks opened “Speedrun Tips & Tricks”.' },
  { id: randomId(), date: new Date(Date.now() - 15 * 60 * 1000), message: 'User @alexr started a new co-op recruitment thread.' },
];

const collectionStore = new Map([
  ['tags', [...initialTags]],
  ['featuredGames', [...initialFeaturedGames]],
  ['posts', [...initialPosts]],
  ['users', [...initialUsers]],
  ['gamer-hub-logs', [...initialLogs]],
  ['posts/post-001/comments', [...initialCommentsPost001]],
  ['posts/post-002/comments', [...initialCommentsPost002]],
  ['posts/post-003/comments', [...initialCommentsPost003]],
  ['posts/post-004/comments', [...initialCommentsPost004]],
  ['posts/post-001/comments/comment-001/replies', []],
  ['posts/post-001/comments/comment-002/replies', []],
  ['posts/post-002/comments/comment-003/replies', []],
  ['posts/post-003/comments/comment-004/replies', []],
  ['posts/post-003/comments/comment-005/replies', []],
  ['posts/post-004/comments/comment-006/replies', []],
  ...Object.entries(initialReactions).map(([key, value]) => [key, [...value]]),
]);

const collectionListeners = new Map();

const cloneEntry = (entry) => ({ ...entry });
const cloneCollection = (collectionName) => ensureCollection(collectionName).map(cloneEntry);

export const ensureCollection = (collectionName) => {
  if (!collectionStore.has(collectionName)) {
    collectionStore.set(collectionName, []);
  }
  return collectionStore.get(collectionName);
};

export const generateMockId = () => randomId();

export const notifyCollectionListeners = (collectionName) => {
  const listeners = collectionListeners.get(collectionName);
  if (!listeners || listeners.size === 0) return;
  const snapshot = cloneCollection(collectionName);
  listeners.forEach((listener) => listener(snapshot));
};

export const subscribeToCollection = (collectionName, callback) => {
  const listeners = collectionListeners.get(collectionName) ?? new Set();
  listeners.add(callback);
  collectionListeners.set(collectionName, listeners);
  callback(cloneCollection(collectionName));
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0) {
      collectionListeners.delete(collectionName);
    }
  };
};

const mockLogs = ensureCollection('gamer-hub-logs');

export const addMockLog = (message) => {
  const entry = { id: randomId(), date: new Date(), message };
  mockLogs.push(entry);
  notifyCollectionListeners('gamer-hub-logs');
  console.info('[MockLog]', entry);
};

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL ?? '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
};

export const mockTags = cloneCollection('tags');
export const mockFeaturedGames = cloneCollection('featuredGames');
export const mockPosts = cloneCollection('posts');
export const mockUsers = cloneCollection('users');