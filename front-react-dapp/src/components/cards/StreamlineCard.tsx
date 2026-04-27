export function StreamlineCard() {
    return (
        <div className="mt-8 p-4 rounded-xl border border-outline-variant/20 bg-surface-bright flex items-center gap-4">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-surface-container-high flex-shrink-0">
                <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMSs1MjjNY91MnIOwUMbtmRFEE4ffoFBYFxsJ_yBdI20BtYW4gD7qrgTdVu1lBkhRwRJmFTMtCIGZYCKAKLqLNkRLvJdyQPAFWebJrwy3ymcK1da11DCr1h-qrM-1NJKet8w9C9amgz1_s4McrZdNJMQ9bEtcUJZFvnVdPqaPz21p4FsCC7yek1VryHHkvvsJQHAg_xb6SlVPXBrJloAfzdiuNwVLJb9JPHunOcIPl-7kL8FsnyRPAqoG8P4LozTUpNpzt7SKMR7oW"
                    alt="celebration"
                />
            </div>
            <div>
                <p className="text-sm font-medium text-on-surface">Streamline Collection</p>
                <p className="text-xs text-on-surface-variant">
                    Setting a deadline helps you finalize the gift purchase on time.
                </p>
            </div>
        </div>
    );
}