"use client";

import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AcademicInfo() {
    const { register } = useFormContext();

    return (
        <div className="grid gap-6">
            {/* Course + Semester */}

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label className="ml-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Course
                    </Label>

                    <Input
                        {...register("course")}
                        className="h-12 rounded-xl border-slate-200 bg-white shadow-sm"
                        placeholder="B.Tech"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="ml-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Semester
                    </Label>

                    <Input
                        {...register("semester")}
                        className="h-12 rounded-xl border-slate-200 bg-white shadow-sm"
                        placeholder="8"
                    />
                </div>
            </div>

            {/* College */}

            <div className="space-y-2">
                <Label className="ml-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                    University / Institute
                </Label>

                <Input
                    {...register("college")}
                    className="h-12 rounded-xl border-slate-200 bg-white shadow-sm"
                    placeholder="ITM Gwalior"
                />
            </div>

            {/* Department + Location */}

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label className="ml-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Department
                    </Label>

                    <Input
                        {...register("department")}
                        className="h-12 rounded-xl border-slate-200 bg-white shadow-sm"
                        placeholder="Computer Science"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="ml-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Location
                    </Label>

                    <Input
                        {...register("location")}
                        className="h-12 rounded-xl border-slate-200 bg-white shadow-sm"
                        placeholder="India"
                    />
                </div>
            </div>

            {/* Academic Summary Card */}

            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-5">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Academic Status
                        </p>

                        <h4 className="mt-1 text-lg font-bold text-slate-900">
                            Final Year Student
                        </h4>
                    </div>

                    <div className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white">
                        Active
                    </div>
                </div>

                <p className="mt-3 text-sm text-slate-600">
                    Keep your academic information updated to receive personalized course
                    recommendations and certifications.
                </p>
            </div>
        </div>
    );
}