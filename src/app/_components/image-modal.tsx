"use client";

import { useUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs/server";
// import { Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { DeleteButton } from "./delete-button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { toast } from "sonner";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useUploadThing } from "~/utils/uploadthing";
// import { UpdateButton } from "./update-button";

interface ImageModalProps {
  image: {
    id: number;
    fileName: string | null;
    imageName: string | null;
    imageUrl: string;
    userId: string;
    createdAt: Date;
    imageDescription: string | null;
  };
  children: React.ReactNode;
  onUpdate?: () => void; // Callback for when image is updated
}

export function ImageModal({ image, children, onUpdate }: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [uploaderInfo, setUploaderInfo] = useState<{ fullName: string } | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    imageName: image.imageName || "",
    imageDescription: image.imageDescription || "",
  });
  const { user } = useUser();

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !uploaderInfo) {
      setIsLoading(true);
      fetch(`/api/user/${image.userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) throw new Error(data.error);
          setUploaderInfo({ fullName: data.fullName });
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching uploader info:", error);
          setUploaderInfo({ fullName: "Unknown" });
          setIsLoading(false);
        });
    }
  }, [isOpen, uploaderInfo, image.userId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const { startUpload } = useUploadThing("imageUploader");

  const handleSave = async () => {
    try {
      setIsLoading(true);

      let imageUrl = image.imageUrl;

      // If a new file was selected
      if (selectedFile) {
        const uploadResponse = await startUpload([selectedFile], {
          imageName: formValues.imageName,
          imageDescription: formValues.imageDescription,
        });

        if (!uploadResponse?.[0]?.url) {
          throw new Error("Upload failed");
        }

        imageUrl = uploadResponse[0].url;
      }

      // Update the image metadata
      const updateResponse = await fetch(`/api/images/${image.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageName: formValues.imageName,
          imageDescription: formValues.imageDescription,
          imageUrl,
        }),
      });

      if (!updateResponse.ok) throw new Error("Failed to update image");

      setIsEditMode(false);
      if (onUpdate) onUpdate();
      toast.success("Image updated successfully!");
    } catch (error) {
      console.error("Error updating image:", error);
      toast.error("Failed to update image");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {children}
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="min-h-[90vh] min-w-[90vw] overflow-hidden p-0">
          <div className="flex h-full flex-col md:flex-row">
            {/* Image container */}
            <div className="flex flex-1 items-center justify-center bg-gray-600 p-4">
              {isEditMode && previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <img
                  src={image.imageUrl}
                  alt={String(image.id)}
                  className="max-h-full max-w-full object-contain"
                />
              )}

              {isEditMode && (
                <div className="absolute bottom-4 left-4">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change Image
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* Details container */}
            <div className="flex w-full flex-col md:w-80">
              <DialogHeader className="border-b p-4">
                <DialogTitle className="text-center">
                  {isEditMode ? (
                    <Input
                      name="imageName"
                      value={formValues.imageName}
                      onChange={handleInputChange}
                      placeholder="Image name"
                    />
                  ) : (
                    image.imageName || image.fileName
                  )}
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-1 flex-col space-y-4 p-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-black">
                    Uploaded By:
                  </span>
                  <span>
                    {isLoading ? "Loading..." : uploaderInfo?.fullName}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-black">
                    Created At:
                  </span>
                  <span>{new Date(image.createdAt).toLocaleString()}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-black">
                    Description:
                  </span>
                  {isEditMode ? (
                    <Textarea
                      name="imageDescription"
                      value={formValues.imageDescription}
                      onChange={handleInputChange}
                      placeholder="Image description"
                      rows={4}
                    />
                  ) : (
                    <span className="whitespace-pre-line">
                      {image.imageDescription || "No description"}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  {user?.id === image.userId && (
                    <>
                      {isEditMode ? (
                        <>
                          <Button onClick={handleSave} disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsEditMode(false)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => setIsEditMode(true)}
                        >
                          Edit
                        </Button>
                      )}
                    </>
                  )}

                  {!isEditMode && user?.id === image.userId && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to delete this image?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete this image and remove it from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <DeleteButton idAsNumber={image.id} />
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
