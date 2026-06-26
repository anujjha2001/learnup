import { create } from "zustand";

interface ProfileState {
    avatar: string;
    fullName: string;
    email: string;
    tier: string;

    updateProfile: (
        data: Partial<ProfileState>
    ) => void;

    loadProfile: () => void;
}

export const useProfileStore =
    create<ProfileState>((set) => ({
        avatar:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500",

        fullName: "Anuj Jha",

        email: "anuj@example.com",

        tier: "Premium Pro",

        updateProfile: (data) =>
            set((state) => ({
                ...state,
                ...data,
            })),

        loadProfile: () => {
            set({
                avatar:
                    localStorage.getItem("user_avatar") ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500",

                fullName:
                    localStorage.getItem("user_name") ||
                    "Anuj Jha",

                email:
                    localStorage.getItem("user_email") ||
                    "anuj@example.com",

                tier:
                    localStorage.getItem("user_tier") ||
                    "Premium Pro",
            });
        },
    }));