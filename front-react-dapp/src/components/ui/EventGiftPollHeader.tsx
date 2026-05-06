interface EventGiftPollHeaderProps {
    title: string;
    subtitle: string;
}

export function EventGiftPollHeader({ title, subtitle }: EventGiftPollHeaderProps) {
    return (
        <section className="mb-8 mt-6 text-center">
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-on-surface">{title}</h2>
            <p className="px-8 text-sm text-on-surface-variant">{subtitle}</p>
        </section>
    );
}
