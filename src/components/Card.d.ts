import React from 'react';
type CardProps = {
    title?: string;
    subtitle?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
};
export declare function Card({ title, subtitle, action, children, className }: CardProps): import("react/jsx-runtime").JSX.Element;
export {};
