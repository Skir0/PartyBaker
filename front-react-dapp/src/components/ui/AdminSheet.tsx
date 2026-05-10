import { MaterialIcon } from './MaterialIcon.tsx';
import {
    type AdminSheetProps,
} from '../../types/event.types.ts';
import { ChangeGiftForm } from '../forms/ChangeGiftForm.tsx';
import { ChangeEventForm } from '../forms/ChangeEventForm.tsx';

export function AdminSheet({
                                    isOpen,
                                    title,
                                    type,
                                    formData,
                                    isCancelConfirming,
                                    onChange,
                                    onClose,
                                    onSave,
                                    onCancelClick,
                                    onKeepEvent,
                                    onConfirmCancel
                                }: AdminSheetProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-[60] flex items-end justify-center bg-on-background/20 backdrop-blur-sm md:items-center md:p-4"
            onClick={onClose}
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
                        <p className="text-sm text-on-surface-variant">{title}</p>
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
                                <p className="text-sm font-semibold text-on-surface">{type.valueOf().toUpperCase()} Access</p>
                                <p className="text-xs text-on-surface-variant">You can edit or cancel this {type.valueOf()}.</p>
                            </div>
                        </div>
                    </div>

                    {type === "gift" && (
                        <ChangeGiftForm
                            formData={formData}
                            onChange={onChange}
                        />
                    )}
                    {type === "event" && (
                        <ChangeEventForm
                            formData={formData}
                            onChange={onChange}
                        />
                    )}

                    <div className="rounded-xl bg-error-container/30 p-4">
                        {!isCancelConfirming ? (
                            <button
                                type="button"
                                onClick={onCancelClick}
                                className="flex w-full items-center justify-between gap-4 text-left transition-transform active:scale-[0.99]"
                            >
                                <div className="flex items-center gap-3">
                                    <MaterialIcon icon="cancel" className="text-error" />
                                    <div>
                                        <div className="text-sm font-bold text-error">Cancel Event</div>
                                        <div className="text-[11px] text-on-error-container/70">
                                            This action cannot be undone.
                                        </div>
                                    </div>
                                </div>
                                <MaterialIcon icon="chevron_right" className="text-error/50" />
                            </button>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <MaterialIcon icon="warning" className="text-error" />
                                    <div>
                                        <p className="text-sm font-bold text-error">Cancel this {type.valueOf()}?</p>
                                        <p className="text-[11px] text-on-error-container/80">
                                            All participants will lose access to this {type.valueOf()}.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={onKeepEvent}
                                        className="flex-1 rounded-xl bg-surface-container-lowest px-4 py-3 text-sm font-semibold text-on-surface transition-transform active:scale-[0.98]"
                                    >
                                        Keep Event
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onConfirmCancel}
                                        className="flex-1 rounded-xl bg-error px-4 py-3 text-sm font-semibold text-on-error transition-transform active:scale-[0.98]"
                                    >
                                        Confirm Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

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
