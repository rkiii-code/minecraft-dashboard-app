import React from 'react';
type AvatarProps = {
    name: string;
    url?: string;
    size?: number;
    badge?: React.ReactNode;
    bordered?: boolean;
};
export declare function Avatar({ name, url, size, badge, bordered }: AvatarProps): import("react/jsx-runtime").JSX.Element;
export {};
