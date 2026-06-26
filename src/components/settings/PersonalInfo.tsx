"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function PersonalInfo() {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div className="grid gap-6">
            <div>
                <Label>Username</Label>
                <Input {...register("username")} className="bg-white" />
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message?.toString()}</p>}
            </div>

            <div>
                <Label>Bio</Label>
                <Textarea
                    {...register("bio")}
                    rows={4}
                    placeholder="Write something about yourself..."
                    className="bg-white"
                />
                {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio.message?.toString()}</p>}
            </div>
        </div>
    );
}