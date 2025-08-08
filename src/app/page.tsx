// import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { UploadButton } from "~/utils/uploadthing";
import { UploadDialog } from "./_components/upload-dialog";
import { ImageModal } from "./_components/image-modal";
import { SignedIn, SignedOut } from "@clerk/nextjs";
const { getMyImages } = await import("~/server/queries");

export const dynamic = "force-dynamic";

async function Images() {
  const images = await getMyImages();

  return (
    <div>
      <div className="p4 flex justify-end">
        <UploadDialog />
      </div>
      <div className="flex flex-wrap justify-center gap-6 p-6">
        {images.map((image) => (
          <div
            key={image.id}
            className="w-64 overflow-hidden rounded-2xl shadow-md transition-transform duration-300 hover:scale-105"
          >
            <ImageModal image={image}>
              <div className="relative aspect-video bg-white">
                <img
                  src={image.imageUrl}
                  alt={`Image ${image.id}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </ImageModal>
            <div className="bg-gray-400 p-3 text-center">
              <p className="text-sm font-medium text-white">
                {image.imageName || image.fileName}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function HomePage() {
  return (
    <main className="">
      <SignedOut>
        <div className="h-full w-full text-center text-2xl">
          Please log in to access our movie collection.
        </div>
      </SignedOut>
      <SignedIn>
        <div className="h-full w-full text-center text-2xl">
          Top picks Movies
          <Images />
        </div>
      </SignedIn>
    </main>
  );
}
