import type { MetricHistorySeries } from '../lib/types';
type Props = {
    series: MetricHistorySeries[];
    height?: number;
    loading?: boolean;
    unit?: string;
};
export declare function MultiMetricHistoryChart({ series, height, loading, unit }: Props): import("react/jsx-runtime").JSX.Element;
export {};
