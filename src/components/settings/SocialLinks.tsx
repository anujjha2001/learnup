"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, ExternalLink, Users } from "lucide-react";

export default function SocialLinks() {
    const { register } = useFormContext();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-slate-400" />
                <Input placeholder="Website URL" {...register("website")} className="bg-white" />
            </div>

            <div className="flex items-center gap-3">
                <ExternalLink className="w-5 h-5 text-slate-400" />
                <Input placeholder="GitHub Profile" {...register("github")} className="bg-white" />
            </div>

            <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-slate-400" />
                <Input placeholder="LinkedIn Profile" {...register("linkedin")} className="bg-white" />
            </div>

            <div>
                <Label>Portfolio URL</Label>
                <Input {...register("portfolio")} className="bg-white" />
            </div>
        </div>
    );
}