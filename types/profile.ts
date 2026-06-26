export interface ProfileForm {
    // Basic Profile
    fullName: string;
    username: string;
    email: string;
    phone: string;
    bio: string;
    avatar: string;

    // Academic Info
    course: string;
    semester: string;
    college: string;
    department: string;
    location: string;

    // Social Links
    website: string;
    github: string;
    linkedin: string;
    portfolio: string;

    // Preferences
    language: string;
    theme: string;
    notifications: boolean;
    darkMode: boolean;

    // Membership
    tier: string;

    // Security
    twoFactorEnabled: boolean;

    // Learning Statistics
    completedCourses: number;
    certificates: number;
    learningHours: number;
    xpPoints: number;

    // Optional Password Fields
    newPassword?: string;
    confirmPassword?: string;
}