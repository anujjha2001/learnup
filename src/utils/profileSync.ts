import { useProfileStore } from "@/store/profileStore";

export interface ProfileData {
    avatar?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    bio?: string;
    tier?: string;
}

export const syncProfile = (data: ProfileData) => {
    // Local Storage
    if (data.avatar)
        localStorage.setItem("user_avatar", data.avatar);

    if (data.fullName)
        localStorage.setItem("user_name", data.fullName);

    if (data.email)
        localStorage.setItem("user_email", data.email);

    if (data.phone)
        localStorage.setItem("user_phone", data.phone);

    if (data.bio)
        localStorage.setItem("user_bio", data.bio);

    if (data.tier)
        localStorage.setItem("user_tier", data.tier);

    // Zustand Store
    useProfileStore.getState().updateProfile({
        avatar: data.avatar,
        fullName: data.fullName,
        email: data.email,
        tier: data.tier,
    });

    // Notify Entire App
    window.dispatchEvent(
        new CustomEvent("profileUpdated", {
            detail: data,
        })
    );
};

export const getProfile = () => {
    return {
        avatar:
            localStorage.getItem("user_avatar") ||
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500",

        fullName:
            localStorage.getItem("user_name") ||
            "Anuj Jha",

        email:
            localStorage.getItem("user_email") ||
            "anuj@example.com",

        phone:
            localStorage.getItem("user_phone") ||
            "",

        bio:
            localStorage.getItem("user_bio") ||
            "",

        tier:
            localStorage.getItem("user_tier") ||
            "Premium Pro",
    };
};

export const triggerProfileUpdate = () => {
    window.dispatchEvent(
        new CustomEvent("profileUpdated")
    );
};