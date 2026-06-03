import { MaterialIcon } from './MaterialIcon.tsx';
import { ChangeGiftForm } from '../forms/ChangeGiftForm.tsx';
import { Action, ConfirmActionButton } from './ConfirmActionButton.tsx';
import type { ChangeGiftFormProps } from '../../types/gift-ui.types.ts';
import { type AdminSheetBaseProps, SheetType } from './AdminSheet.tsx';



type GiftAdminSheetVariant = AdminSheetBaseProps & ChangeGiftFormProps & {

};




export function GiftAdminSheet({
                               isOpen,
                               formData,
                               isCancelConfirming,
                               onChange,
                               onClose,
                               onSave,
                               onCancelClick,
                               onKeepEvent,
                               onConfirmCancel,

                           }: GiftAdminSheetVariant) {

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-[60] flex items-end justify-center bg-on-background/20 backdrop-blur-sm md:items-center md:p-4"
            onClick={() => {
                onClose()

            }}
        >
            <div
                className="w-full max-w-2xl rounded-t-xl bg-surface shadow-2xl ring-1 ring-outline-variant/10 md:rounded-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-center pt-3 pb-1">
                    <div className="h-1 w-10 rounded-full bg-outline-variant/30" />
                </div>

                <div className="flex items-center justify-between px-5 py-3">
                    <div>
                        <h2 className="text-lg font-bold text-on-surface">Admin Controls</h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-outline transition-colors active:scale-90 hover:bg-surface-container-high"
                    >
                        <MaterialIcon icon="close" />
                    </button>
                </div>

                <div className="space-y-5 px-5 py-4">
                    <div className="rounded-xl bg-surface-container-low p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold text-on-surface">{SheetType.GIFT} Access</p>
                                <p className="text-xs text-on-surface-variant">You can edit or cancel this {SheetType.GIFT}.</p>
                            </div>
                        </div>
                    </div>

                        <ChangeGiftForm
                            formData={formData}
                            onChange={onChange}
                        />

                    <ConfirmActionButton
                        type={SheetType.GIFT}
                        actionName={Action.CANCEL}
                        isActionConfirming={isCancelConfirming}
                        onActionClick={onCancelClick}
                        onKeepAction={onKeepEvent}
                        onConfirmAction={onConfirmCancel}/>

                    <div className="pb-8 pt-2">
                        <button
                            type="button"
                            onClick={onSave}
                            className="w-full rounded-xl bg-primary py-4 text-lg font-bold text-on-primary shadow-lg shadow-primary/20 transition-all active:scale-95"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
