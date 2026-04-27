export function OrDivider() {
    return (
        <div className="flex items-center gap-4 px-2 py-4">
            <div className="h-[1px] flex-grow bg-outline-variant/20"></div>
            <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">or</span>
            <div className="h-[1px] flex-grow bg-outline-variant/20"></div>
        </div>
    );
}
