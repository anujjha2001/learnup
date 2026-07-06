import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

export async function uploadCertificatePDF(fileName: string, buffer: Buffer): Promise<string> {
  const bucket = "certificates";

  if (isSupabaseConfigured()) {
    try {
      // Check if bucket exists, or just attempt upload
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, buffer, {
          contentType: "application/pdf",
          upsert: true,
        });

      if (error) {
        console.error("Supabase storage error for certificates:", error);
        throw error;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.warn("Failed to upload to Supabase bucket 'certificates', falling back to local storage:", err);
    }
  }

  // Local fallback: write to public/certificates directory
  const uploadDir = join(process.cwd(), "public", "certificates");
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }
  
  const filePath = join(uploadDir, fileName);
  writeFileSync(filePath, buffer);

  return `/certificates/${fileName}`;
}
