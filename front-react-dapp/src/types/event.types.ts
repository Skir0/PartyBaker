import type { ReactNode } from 'react';

export interface SuggestGiftFormData {
    giftName: string;
    storeWebsite: string;
    priceTon: number;
    description: string;
}

export interface SuggestGiftFormProps {
    formData: SuggestGiftFormData;
    onChange: (
        field: keyof SuggestGiftFormData
    ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export interface EventFormData {
    eventName: string;
    eventDate: string;
    contributionDeadline: string;
}

export interface GiftFormData {
    name: string;
    description: string;
    price: string;
    url: string;
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

export interface ChangeGiftFormProps {
    formData: GiftFormData;
    onChange: (field: keyof GiftFormData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ChangeEventFormProps {
    formData: EventFormData;
    onChange: (field: keyof EventFormData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export enum AdminSheetType {
    GIFT = "gift",
    EVENT = "event"
}

type AdminSheetBaseProps = {
    isOpen: boolean;
    title: string;
    participantCount?: number;
    isCancelConfirming: boolean;
    onClose: () => void;
    onSave: () => void;
    onCancelClick: () => void;
    onKeepEvent: () => void;
    onConfirmCancel: () => void;
};

type GiftAdminSheetVariant = AdminSheetBaseProps & ChangeGiftFormProps & {
    type: AdminSheetType.GIFT;
};

type EventAdminSheetVariant = AdminSheetBaseProps & ChangeEventFormProps & {
    type: AdminSheetType.EVENT;
};

export type AdminSheetProps = GiftAdminSheetVariant | EventAdminSheetVariant;


export interface MaterialIconProps {
    icon: string;
    fill?: boolean;
    className?: string;
    size?: string;
    onClick?: () => void;
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
    /** When set, replaces the default wallet connect control in the app bar. */
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

export interface ItemNameFieldProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    item: string;
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
    liked: boolean | false;
}

export interface GiftInfoResponse {
    id: number;
    name: string;
    link: string;
    status: string;
    contract_address: string;
    admin_id: number
    target_amount: number;
    collected: number;
    recipient_id: number;
    description: string;
    image_url: string;
    likes_amount: number;
    liked_by_user: boolean;
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
