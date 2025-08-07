"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { deleteImage } from "~/server/queries";

export function DeleteButton({ idAsNumber }: { idAsNumber: number }) {
  const router = useRouter();

  async function handleDelete() {
    try {
      await deleteImage(idAsNumber);
      router.push("/"); // Redirect to the home page after deletion
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  }
  return (
    <Button type="button" onClick={handleDelete} className="cursor-pointer">
      Delete
    </Button>
  );
}
