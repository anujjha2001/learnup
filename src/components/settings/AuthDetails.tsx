"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AuthDetails() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Full Name</Label>
          <Input {...register("fullName")} className="bg-white" />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fullName.message?.toString()}
            </p>
          )}
        </div>

        <div>
          <Label>Phone Number</Label>
          <Input {...register("phone")} className="bg-white" />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">
              {errors.phone.message?.toString()}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label>Email Address</Label>
        <Input type="email" {...register("email")} className="bg-white" />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email.message?.toString()}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
        <div>
          <Label>New Password (Optional)</Label>
          <Input 
            type="password" 
            {...register("password")} 
            placeholder="••••••••" 
            className="bg-white" 
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message?.toString()}
            </p>
          )}
        </div>

        <div>
          <Label>Confirm Password</Label>
          <Input 
            type="password" 
            {...register("confirmPassword")} 
            placeholder="••••••••" 
            className="bg-white" 
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message?.toString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
