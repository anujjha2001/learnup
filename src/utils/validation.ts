import { z } from "zod";

export const profileSchema = z.object({
    fullName: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone must be at least 10 digits"),
    bio: z.string().max(200, "Bio cannot exceed 200 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    course: z.string().min(1, "Course is required"),
    semester: z.string().min(1),
    college: z.string().min(1),
    department: z.string().min(1),
    location: z.string(),
    website: z.string().url("Invalid URL").optional().or(z.literal("")),
    github: z.string(),
    linkedin: z.string(),
    portfolio: z.string(),
    language: z.string(),
    theme: z.string(),
    notifications: z.boolean(),
    darkMode: z.boolean(),
    tier: z.string(),
    avatar: z.string(),
    password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
}).refine((data) => {
    if (data.password && data.password.trim() !== "") {
        return data.password === data.confirmPassword;
    }
    return true;
}, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type ProfileForm = z.infer<typeof profileSchema>;