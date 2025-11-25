export type ServerStatus = {
    online: boolean;
    playersOnline: number;
    maxPlayers: number;
    motd: string;
    version: string;
    lastCheckedAt: string;
};
export type Player = {
    id: number;
    name: string;
    uuid: string;
    online: boolean;
    lastSeenAt: string;
    firstSeenAt?: string;
    avatarUrl?: string;
};
export type Metric = {
    id: number;
    objectiveName: string;
    displayName: string;
    description?: string;
    unit: string;
    isEnabled: boolean;
    updatedAt?: string;
};
export type PlayerScore = {
    playerId: number;
    metricId: number;
    value: number;
    collectedAt: string;
};
export type Profile = {
    id: number;
    username: string;
    displayName: string;
    bio?: string;
    avatarUrl?: string;
    role: 'user' | 'admin';
};
export type PlaytimeSample = {
    date: string;
    minutes: number;
};
export type PlaytimeDaily = {
    playerId: number;
    rangeDays: number;
    samples: PlaytimeSample[];
};
export type PlaytimeSeries = {
    player: Player;
    samples: PlaytimeSample[];
};
export type MetricHistorySample = {
    date: string;
    value: number;
};
export type MetricHistorySeries = {
    player: Player;
    samples: MetricHistorySample[];
};
