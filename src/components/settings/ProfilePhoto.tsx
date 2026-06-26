"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function PersonalInfo() {
    const {
        register,
        watch,
        formState: { errors },
    } = useFormContext();

    const bio = watch("bio");

    return (
        <div className="grid gap-6">
            <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Full Name
                </label>

                <Input
                    {...register("fullName")}
                    className="h-12 rounded-xl"
                />

                {errors.fullName && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.fullName.message?.toString()}
                    </p>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Email Address
                    </label>

                    <Input
                        type="email"
                        {...register("email")}
                        className="h-12 rounded-xl"
                    />

                    {errors.email && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.email.message?.toString()}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Phone Number
                    </label>

                    <Input
                        {...register("phone")}
                        className="h-12 rounded-xl"
                    />

                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.phone.message?.toString()}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Short Bio
                    </label>

                    <span className="text-xs text-slate-400">
                        {bio?.length || 0}/200
                    </span>
                </div>

                <Textarea
                    rows={4}
                    {...register("bio")}
                    className="rounded-xl resize-none"
                    placeholder="Tell us about yourself..."
                />

                {errors.bio && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.bio.message?.toString()}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Username
                </label>

                <Input
                    {...register("username")}
                    className="h-12 rounded-xl"
                />

                {errors.username && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.username.message?.toString()}
                    </p>
                )}
            </div>
        </div>
    );
}