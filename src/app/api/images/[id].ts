import { db } from "~/server/db";
import { images } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const { imageName, imageDescription, imageUrl } = req.body;

      await db
        .update(images)
        .set({
          imageName,
          imageDescription,
          imageUrl,
          updatedAt: new Date(),
        })
        .where(eq(images.id, Number(id)));

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error updating image:", error);
      res.status(500).json({ error: "Failed to update image" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
