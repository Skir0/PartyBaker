import { useState } from 'react';
import { MaterialIcon } from '../../components/ui/MaterialIcon.tsx';
import { useNavigate } from 'react-router';
import { joinEvent } from '../../api/eventService.ts';
import { getRecipientsOfEvent } from '../../api/participantsService.ts';

export function JoinExistingEventCard() {
    const [code, setCode] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [error, setError] = useState<string>("");

    const navigate = useNavigate();

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = e.target.value.toUpperCase().replace(/\s/g, '').slice(0, 6);
        setCode(formattedValue);
    };

    const handleJoinEvent = async () => {
        setError("");
        console.log("Joining event:", code, "as", selectedRole);

        const response = await joinEvent({
            join_code: code,
            role: selectedRole
        });
        if (response.error !== "") {
            console.log(response.error)
            setError(response.error);
            return
        }

        const recipientsOfEvent = await getRecipientsOfEvent(response.event_id)

        navigate(`/events/${response.event_id}/gifts`, {
            state: { recipientsOfEvent }
        });

    }

    const isFormValid = code.length === 6 && selectedRole !== '';

    return (
        <div className="rounded-2xl border border-outline-variant/15 bg-surface-container-low p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MaterialIcon icon="group_add" fill={true} />
                </div>
                <h3 className="text-lg font-semibold text-on-surface">Join Existing Event</h3>
            </div>

            <div className="mb-6 space-y-4">
                <div>
                    <label className="mb-1.5 block pl-1 text-xs font-medium text-on-surface-variant">
                        Event Code
                    </label>
                    <input
                        className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3.5 text-m font-bold tracking-[0.2em] text-on-surface transition-colors placeholder:font-normal placeholder:tracking-normal placeholder:text-on-surface-variant/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Enter code"
                        type="text"
                        value={code}
                        onChange={handleCodeChange}
                    />
                </div>

                <div>
                    <label className="mb-1.5 block pl-1 text-xs font-medium text-on-surface-variant">
                        Join As
                    </label>
                    <div className="relative">
                        <select
                            className="w-full appearance-none rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3.5 text-m font-medium text-on-surface transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            <option value="" disabled className="text-on-surface-variant">Select your role...</option>
                            <option value="recipient">Recipient (Receive gifts)</option>
                            <option value="contributor">Contributor (Offer gifts)</option>
                            <option value="participant">Participant (Both)</option>
                        </select>

                        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-on-surface-variant">
                            <MaterialIcon icon="expand_more" />
                        </div>
                    </div>
                </div>
            </div>

            <button
                disabled={!isFormValid}
                className={`flex h-[52px] w-full items-center justify-center gap-2 rounded-xl font-semibold transition-all ${
                    isFormValid
                        ? 'bg-primary text-on-primary active:scale-[0.98]'
                        : 'bg-surface-container-high text-on-surface-variant/50 cursor-not-allowed'
                }`}
                onClick={handleJoinEvent}
            >
                Join Event
                <MaterialIcon icon="arrow_forward" className="text-[20px]" />
            </button>
            {error && (
                <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                </p>
            )}
        </div>
    );
}