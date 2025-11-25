type Sample = {
    date: string;
    value: number;
};
export type Series = {
    name: string;
    samples: Sample[];
};
type Props = {
    series: Series[];
    height?: number;
    loading?: boolean;
    unit?: string;
};
export declare function MultiSeriesBarChart({ series, height, loading, unit }: Props): import("react/jsx-runtime").JSX.Element;
export {};
