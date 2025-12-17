import VideoGenerationStatus from "./VideoGenerationStatus";

export default async function VideoWaitingPage({ params }) {
  const { id } = await params;
  console.log(id);

  // const [job] = await db.select().from(VideosGenerated).where(eq(VideosGenerated.id, id));

  return <VideoGenerationStatus jobId={id} />;
}
