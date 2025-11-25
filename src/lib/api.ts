import { mockMetrics, mockPlayers, mockPlaytimeDaily, mockProfileMe, mockProfiles, mockScores, mockServerStatus } from '../data/mock';
import { Metric, PlaytimeDaily, Player, PlayerScore, Profile, ServerStatus } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') !== 'false';

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

function delay<T>(value: T, ms = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getServerStatus(): Promise<ServerStatus> {
  if (USE_MOCK) return delay(mockServerStatus);
  return fetchJson('/server/status');
}

export async function getPlayers(): Promise<Player[]> {
  if (USE_MOCK) return delay(mockPlayers);
  return fetchJson('/players');
}

export async function getPlayer(id: number): Promise<Player | undefined> {
  if (USE_MOCK) return delay(mockPlayers.find((p) => p.id === id));
  return fetchJson(`/players/${id}`);
}

export async function getPlayerScores(playerId: number): Promise<PlayerScore[]> {
  if (USE_MOCK) return delay(mockScores.filter((s) => s.playerId === playerId));
  return fetchJson(`/players/${playerId}/scores`);
}

export async function getPlayerPlaytimeDaily(playerId: number, days = 14): Promise<PlaytimeDaily | null> {
  if (USE_MOCK) {
    const item = mockPlaytimeDaily.find((p) => p.playerId === playerId);
    if (!item) return delay(null);
    return delay({ ...item, rangeDays: days, samples: item.samples.slice(-days) });
  }
  return fetchJson(`/players/${playerId}/playtime/daily?days=${days}`);
}

export async function getMetrics(): Promise<Metric[]> {
  if (USE_MOCK) return delay(mockMetrics);
  return fetchJson('/metrics');
}

export async function getProfileMe(): Promise<Profile> {
  if (USE_MOCK) return delay(mockProfileMe);
  return fetchJson('/profile/me');
}

export async function getUserProfile(id: number): Promise<Profile | undefined> {
  if (USE_MOCK) return delay(mockProfiles.find((p) => p.id === id));
  return fetchJson(`/users/${id}/profile`);
}

export async function getLeaderboard(metricId: number) {
  if (!USE_MOCK) return [];

  const metric = mockMetrics.find((m) => m.id === metricId);
  if (!metric) return [];

  return delay(
    mockScores
      .filter((s) => s.metricId === metricId)
      .sort((a, b) => b.value - a.value)
      .map((score) => ({
        player: mockPlayers.find((p) => p.id === score.playerId)!,
        value: score.value,
        collectedAt: score.collectedAt,
        metric,
      })),
    80,
  );
}
