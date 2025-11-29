
import { db } from "@/db/drizzle";
import { VoicesGenerated } from "@/db/drizzle/schema";
import ResultPage from "@/features/voiceovers/components/ResultPage";
import { eq } from "drizzle-orm";

export default async function VoiceoverResultPage({ params }) {
  const { id } = await params
  const data = await db.select().from(VoicesGenerated).where(eq(VoicesGenerated.id, id))
  const voiceoverData = data[0].audioURL

  return (
    <div><ResultPage voiceURL={voiceoverData} /></div>
  )

}
