import type { ChangeGiftFormProps } from './gift-ui.types.ts';
import type { EventFormProps } from './event-ui.types.ts';

export enum SheetType {
    GIFT = "Gift",
    EVENT = "Event"
}

type AdminSheetBaseProps = {
    isOpen: boolean;
    participantCount?: number;
    isCancelConfirming: boolean;
    onClose: () => void;
    onSave: () => void;
    onCancelClick: () => void;
    onKeepEvent: () => void;
    onConfirmCancel: () => void;
};

type GiftAdminSheetVariant = AdminSheetBaseProps & ChangeGiftFormProps & {
    type: SheetType.GIFT;
};

type EventAdminSheetVariant = AdminSheetBaseProps & EventFormProps & {
    type: SheetType.EVENT;
};

export type AdminSheetProps = GiftAdminSheetVariant | EventAdminSheetVariant;
