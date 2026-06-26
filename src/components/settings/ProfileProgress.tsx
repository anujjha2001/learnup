interface Props {
    completion: number;
}

export default function ProfileProgress({ completion }: Props) {
    return (
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                        Profile Completion
                    </p>
                    <h3 className="text-3xl font-black mt-2">
                        {completion}%
                    </h3>
                </div>
            </div>

            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 transition-all duration-500"
                    style={{ width: `${completion}%` }}
                />
            </div>

            <p className="text-xs text-slate-500 mt-3">
                Complete your profile to unlock all learning features.
            </p>
        </div>
    );
}