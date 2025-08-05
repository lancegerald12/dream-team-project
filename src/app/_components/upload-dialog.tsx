"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UploadButton } from "~/utils/uploadthing";

export function UploadDialog() {
  const router = useRouter();

  return (
    <UploadButton
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        // Do something with the response
        console.log("Files: ", res);
        // alert("Upload Completed");
        toast.success("Upload Complete");
        router.refresh(); // Refresh the page to show the new images
      }}
      onUploadError={(error: Error) => {
        // Do something with the error.
        // alert(`ERROR! ${error.message}`);
        toast.error(`ERROR! ${error.message}`);
      }}
    />
  );
}
