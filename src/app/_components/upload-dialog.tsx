"use client";

import { toast } from "sonner";
import { UploadButton } from "~/utils/uploadthing";

export function UploadDialog() {
  return (
    <UploadButton
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        // Do something with the response
        console.log("Files: ", res);
        // alert("Upload Completed");
        toast.success("Upload Complete");
      }}
      onUploadError={(error: Error) => {
        // Do something with the error.
        // alert(`ERROR! ${error.message}`);
        toast.error(`ERROR! ${error.message}`);
      }}
    />
  );
}
