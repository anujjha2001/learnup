"use client";

import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import ProfilePhoto from "./ProfilePhoto";
import AuthDetails from "./AuthDetails";
import PersonalInfo from "./PersonalInfo";
import AcademicInfo from "./AcademicInfo";
import Preferences from "./Preferences";
import SecuritySettings from "./SecuritySettings";
import SocialLinks from "./SocialLinks";
import DangerZone from "./DangerZone";
import ProfileProgress from "./ProfileProgress";
import SaveBar from "./SaveBar";

import { triggerProfileUpdate } from "@/utils/profileSync";
import { profileSchema, ProfileForm } from "@/utils/validation";
import { authClient } from "@/lib/auth-client";

const defaultValues: ProfileForm = {
  fullName: "Anuj Jha",
  email: "anuj@example.com",
  phone: "7869816989",
  bio: "Computer Science Specialist",
  username: "anujjha",
  course: "B.Tech",
  semester: "8",
  college: "ITM Gwalior",
  department: "Computer Science",
  location: "India",
  website: "",
  github: "",
  linkedin: "",
  portfolio: "",
  language: "English",
  theme: "light",
  notifications: true,
  darkMode: false,
  tier: "Premium Pro",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500",
};

export default function SettingsForm({ onClose, user }: { onClose?: () => void; user?: any }) {
  const methods = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    handleSubmit,
    watch,
    reset,
    formState: { isDirty },
  } = methods;

  const values = watch();

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const completion = useMemo(() => {
    let score = 0;
    if (values.avatar) score += 10;
    if (values.fullName?.trim()) score += 10;
    if (values.email?.trim()) score += 10;
    if (values.phone?.trim()) score += 10;
    if (values.bio?.trim()) score += 10;
    if (values.course?.trim()) score += 10;
    if (values.semester?.trim()) score += 10;
    if (values.department?.trim()) score += 10;
    if (values.github?.trim()) score += 10;
    if (values.linkedin?.trim()) score += 10;
    return Math.min(100, score);
  }, [values]);

  const [submitError, setSubmitError] = useState("");

  const handleDiscard = () => {
    const profile = localStorage.getItem("profile");
    const userSessionStr = localStorage.getItem("learnup_user");
    
    let loadedValues = { ...defaultValues };
    if (profile) {
      loadedValues = { ...loadedValues, ...JSON.parse(profile) };
    }
    if (userSessionStr) {
      const userSession = JSON.parse(userSessionStr);
      loadedValues.fullName = userSession.name || loadedValues.fullName;
      loadedValues.email = userSession.email || loadedValues.email;
      loadedValues.phone = userSession.phone || loadedValues.phone;
    }
    if (user) {
      loadedValues.fullName = user.name || loadedValues.fullName;
      loadedValues.email = user.email || loadedValues.email;
      loadedValues.phone = user.phone || loadedValues.phone;
    }
    reset(loadedValues);
    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    const profile = localStorage.getItem("profile");
    const userSessionStr = localStorage.getItem("learnup_user");
    
    let loadedValues = { ...defaultValues };
    if (profile) {
      loadedValues = { ...loadedValues, ...JSON.parse(profile) };
    }
    if (userSessionStr) {
      const userSession = JSON.parse(userSessionStr);
      loadedValues.fullName = userSession.name || loadedValues.fullName;
      loadedValues.email = userSession.email || loadedValues.email;
      loadedValues.phone = userSession.phone || loadedValues.phone;
    }
    if (user) {
      loadedValues.fullName = user.name || loadedValues.fullName;
      loadedValues.email = user.email || loadedValues.email;
      loadedValues.phone = user.phone || loadedValues.phone;
    }
    reset(loadedValues);
  }, [reset, user]);

  useEffect(() => {
    const unload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", unload);
    return () => window.removeEventListener("beforeunload", unload);
  }, [isDirty]);

  const onSubmit = async (data: ProfileForm) => {
    setSaving(true);
    setSubmitError("");
    setSaved(false);

    try {
      const userSessionStr = localStorage.getItem("learnup_user");
      if (!userSessionStr) {
        throw new Error("No active user session found. Please sign in again.");
      }
      const userSession = JSON.parse(userSessionStr);

      // Save to database
      const res = await authClient.updateProfile({
        userId: userSession.id,
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      if (!res.success) {
        throw new Error(res.error || "Failed to update profile in database.");
      }

      // Sync local storage & state
      localStorage.setItem("profile", JSON.stringify(data));
      localStorage.setItem("user_avatar", data.avatar);
      localStorage.setItem("user_name", data.fullName);
      localStorage.setItem("user_email", data.email);
      localStorage.setItem("user_phone", data.phone);
      localStorage.setItem("user_bio", data.bio);
      localStorage.setItem("user_tier", data.tier);

      // Update session storage
      const updatedSession = {
        ...userSession,
        name: data.fullName,
        email: data.email,
        phone: data.phone,
      };
      localStorage.setItem("learnup_user", JSON.stringify(updatedSession));

      triggerProfileUpdate();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen bg-[#070710] text-[#f1f5f9] antialiased">
        <style dangerouslySetInnerHTML={{__html: `
          .glass-card {
            background-color: rgba(11, 10, 29, 0.6) !important;
            backdrop-filter: blur(12px) !important;
            border: 1px solid rgba(255, 255, 255, 0.05) !important;
            box-shadow: none !important;
          }
          .bg-white {
            background-color: rgba(7, 7, 16, 0.6) !important;
            color: #ffffff !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
          }
          input, textarea, select {
            background-color: rgba(7, 7, 16, 0.6) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            color: #ffffff !important;
          }
          input:focus, textarea:focus, select:focus {
            border-color: #8b5cf6 !important;
            outline: none !important;
          }
          label {
            color: #94a3b8 !important;
            font-weight: 700 !important;
          }
          .text-\[\#0b1c30\] {
            color: #ffffff !important;
          }
          .text-\[\#464555\] {
            color: #94a3b8 !important;
          }
          .border {
            border-color: rgba(255, 255, 255, 0.05) !important;
          }
          .text-slate-900 {
            color: #f1f5f9 !important;
          }
        `}} />
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-10 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white">Account Settings</h1>
              <p className="text-slate-400 mt-1">Manage your profile, preferences, and academic information</p>
            </div>
          </div>

          {saved && (
            <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700 flex items-center gap-3">
              <span className="material-symbols-outlined">check_circle</span>
              Profile updated successfully and synced across platform.
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-4 space-y-8">
              <ProfileProgress completion={completion} />

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProfilePhoto />
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Membership</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-xl border p-5 bg-white">
                      <div className="text-sm text-[#464555]">Current Plan</div>
                      <div className="text-2xl font-bold text-[#3525cd] mt-1">{values.tier}</div>
                    </div>
                    <div className="rounded-xl border p-5 bg-white">
                      <div className="text-sm text-[#464555]">Profile Completion</div>
                      <div className="text-2xl font-bold text-[#3525cd] mt-1">{completion}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-8 space-y-8">
              {submitError && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 flex items-center gap-3">
                  <span className="material-symbols-outlined">error</span>
                  {submitError}
                </div>
              )}

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Auth Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <AuthDetails />
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <PersonalInfo />
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Academic Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <AcademicInfo />
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Social Profiles</CardTitle>
                </CardHeader>
                <CardContent>
                  <SocialLinks />
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <Preferences />
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <SecuritySettings />
                </CardContent>
              </Card>

              <DangerZone />
            </div>
          </div>
        </div>

        <SaveBar isDirty={isDirty} loading={saving} onDiscard={handleDiscard} />
      </form>
    </FormProvider>
  );
}
