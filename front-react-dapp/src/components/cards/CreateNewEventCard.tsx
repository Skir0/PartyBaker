import { Link } from 'react-router';
import { MaterialIcon } from '../ui/MaterialIcon.tsx';

interface CreateNewEventCardProps {
    to?: string;
}

export function CreateNewEventCard({ to = '/eventForm' }: CreateNewEventCardProps) {
    return (
        <Link to={to}>
            <button className="w-full group">
                <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 flex items-center justify-between active:bg-surface-container-low transition-colors duration-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <MaterialIcon icon="add_circle" className="text-primary" fill={true} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-on-surface font-semibold text-base">Create New Event</h3>
                            <p className="text-on-surface-variant text-sm">Start a new group gift fund</p>
                        </div>
                    </div>
                    <MaterialIcon icon="chevron_right" className="text-outline-variant group-active:text-primary transition-colors" />
                </div>
            </button>
        </Link>
    );
}
