import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useProfileStore } from "@/store/profileStore";

export const useProfile = () => {
    const { watch, setValue } = useFormContext();
    const updateStore = useProfileStore((state) => state.updateProfile);

    const values = watch();

    useEffect(() => {
        updateStore({
            avatar: values.avatar,
            fullName: values.fullName,
            email: values.email,
            tier: values.tier,
        });
    }, [values, updateStore]);

    return { values, setValue };
};