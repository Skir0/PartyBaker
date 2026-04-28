import { Link } from 'react-router';
import { EventsDashboardHeader } from '../components/ui/EventsDashboardHeader.tsx';
import { SummaryStatCard } from '../components/cards/SummaryStatCard.tsx';
import { EventOverviewCard } from '../components/cards/EventOverviewCard.tsx';
import { BottomNavBar } from '../components/ui/BottomNavBar.tsx';
import { MaterialIcon } from '../components/ui/MaterialIcon.tsx';
import { useEffect, useState } from 'react';
import { getEventsOfCurrentUser } from '../api/giftService.ts';
import type { GetEventsRequest } from '../api/requests.ts';

const summaryStats = [
    {
        icon: 'celebration',
        iconClassName: 'text-primary',
        label: 'Active Events',
        value: '12',
    },
    {
        icon: 'history_edu',
        iconClassName: 'text-tertiary',
        label: 'Gifts Shared',
        value: '48',
    },
];

const eventCards = [
    {
        title: "Sarah's Birthday Bash",
        participants: '8 Participants',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTwrIPQ4Uio2WJ8I0HMv2C4z5dwRn5jhV-v_-3fwQsAizZHyqQtgJUrWTdbF7ol8LzaqyvPRAMgRk03HX2X1w9_P3A1AVhQaJOA9ReEPRZeJFJfGHNMuqQWjnAZrFkZscmUGMbVsVPVKfSHF5cn54PRnPqtNoNtw7N8vHXtbm99NqQaE_FAJnQK0Vvp-SjaiDkAUgm3a0B2jFKnJUFjTKWJQvco4NXDEEQNLsZ8FH6ExUUDSivENyNv_5OmNUUsndpzsRsdOqN7NuV',
        imageAlt: 'Birthday cake with candles and decorations',
        status: 'Active',
        statusClassName: 'bg-primary/10 text-primary',
        eventDate: 'Oct 24, 2024',
        deadline: 'Oct 20',
        deadlineClassName: 'text-error font-semibold',
    },
    {
        title: 'Office Secret Santa',
        participants: '24 Participants',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDXy9Te7nWp6Zcr2DZMerz3JXr9gm1QgFXk5EGRWlWrnETaAtxSIyn1EjOulua7mVjIzVRkjYrU48DdU5DfIUYZ4h8ao6Q1rsOxMtIcCr92JUAtsNMC0SuAHfcLMLVPYfFTDtR_QZ_yrvgArrFTD4nO_MdCru76yHodVdATcwjF084REDYC37JLmjQVDr1OBeT1JBH14V5BEpt33dYfEIt8O128GdQt5fT4_usLKhlaQ_ZSme55VtVtZtkWp4PtSankKuzUFOyZRSW',
        imageAlt: 'Wrapped Christmas gifts with ribbons',
        status: 'Invited',
        statusClassName: 'bg-surface-container-high text-on-surface-variant',
        eventDate: 'Dec 20, 2024',
        deadline: 'Dec 10',
    },
    {
        title: "Mike's Housewarming",
        participants: '5 Participants',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNwS9TGI5a3ETXvHQvqJL_NTcUyTSp8Q_hi9p40CzlWrKLNQTxI4yupThY6e4xeyVFH0cwRgbsUU6fgpFCEOyw8q78LWnLmO14k8Ssdte6QQEELJ46BSy9wTkpBlOsCvC_7keHpNeagK09ztuhJJgnlKjliLqig_Fu6BTXfN9O_9uwaaNWFejR9PLSEMA7EM-lgTFzxkEPeXiDTQcDfn_VM-yMB1tkz7dekovL2y1qhHIdH7AQ3zPEFuKskruDn14DszQnptctiiA4',
        imageAlt: 'Modern living room interior',
        status: 'Planning',
        statusClassName: 'bg-tertiary/10 text-tertiary',
        eventDate: 'Nov 02, 2024',
        deadline: 'Oct 28',
    },
];



export function EventsDashboardPage() {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>(null);
    const [events, setEvents] = useState();

    useEffect(() => {
        const loadEvents = async () => {
            setIsLoading(true);
            setError(null);

            const req: GetEventsRequest = {
                user_id: 12345678
            }

            try {
                const data = await getEventsOfCurrentUser(req);
                console.log(data)
                setEvents(data);
            } catch (err) {
                setError('Failed to load events');
            } finally {
                setIsLoading(false);
            }
        };

        loadEvents();
    }, []);

    return (
        <div className="min-h-screen bg-background text-on-background">
            <EventsDashboardHeader />
            <main className="mx-auto max-w-2xl px-4 pb-32 pt-14">
                <div className="mb-6 mt-4 grid grid-cols-2 gap-3">
                    {summaryStats.map((stat) => (
                        <SummaryStatCard key={stat.label} {...stat} />
                    ))}
                </div>

                <h2 className="mb-3 px-1 text-[14px] font-semibold uppercase tracking-wider text-on-surface">
                    Upcoming Participation
                </h2>

                <div className="flex flex-col gap-3">
                    {eventCards.map((card) => (
                        <EventOverviewCard key={card.title} {...card} />
                    ))}

                    <Link to="/eventForm" className="mt-1 block">
                        <button className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary text-[16px] font-semibold text-on-primary shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]">
                            <MaterialIcon icon="add_circle" fill={true} />
                            <span>Create New Event</span>
                        </button>
                    </Link>
                </div>
            </main>

            <Link
                to="/eventForm"
                className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-xl shadow-primary/30 transition-transform active:scale-95 md:hidden"
            >
                <MaterialIcon icon="add" size="text-3xl" />
            </Link>

            <BottomNavBar />
        </div>
    );
}
