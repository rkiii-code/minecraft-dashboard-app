import type { PlaytimeSample } from '../lib/types';
type Props = {
    samples: PlaytimeSample[];
    height?: number;
    loading?: boolean;
};
export declare function PlaytimeChart({ samples, height, loading }: Props): import("react/jsx-runtime").JSX.Element;
export {};
