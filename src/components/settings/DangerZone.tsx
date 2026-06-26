"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Download, Trash2 } from "lucide-react";

export default function DangerZone() {
    return (
        <section className="rounded-3xl border border-red-200 bg-red-50/70 p-8">
            {/* Header */}

            <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>

                <div>
                    <h3 className="text-xl font-bold text-red-600">
                        Danger Zone
                    </h3>

                    <p className="text-sm text-slate-500">
                        Permanent account actions
                    </p>
                </div>
            </div>

            {/* Content */}

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                    <h4 className="font-semibold text-slate-900">
                        Delete Account & Data
                    </h4>

                    <p className="mt-2 text-sm text-slate-600">
                        Permanently remove your account, enrolled courses,
                        certificates, profile information and learning history.
                        This action cannot be undone.
                    </p>
                </div>

                {/* Actions */}

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Export My Data
                    </Button>

                    <Button
                        type="button"
                        variant="destructive"
                        className="rounded-xl px-6 shadow-lg"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                    </Button>
                </div>
            </div>
        </section>
    );
}