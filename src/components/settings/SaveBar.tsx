"use client";

import { Button } from "@/components/ui/button";
import { Info, Save, X } from "lucide-react";

interface Props {
    isDirty: boolean;
    loading: boolean;
}

export default function SaveBar({
    isDirty,
    loading,
}: Props) {
    if (!isDirty) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/80 backdrop-blur-xl shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.15)]">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
                {/* Left */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                        <Info className="h-5 w-5 text-indigo-600" />
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-900">
                            Unsaved changes detected
                        </h4>

                        <p className="text-sm text-slate-500">
                            Your profile information has been modified.
                        </p>
                    </div>
                </div>

                {/* Right */}
                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl"
                    >
                        <X className="mr-2 h-4 w-4" />
                        Discard
                    </Button>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 shadow-lg"
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