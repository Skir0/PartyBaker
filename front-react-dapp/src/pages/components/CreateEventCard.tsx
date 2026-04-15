import React from 'react';


export default class CreateEventCard extends React.Component {

    render() {
        return (
                <div className="bg-background text-on-surface flex flex-col min-h-screen">
                <header
                    className="fixed top-0 w-full z-50 bg-[#f9f9fa]/80 backdrop-blur-md border-b border-[#c0c7d3]/10 flex items-center justify-between px-4 h-14 w-full">
                    <button
                        className="active:opacity-70 transition-opacity active:scale-95 duration-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#005f9e]">arrow_back</span>
                    </button>
                    <h1 className="font-['Inter'] font-semibold text-lg tracking-tight text-[#1a1c1d]">Group Gift</h1>
                    <button
                        className="active:opacity-70 transition-opacity active:scale-95 duration-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#404751]">close</span>
                    </button>
                </header>
                <main className="flex-grow pt-20 px-4 pb-24 max-w-md mx-auto w-full flex flex-col">
                    <div className="mb-10 text-left">
                        <h2 className="text-3xl font-semibold text-on-surface mb-2 tracking-tight">Welcome</h2>
                        <p className="text-on-surface-variant font-medium leading-snug">Create a shared gift pool or
                            join an
                            existing celebration with your friends.</p>
                    </div>
                    <section className="space-y-4">
                        <div
                            className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                            <span
                                className="material-symbols-outlined text-primary"
                                style={{ fontVariationSettings: '\'FILL\' 1' }}>
                                group_add
                            </span>
                                <h3 className="text-on-surface font-semibold text-base">Join Existing Event</h3>
                            </div>
                            <div className="relative mb-4">
                                <input
                                    className="w-full bg-surface-container-lowest border-none rounded-lg px-4 py-3 text-on-surface placeholder-on-surface-variant/50 focus:ring-1 focus:ring-primary text-lg font-medium tracking-widest uppercase"
                                    placeholder="Enter 6-digit code" type="text" />
                            </div>
                            <button
                                className="w-full h-[52px] bg-primary text-on-primary font-semibold rounded-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                                Join Event
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-4 px-2 py-4">
                            <div className="h-[1px] flex-grow bg-outline-variant/20"></div>
                            <span
                                className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">or</span>
                            <div className="h-[1px] flex-grow bg-outline-variant/20"></div>
                        </div>
                        <button className="w-full group">
                            <div
                                className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 flex items-center justify-between active:bg-surface-container-low transition-colors duration-200">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary"
                                          style={{ fontVariationSettings: '\'FILL\' 1' }}>add_circle
                                    </span>
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-on-surface font-semibold text-base">Create New Event</h3>
                                        <p className="text-on-surface-variant text-sm">Start a new group gift fund</p>
                                    </div>
                                </div>
                                <span
                                    className="material-symbols-outlined text-outline-variant group-active:text-primary transition-colors">chevron_right</span>
                            </div>
                        </button>
                    </section>
                    <div className="mt-auto pt-12 opacity-40 flex justify-center">
                        <div
                            className="w-24 h-24 bg-gradient-to-tr from-primary/20 to-secondary-container/20 rounded-full blur-2xl"></div>
                    </div>
                </main>
                </div>
        );
    }


}