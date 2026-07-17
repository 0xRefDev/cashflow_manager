"use client";

import { useState, useEffect } from "react";
import { MainHeader } from "@/components/app/MainHeader";
import { Button } from "@/components/Button";
import { Pill } from "@/components/Pill";
import { ProfileDataCard } from "@/components/app/ProfileDataCard";
import { ReputationPBar } from "@/components/app/ReputationPBar";
import { Input } from "@/components/Input";
import { UnderDevelopment } from "@/components/UnderDevelopment";

import { Help } from "@/icons/Help";
import { Share } from "@/icons/app/Share";
import { Location } from "@/icons/app/Location";
import { Calendar } from "@/icons/app/Calendar";
import { AtSign } from "@/icons/AtSign";
import { Edit } from "@/icons/app/Edit";
import { Cancel } from "@/icons/Cancel";
import { SettingsPanel } from "@/icons/app/SettingsPanel";
import { Reset } from "@/icons/app/Reset";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { profileService } from "@/services/client/profile.service";
import { UpdateProfileSchema } from "@/lib/schemas";

export default function Profile() {
  const profile = useAuthStore((s) => s.profile);
  const setProfile = useAuthStore((s) => s.setProfile);
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRegeneratingAvatar, setIsRegeneratingAvatar] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    fullname: profile?.fullname || "",
    username: profile?.username || "",
    country: profile?.country || "",
    occupation: profile?.occupation || "",
    description: profile?.description || "",
  });

  useEffect(() => {
    if (!isEditing && profile) {
      setFormData({
        fullname: profile.fullname || "",
        username: profile.username || "",
        country: profile.country || "",
        occupation: profile.occupation || "",
        description: profile.description || "",
      });
    }
  }, [profile, isEditing]);

  const headerOptions = [
    {
      label: <Help className="w-6 h-6" />,
      action: () => router.push("/app/help"),
    },
  ];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const hasChanges =
    formData.fullname !== (profile?.fullname || "") ||
    formData.username !== (profile?.username || "") ||
    formData.country !== (profile?.country || "") ||
    formData.occupation !== (profile?.occupation || "") ||
    formData.description !== (profile?.description || "");

  const handleSave = async () => {
    setErrors({});

    const result = UpdateProfileSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSaving(true);
    try {
      const updatedProfile = await profileService.update(formData);
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullname: profile?.fullname || "",
      username: profile?.username || "",
      country: profile?.country || "",
      occupation: profile?.occupation || "",
      description: profile?.description || "",
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleRegenerateAvatar = async () => {
    setIsRegeneratingAvatar(true);
    try {
      const res = await fetch("/api/v1/profile/avatar", { method: "POST" });
      const data = await res.json();
      if (data.success && data.profile_photo) {
        setProfile({ ...profile!, profile_photo: data.profile_photo });
      }
    } catch (err) {
      console.error("Failed to regenerate avatar:", err);
    } finally {
      setIsRegeneratingAvatar(false);
    }
  };

  return (
    <section className="flex flex-col gap-0 min-h-screen text-white relative overflow-hidden pb-10">
      {/* Glow Lights */}
      <div className="absolute right-0 top-0 w-100 h-100 bg-landing-primary/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute left-[20%] bottom-[50%] w-37.5 h-37.5 bg-landing-primary/10 blur-[60px] rounded-full pointer-events-none" />
      <div className="absolute right-[25%] bottom-[10%] w-25 h-25 bg-landing-primary/8 blur-2xl rounded-full pointer-events-none" />

      <MainHeader
        title={
          <div className="flex items-center gap-2">
            <p className="text-xl sm:text-2xl font-semibold text-white/90">
              Profile settings | {" "}
              <span className="text-landing-primary">
                @{profile?.username ?? "—"}
              </span>
            </p>
          </div>
        }
        options={headerOptions}
      />

      <article className="mx-12 mt-6 p-8 rounded-2xl bg-white/5 border border-white/10 shadow-2xl shadow-black/40 flex justify-between items-center gap-8">
        <div className="flex gap-6">
          <div className="relative size-32 rounded-xl bg-linear-to-tr from-landing-primary to-[#B4CD46] p-0.75">
            <div className="relative size-full rounded-xl overflow-hidden">
              <Image
                src={
                  (profile?.profile_photo as string) ||
                  "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=default"
                }
                alt={profile?.fullname || "User avatar"}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            {/* Regenerate Avatar Button */}
            <Button
              type="button"
              onClick={handleRegenerateAvatar}
              disabled={isRegeneratingAvatar}
              className="absolute bottom-0 right-0 bg-landing-primary/90 p-1.5 rounded-lg transition-colors text-[#032212]"
              title="Regenerate avatar"
            >
              {isRegeneratingAvatar ? (
                <Reset className="w-4 h-4 animate-spin" />
              ) : (
                <Reset className="w-4 h-4" />
              )}
            </Button>
          </div>

          <div className="flex flex-col h-full gap-2">
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-1">
                <h1 className="text-[40px] font-bold font-inter">
                  {profile?.fullname}
                </h1>
                <p className="italic text-[#ADAAAA] truncate w-[320px]">
                  &quot;{profile?.description ?? "No description available"}
                  &quot;
                </p>
              </div>
              {profile?.verified && (
                <Pill className="bg-[#262626] text-sm">Verified Ledger</Pill>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-sm text-[#ADAAAA]">
                <AtSign className="w-4 h-4 text-landing-primary" />
                {profile?.username ?? "—"}
              </span>

              <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-sm text-[#ADAAAA]">
                <Location className="w-4 h-4 text-landing-primary" />
                {profile?.country || "Unknown location"}
              </span>

              <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-sm text-[#ADAAAA]">
                <Calendar className="w-4 h-4 text-landing-primary" />
                Joined{" "}
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Unknown date"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button className="bg-landing-primary/10 border border-landing-primary/30 text-landing-primary px-5 py-2.5 rounded-lg cursor-pointer flex justify-center items-center gap-2 font-semibold hover:bg-landing-primary/20 transition-colors w-28">
            <Share className="w-4 h-4" />
            Share
          </Button>
          <Button
            className="bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-lg cursor-pointer flex justify-center items-center gap-2 font-medium hover:bg-white/20 transition-colors w-28"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <Cancel className="w-4 h-4" />
                Cancel
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" />
                Edit
              </>
            )}
          </Button>
        </div>
      </article>

      <article className="mx-12 mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="flex flex-col gap-6">
          <ProfileDataCard title="Savings Reputation">
            <div className="flex flex-col justify-between items-center pt-2">
              <ReputationPBar score={2000} />{" "}
              {/* Cambiar para enviar la reputacion */}
            </div>
          </ProfileDataCard>

          <ProfileDataCard title="General Info">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-white/50">Net Worth</span>
              <span className="text-landing-primary font-semibold">0</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-white/50">Avg. Growth</span>
              <span className="text-landing-primary font-semibold">0.00%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-white/50">Active Wallets</span>
              <span className="text-white font-semibold">X</span>
            </div>
          </ProfileDataCard>

          <ProfileDataCard title="Activity">
            <UnderDevelopment />
            {/* <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-white/50">Active Wallets</span>
              <span className="text-landing-primary font-semibold"></span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-white/50">Phone</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-white/50">Member since</span>
              <span className="text-white">
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long"
                }) : "—"}
              </span>
            </div> */}
          </ProfileDataCard>
        </section>

        <section className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium mb-4 tracking-[1.5px] uppercase">
              Edit Profile
            </h3>
            <SettingsPanel className="w-7.5 h-7.5 text-white/50" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50">Full Name</label>
              {isEditing ? (
                <>
                  <Input
                    value={formData.fullname}
                    onChange={(e) => handleChange("fullname", e.target.value)}
                    placeholder="Enter your full name"
                  />
                  {errors.fullname && (
                    <span className="text-xs text-red-400">
                      {errors.fullname}
                    </span>
                  )}
                </>
              ) : (
                <Input
                  value={formData.fullname}
                  disabled
                  className="cursor-default bg-white/5 pointer-events-none opacity-70"
                />
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50">Username</label>
              {isEditing ? (
                <>
                  <Input
                    value={formData.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    placeholder="Enter your username"
                  />
                  {errors.username && (
                    <span className="text-xs text-red-400">
                      {errors.username}
                    </span>
                  )}
                </>
              ) : (
                <Input
                  value={formData.username}
                  disabled
                  className="cursor-default bg-white/5 pointer-events-none opacity-70"
                />
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50">Country</label>
              {isEditing ? (
                <>
                  <Input
                    value={formData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    placeholder="Enter your country"
                  />
                  {errors.country && (
                    <span className="text-xs text-red-400">
                      {errors.country}
                    </span>
                  )}
                </>
              ) : (
                <Input
                  value={formData.country}
                  disabled
                  className="cursor-default bg-white/5 pointer-events-none opacity-70"
                />
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50">Occupation</label>
              {isEditing ? (
                <>
                  <Input
                    value={formData.occupation}
                    onChange={(e) => handleChange("occupation", e.target.value)}
                    placeholder="Enter your occupation"
                  />
                  {errors.occupation && (
                    <span className="text-xs text-red-400">
                      {errors.occupation}
                    </span>
                  )}
                </>
              ) : (
                <Input
                  value={formData.occupation}
                  disabled
                  className="cursor-default bg-white/5 pointer-events-none opacity-70"
                />
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50">Description</label>
              {isEditing ? (
                <>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    placeholder="Tell us about yourself"
                    rows={3}
                    className="w-full bg-[#111111] border border-white/5 rounded-xl py-2 px-4 text-white placeholder-gray-500 outline-none hover:border-white/10 focus:border-[#4ade80]/50 focus:ring-1 focus:ring-[#4ade80]/20 transition-all duration-300 resize-none"
                  />
                  {errors.description && (
                    <span className="text-xs text-red-400">
                      {errors.description}
                    </span>
                  )}
                </>
              ) : (
                <textarea
                  value={formData.description}
                  disabled
                  readOnly
                  rows={3}
                  className="w-full bg-[#111111] border border-white/5 rounded-xl py-2 px-4 text-white/70 italic cursor-default pointer-events-none opacity-70 resize-none"
                />
              )}
            </div>

            {isEditing && (
              <div className="flex gap-3 mt-2">
                <Button
                  className="bg-landing-primary text-[#05321A] px-6 py-2.5 rounded-lg cursor-pointer flex items-center gap-2 font-semibold hover:bg-landing-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSave}
                  disabled={!hasChanges || isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  className="bg-white/10 border border-white/20 text-white px-6 py-2.5 rounded-lg cursor-pointer flex items-center gap-2 font-medium hover:bg-white/20 transition-colors"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </section>
      </article>

      <ProfileDataCard
        title="Danger Zone"
        className="mx-12 mt-6 text-[#FF7351]"
      >
        <div className="flex justify-between items-center text-[#ADAAAA]">
          Once you delete your profile, there is no going back. Please be
          certain.
          <Button className="border-2 border-[#FF7351]/30 text-[#FF7351] px-6 py-2.5 rounded-lg cursor-pointer flex items-center gap-2 font-semibold hover:bg-[#ff330016] transition-colors">
            Delete Profile
          </Button>
          {/* Aplicar funcionalidad de eliminar cuenta.. [Cambiar status de la cuenta] */}
        </div>
      </ProfileDataCard>
    </section>
  );
}
