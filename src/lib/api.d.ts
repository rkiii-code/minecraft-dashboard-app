import { Metric, PlaytimeDaily, PlaytimeSeries, MetricHistorySeries, Player, PlayerScore, Profile, ServerStatus } from './types';
export type LeaderboardRow = {
    player: Player;
    value: number;
    collectedAt: string;
    metric: Metric;
};
export declare function getServerStatus(): Promise<ServerStatus>;
export declare function getPlayers(): Promise<Player[]>;
export declare function getPlayer(id: number): Promise<Player | undefined>;
export declare function getPlayerScores(playerId: number): Promise<PlayerScore[]>;
export declare function getPlayerPlaytimeDaily(playerId: number, days?: number): Promise<PlaytimeDaily | null>;
export declare function getPlaytimeDailyAll(days?: number): Promise<PlaytimeSeries[]>;
export declare function getMetricHistory(metricId: number, days?: number): Promise<MetricHistorySeries[]>;
export declare function getMetrics(): Promise<Metric[]>;
export declare function getProfileMe(): Promise<Profile>;
export declare function getUserProfile(id: number): Promise<Profile | undefined>;
export declare function getLeaderboard(metricId: number): Promise<LeaderboardRow[]>;
