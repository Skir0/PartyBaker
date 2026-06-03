import { MaterialIcon } from './MaterialIcon.tsx';
import type { SheetType } from './AdminSheet.tsx';

export enum Action {
    FINALIZE= "Finalize",
    CANCEL = "Cancel"
}

type ConfirmActionButtonProps = {
    type: SheetType;
    actionName: Action;
    isActionConfirming: boolean;
    onActionClick: () => void;
    onKeepAction: () => void;
    onConfirmAction: () => void;
}

export function ConfirmActionButton({
                                        type,
                                        actionName,
                                        isActionConfirming,
                                        onActionClick,
                                        onKeepAction,
                                        onConfirmAction
                                    }: ConfirmActionButtonProps) {

    const containerClassName = actionName === Action.CANCEL ? 'error-container'
        : 'amber-200'

    return (
        <div className={`rounded-xl bg- ${containerClassName}/30 p-4`}>
            {!isActionConfirming ? (
                <button
                    type="button"
                    onClick={onActionClick}
                    className="flex w-full items-center justify-between gap-4 text-left transition-transform active:scale-[0.99]"
                >
                    <div className="flex items-center gap-3">
                        <MaterialIcon icon="cancel" className="text-error" />
                        <div>
                            <div className="text-sm font-bold text-error">{actionName} {type}</div>
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
                            <p className="text-sm font-bold text-error">{actionName} this {type}</p>
                            <p className="text-[11px] text-on-error-container/80">
                                {
                                    actionName === Action.CANCEL ? `All participants will lose access to this ${type}` :
                                        `It will be impossible to change gifts`
                                }

                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onKeepAction}
                            className="flex-1 rounded-xl bg-surface-container-lowest px-4 py-3 text-sm font-semibold text-on-surface transition-transform active:scale-[0.98]"
                        >

                            Stop {actionName.toLowerCase()}
                        </button>
                        <button
                            type="button"
                            onClick={onConfirmAction}
                            className="flex-1 rounded-xl bg-error px-4 py-3 text-sm font-semibold text-on-error transition-transform active:scale-[0.98]"
                        >
                            Confirm {actionName}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}