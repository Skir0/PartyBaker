
export interface EventFormData {
    eventName: string;
    eventDate: string;
    contributionDeadline: string;
}

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

export interface EventNameFieldProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}

export interface DateFieldsProps {
    eventDate: string;
    deadline: string;
    onEventDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDeadlineChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface EventFormProps {
    formData: EventFormData;
    onChange: (field: keyof EventFormData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface SummaryStatCardProps {
    icon: string;
    iconClassName: string;
    label: string;
    value: string;
}

export interface EventOverviewCardProps {
    title: string;
    participants: string;
    imageUrl: string;
    imageAlt: string;
    status: string;
    statusClassName: string;
    eventDate: string;
    deadline: string;
    deadlineClassName?: string;
}
