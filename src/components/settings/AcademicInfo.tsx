"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AcademicInfo() {
  const { register } = useFormContext();

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Course</Label>
          <Input {...register("course")} className="bg-white" />
        </div>
        <div>
          <Label>Semester</Label>
          <Input {...register("semester")} className="bg-white" />
        </div>
      </div>

      <div>
        <Label>College / University</Label>
        <Input {...register("college")} className="bg-white" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Department</Label>
          <Input {...register("department")} className="bg-white" />
        </div>
        <div>
          <Label>Location</Label>
          <Input {...register("location")} className="bg-white" />
        </div>
      </div>
    </div>
  );
}