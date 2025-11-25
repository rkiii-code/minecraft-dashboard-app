import { type DependencyList } from 'react';
export declare function useAsync<T>(loader: () => Promise<T>, deps?: DependencyList): {
    data: T;
    loading: boolean;
    error: Error;
    refetch: () => Promise<void>;
};
