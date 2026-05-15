import type { EventFormData } from './form.types.ts';

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
