"use client";

import { Button } from "@/components/ui/button";
import { Info, Save, X } from "lucide-react";

interface Props {
    isDirty: boolean;
    loading: boolean;
    onDiscard: () => void;
}

export default function SaveBar({
    isDirty,
    loading,
    onDiscard,
}: Props) {
    if (!isDirty) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-[#0b0a1d]/85 backdrop-blur-xl shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.5)]">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
                {/* Left */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10">
                        <Info className="h-5 w-5 text-purple-400" />
                    </div>

                    <div>
                        <h4 className="font-semibold text-white">
                            Unsaved changes detected
                        </h4>

                        <p className="text-sm text-slate-400">
                            Your profile information has been modified.
                        </p>
                    </div>
                </div>

                {/* Right */}
                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl border-white/10 text-slate-300 hover:bg-white/5 hover:text-white cursor-pointer"
                        onClick={onDiscard}
                    >
                        <X className="mr-2 h-4 w-4" />
                        Discard
                    </Button>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#f97316] hover:brightness-110 px-8 shadow-lg shadow-purple-500/15 text-white font-extrabold cursor-pointer border-none"
                    >
                        <Save className="mr-2 h-4 w-4" />

                        {loading
                            ? "Saving Changes..."
                            : "Save Changes"}
                    </Button>
                </div>
            </div>
        </div>
    );
}