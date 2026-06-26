export const validateImage = (file: File): boolean => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    return file.size < 5 * 1024 * 1024 && validTypes.includes(file.type);
};

export const getImagePreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};