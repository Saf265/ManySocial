import { getVoicesGeneratedByUserId } from "@/features/voiceovers/server/voiceovers-action";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import VoiceGenerator from "./voice-generator";

export const metadata = {
  title: "Générateur de Voix IA - ManySocial",
  description: "Transformez vos textes en voix off naturelles avec l'IA",
};

export default async function VoiceoversPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  const voicesGenerated = await getVoicesGeneratedByUserId(session?.user?.id);
  
  return (
    <VoiceGenerator   initialVoiceovers={voicesGenerated} />
  );
}
  