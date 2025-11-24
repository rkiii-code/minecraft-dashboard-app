import { Metric, Player, PlayerScore, Profile, ServerStatus } from '../lib/types';

export const mockServerStatus: ServerStatus = {
  online: true,
  playersOnline: 3,
  maxPlayers: 10,
  motd: 'The World of Vanilla Server',
  version: '1.21.1',
  lastCheckedAt: '2025-11-24T09:00:00+09:00',
};

export const mockPlayers: Player[] = [
  {
    id: 1,
    name: 'sun5un',
    uuid: '1ecba7f1-aaaa-4d2c-a7d3-001',
    online: true,
    lastSeenAt: '2025-11-24T08:58:00+09:00',
    firstSeenAt: '2025-09-02T10:00:00+09:00',
  },
  {
    id: 2,
    name: 'umi_bird',
    uuid: '1ecba7f1-bbbb-4d2c-a7d3-002',
    online: true,
    lastSeenAt: '2025-11-24T08:55:00+09:00',
    firstSeenAt: '2025-09-10T12:00:00+09:00',
    avatarUrl: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'forest_cat',
    uuid: '1ecba7f1-cccc-4d2c-a7d3-003',
    online: false,
    lastSeenAt: '2025-11-24T00:15:00+09:00',
    firstSeenAt: '2025-09-17T22:00:00+09:00',
  },
  {
    id: 4,
    name: 'hako',
    uuid: '1ecba7f1-dddd-4d2c-a7d3-004',
    online: true,
    lastSeenAt: '2025-11-24T08:52:00+09:00',
    firstSeenAt: '2025-11-01T21:00:00+09:00',
  },
];

export const mockMetrics: Metric[] = [
  {
    id: 1,
    objectiveName: 'play_time',
    displayName: 'Play Time',
    description: '累計プレイ時間 (分換算)',
    unit: 'min',
    isEnabled: true,
    updatedAt: '2025-11-23T20:00:00+09:00',
  },
  {
    id: 2,
    objectiveName: 'death_count',
    displayName: 'Death Count',
    description: '累計デス数',
    unit: 'times',
    isEnabled: true,
    updatedAt: '2025-11-22T12:00:00+09:00',
  },
  {
    id: 3,
    objectiveName: 'mob_kill',
    displayName: 'Mob キル数',
    description: 'モブ撃破数',
    unit: 'kills',
    isEnabled: true,
    updatedAt: '2025-11-23T10:30:00+09:00',
  },
  {
    id: 4,
    objectiveName: 'build_blocks',
    displayName: 'ブロック配置',
    description: '配置したブロック数',
    unit: 'blocks',
    isEnabled: false,
    updatedAt: '2025-11-20T16:00:00+09:00',
  },
];

export const mockScores: PlayerScore[] = [
  { playerId: 1, metricId: 1, value: 1240, collectedAt: '2025-11-24T08:50:00+09:00' },
  { playerId: 2, metricId: 1, value: 980, collectedAt: '2025-11-24T08:50:00+09:00' },
  { playerId: 3, metricId: 1, value: 760, collectedAt: '2025-11-24T08:50:00+09:00' },
  { playerId: 4, metricId: 1, value: 320, collectedAt: '2025-11-24T08:50:00+09:00' },
  { playerId: 1, metricId: 2, value: 14, collectedAt: '2025-11-24T08:50:00+09:00' },
  { playerId: 2, metricId: 2, value: 8, collectedAt: '2025-11-24T08:50:00+09:00' },
  { playerId: 3, metricId: 2, value: 21, collectedAt: '2025-11-24T08:50:00+09:00' },
  { playerId: 4, metricId: 2, value: 6, collectedAt: '2025-11-24T08:50:00+09:00' },
  { playerId: 1, metricId: 3, value: 412, collectedAt: '2025-11-24T08:50:00+09:00' },
  { playerId: 2, metricId: 3, value: 520, collectedAt: '2025-11-24T08:50:00+09:00' },
  { playerId: 3, metricId: 3, value: 210, collectedAt: '2025-11-24T08:50:00+09:00' },
  { playerId: 4, metricId: 3, value: 150, collectedAt: '2025-11-24T08:50:00+09:00' },
  { playerId: 1, metricId: 4, value: 1450, collectedAt: '2025-11-23T19:00:00+09:00' },
  { playerId: 2, metricId: 4, value: 900, collectedAt: '2025-11-23T19:00:00+09:00' },
];

export const mockProfiles: Profile[] = [
  {
    id: 1,
    username: 'sun5un',
    displayName: 'サンゴ',
    bio: 'のんびりバニラ開拓中',
    avatarUrl: '',
    role: 'admin',
  },
  {
    id: 2,
    username: 'umi_bird',
    displayName: 'うみとり',
    bio: '青い空と海が好き',
    avatarUrl: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=200&auto=format&fit=crop',
    role: 'user',
  },
];

export const mockProfileMe: Profile = {
  id: 1,
  username: 'sun5un',
  displayName: 'サンゴ',
  bio: 'のんびりバニラ開拓中',
  role: 'admin',
  avatarUrl: '',
};
