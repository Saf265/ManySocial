"use server"

import { ImagesGenerated } from "@/db/drizzle/schema"

// get GeneratedImage from ID
export async function getGeneratedImage(id) {
  //drizzle
  const data = await db
    .select()
    .from(ImagesGenerated)
    .where(eq(ImagesGenerated.id, id))
    .limit(1)

  return data[0]
}
