"use client";

import { useState } from "react";
import {
    ShieldCheck,
    Lock,
    LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function SecuritySettings() {
    const [twoFA, setTwoFA] = useState(true);
    const [password, setPassword] = useState("");

    const getStrength = () => {
        if (!password) return 0;
        if (password.length < 6) return 25;
        if (password.length < 10) return 60;
        return 100;
    };

    const strength = getStrength();

    const strengthColor =
        strength < 30
            ? "bg-red-500"
            : strength < 80
                ? "bg-amber-500"
                : "bg-green-500";

    const strengthText =
        strength < 30
            ? "Weak"
            : strength < 80
                ? "Medium"
                : "Strong Password";

    return (
        <div className="space-y-8">
            {/* Security Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                        <ShieldCheck className="h-6 w-6 text-green-600" />
                    </div>

                    <div>
                        <h3 className="text-lg font-bold">
                            Security Center
                        </h3>
                        <p className="text-sm text-slate-500">
                            Manage account protection settings
                        </p>
                    </div>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase text-green-700">
                    Secure
                </span>
            </div>

            {/* 2FA */}
            <div className="flex items-center justify-between rounded-2xl border bg-slate-50 p-5">
                <div>
                    <h4 className="font-semibold">
                        Two-Factor Authentication
                    </h4>

                    <p className="mt-1 text-sm text-slate-500">
                        Add an extra layer of protection to your
                        account.
                    </p>
                </div>

                <Switch
                    checked={twoFA}
                    onCheckedChange={setTwoFA}
                />
            </div>

            {/* Actions */}
            <div className="grid gap-3">
                <Button
                    variant="outline"
                    className="h-12 justify-start rounded-xl text-red-600 hover:text-red-600 w-full"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout From All Devices
                </Button>
            </div>
        </div>
    );
}