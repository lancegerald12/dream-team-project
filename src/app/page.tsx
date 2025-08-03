import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { UploadButton } from "~/utils/uploadthing";
import { UploadDialog } from "./_components/upload-dialog";

async function Images() {
  const mockUrls = [
    "https://c4.wallpaperflare.com/wallpaper/386/230/403/jujutsu-kaisen-satoru-gojo-blood-white-hair-blue-eyes-hd-wallpaper-preview.jpg",
    "https://butwhytho.net/wp-content/uploads/2023/09/Gojo-Jujutsu-Kaisen-But-Why-Tho-2.jpg",
    "https://houcz8619o.ufs.sh/f/P4e3m1WqaJbzaMU5Q6qRQ36dkYVsB7XvmKLzean1oj9Fh0M5",
    "https://houcz8619o.ufs.sh/f/P4e3m1WqaJbzCKXDzQufka89HuDnAwzmTegZqELvOdGWyljr",
  ];

  const images = mockUrls.map((url, index) => ({
    id: index,
    url: url,
  }));

  return (
    <div>
      <div className="flex justify-end p-4">
        <UploadDialog />
      </div>
      <div className="flex flex-wrap justify-center gap-6 p-4">
        {images.map((image) => (
          <div key={image.id} className="flex w-64 flex-col">
            <div className="relative aspect-video bg-zinc-900">
              <img
                src={image.url}
                alt={`Image ${image.id}`}
                className="h-full w-full object-contain object-top"
              />
            </div>
            <div className="text-center">{image.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="">
      <SignedOut>
        <div className="h-full w-full text-center text-2xl">
          Please sign in above to continue!
        </div>
      </SignedOut>
      <SignedIn>
        <div className="h-full w-full text-center text-2xl">
          Welcome back!
          <Images />
        </div>
      </SignedIn>
    </main>
  );
}
