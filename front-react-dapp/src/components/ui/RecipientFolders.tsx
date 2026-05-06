import { MaterialIcon } from './MaterialIcon.tsx';
import type { RecipientGiftFolder } from '../../types/event.types.ts';

interface RecipientFoldersProps {
    folders: RecipientGiftFolder[];
    activeFolderId: string;
    onSelect: (folderId: string) => void;
}

export function RecipientFolders({
    folders,
    activeFolderId,
    onSelect
}: RecipientFoldersProps) {
    return (
        <section className="mb-6">
            <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-1">
                {folders.map((folder) => {
                    const isActive = folder.id === activeFolderId;

                    return (
                        <button
                            key={folder.id}
                            type="button"
                            onClick={() => onSelect(folder.id)}
                            className={`min-w-[164px] shrink-0 rounded-lg border px-4 py-3 text-left transition-colors ${
                                isActive
                                    ? 'border-primary bg-primary-container text-on-primary-container'
                                    : 'border-outline-variant/20 bg-surface-container-lowest text-on-surface'
                            }`}
                        >
                            <div className="mb-2 flex items-center gap-2">
                                <MaterialIcon
                                    icon="folder"
                                    fill={isActive}
                                    size="text-[20px]"
                                    className={isActive ? 'text-on-primary-container' : 'text-primary'}
                                />
                                <span className="truncate text-sm font-semibold">{folder.recipientName}</span>
                            </div>
                            <p className={`truncate text-xs ${isActive ? 'text-on-primary-container/80' : 'text-on-surface-variant'}`}>
                                {folder.subtitle}
                            </p>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
