import type { PlaytimeSeries } from '../lib/types';
type Props = {
    series: PlaytimeSeries[];
    height?: number;
    loading?: boolean;
};
export declare function MultiPlaytimeChart({ series, height, loading }: Props): import("react/jsx-runtime").JSX.Element;
export {};
