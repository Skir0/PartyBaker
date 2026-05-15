import type { ReactNode } from 'react';

export interface MaterialIconProps {
    icon: string;
    fill?: boolean;
    className?: string;
    size?: string;
    onClick?: () => void;
}

export interface TopAppBarProps {
    title: string;
    onBack: () => void;
    endSlot?: ReactNode;
}

export interface BottomButtonProps {
    text: string;
    icon?: string;
    onClick: () => void;
    disabled?: boolean;
}

export interface StepHeaderCardProps {
    step: string;
    title: string;
    description: string;
}

export interface SummaryStatCardProps {
    icon: string;
    iconClassName: string;
    label: string;
    value: number;
}
