import { mockMetrics, mockPlayers, mockPlaytimeDaily, mockProfileMe, mockProfiles, mockScores, mockServerStatus } from '../data/mock';
import { Metric, PlaytimeDaily, PlaytimeSeries, MetricHistorySeries, Player, PlayerScore, Profile, ServerStatus } from './types';

export type LeaderboardRow = {
  player: Player;
  value: number;
  collectedAt: string;
  metric: Metric;
};

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

function buildRangeSamples(samples: { date: string; minutes: number }[], days: number) {
  if (!samples || samples.length === 0) return [];
  const last = new Date(samples[samples.length - 1].date);
  const result: { date: string; minutes: number }[] = [];
  for (let i = 0; i < days; i += 1) {
    const date = new Date(last);
    date.setDate(last.getDate() - (days - 1 - i));
    const base = samples[i % samples.length];
    result.push({ date: date.toISOString().slice(0, 10), minutes: base.minutes });
  }
  return result;
}

function buildHistorySeries(baseValue: number, days: number, varianceSeed: number) {
  const last = new Date();
  const samples: { date: string; value: number }[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(last);
    date.setDate(last.getDate() - i);
    const wiggle = Math.round(((Math.sin((i + varianceSeed) / 5) + 1) / 2) * 0.2 * baseValue);
    const trend = Math.round((days - i) * (varianceSeed % 5));
    const value = Math.max(0, baseValue - wiggle + trend);
    samples.push({ date: date.toISOString().slice(0, 10), value });
  }
  return samples;
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
    const samples = buildRangeSamples(item.samples, days);
    return delay({ ...item, rangeDays: days, samples });
  }
  return fetchJson(`/players/${playerId}/playtime/daily?days=${days}`);
}

export async function getPlaytimeDailyAll(days = 14): Promise<PlaytimeSeries[]> {
  if (USE_MOCK) {
    const series = mockPlaytimeDaily
      .map((entry) => {
        const player = mockPlayers.find((p) => p.id === entry.playerId);
        if (!player) return null;
        return {
          player,
          samples: buildRangeSamples(entry.samples, days),
        };
      })
      .filter((v): v is PlaytimeSeries => Boolean(v));
    return delay(series);
  }
  return fetchJson(`/playtime/daily?days=${days}`);
}

export async function getMetricHistory(metricId: number, days = 30): Promise<MetricHistorySeries[]> {
  if (!USE_MOCK) {
    return fetchJson(`/metrics/${metricId}/history?days=${days}`);
  }

  const rows = mockScores.filter((s) => s.metricId === metricId);
  return delay(
    rows
      .map((score, idx) => {
        const player = mockPlayers.find((p) => p.id === score.playerId);
        if (!player) return null;
        const samples = buildHistorySeries(score.value, days, idx + score.playerId + metricId);
        return { player, samples };
      })
      .filter((v): v is MetricHistorySeries => Boolean(v)),
  );
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

export async function getLeaderboard(metricId: number): Promise<LeaderboardRow[]> {
  if (!USE_MOCK) {
    return fetchJson(`/metrics/${metricId}/leaderboard`);
  }

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
