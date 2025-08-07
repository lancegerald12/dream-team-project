"use server";

import "server-only";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { images } from "./db/schema";
import { and, desc, eq, or } from "drizzle-orm";
import { utapi } from "./uploadthing";
import { symbol } from "zod";

export async function getMyImages() {
  const user = await auth();

  if (!user?.userId) throw new Error("invalid userID");

  const images = await db.query.images.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
    orderBy: (model, { desc }) => desc(model.id),
  });

  return images;
}
export async function deleteImage(id: number) {
  const user = await auth();

  if (!user?.userId) throw new Error("Unauthorized");

  const image = await db.query.images.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!image) throw new Error("Image not found");

  if (image.userId !== user.userId) {
    throw new Error("You do not have permission to delete this image");
  }

  const fileKey = image.imageUrl?.split("/").pop();
  if (!fileKey) throw new Error("Invalid File Key");

  await utapi.deleteFiles(fileKey);

  await db
    .delete(images)
    .where(and(eq(images.id, id), eq(images.userId, user.userId)));
}
