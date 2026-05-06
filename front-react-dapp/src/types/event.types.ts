
export interface EventFormData {
    eventName: string;
    eventDate: string;
    contributionDeadline: string;
}

export interface EventAdminSheetProps {
    isOpen: boolean;
    eventTitle: string;
    participantCount: number;
    formData: EventFormData;
    isCancelConfirming: boolean;
    onChange: (field: keyof EventFormData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClose: () => void;
    onSave: () => void;
    onCancelClick: () => void;
    onKeepEvent: () => void;
    onConfirmCancel: () => void;
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
    value: number;
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
    isAdmin?: boolean;
    onSettingsClick?: () => void;
    onClick?: () => void;
}
export interface EventResponse {
    id: number;
    name: string;
    date: string;
    deadline: string;
    participants_amount: number;
    is_admin: boolean;
}

export interface GiftSuggestion {
    id: number;
    title: string;
    price: string;
    description: string;
    imageUrl: string;
    imageAlt: string;
    supporterBadges: Array<{
        label: string;
        className: string;
        textClassName?: string;
    }>;
    likes: number;
    liked?: boolean;
}

export interface Gift {
    id: number;
    name: string;
    link: string;
    status: string;
    contract_address: string;
    admin_id: number
    target_amount: number;
    collected: number;
    recipient_id: number;
    likes_amount: number;
    description: string;
    image_url: string;
}

export interface RecipientGiftFolder {
    id: string;
    recipientName: string;
    subtitle: string;
    suggestions: GiftSuggestion[];
}

export interface RecipientResponse {
    id: number;
    first_name: string;
    last_name: string;
}
