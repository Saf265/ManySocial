"use server"

import { db } from "@/db/drizzle";
import { VoicesGenerated } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";

export const getVoicesGeneratedByUserId = async (userId) => {
  if (!userId) {
    return [];
  }

  const voicesGenerated = await db.select().from(VoicesGenerated).where(eq(VoicesGenerated.userId, userId));
    
  return voicesGenerated;
}