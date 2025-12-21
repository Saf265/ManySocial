import { db } from "@/db/drizzle";
import {
  ImagesGenerated,
  VideosGenerated,
  VocalEnhancerGenerated,
  VocalRemoverGenerated,
  VoicesGenerated
} from "@/db/drizzle/schema";
import { auth } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ProjectsContent from "./ProjectsContent";

export const metadata = {
  title: "Mes Projets | ManySocial AI",
  description: "Gérez et visualisez toutes vos créations générées par l'IA",
};

export default async function ProjectsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch all generated content
  const [images, voices, enhancers, videos, removers] = await Promise.all([
    db.select().from(ImagesGenerated).where(eq(ImagesGenerated.userId, userId)).orderBy(desc(ImagesGenerated.createdAt)),
    db.select().from(VoicesGenerated).where(eq(VoicesGenerated.userId, userId)).orderBy(desc(VoicesGenerated.createdAt)),
    db.select().from(VocalEnhancerGenerated).where(eq(VocalEnhancerGenerated.userId, userId)).orderBy(desc(VocalEnhancerGenerated.createdAt)),
    db.select().from(VideosGenerated).where(eq(VideosGenerated.userId, userId)).orderBy(desc(VideosGenerated.createdAt)),
    db.select().from(VocalRemoverGenerated).where(eq(VocalRemoverGenerated.userId, userId)).orderBy(desc(VocalRemoverGenerated.createdAt)),
  ]);

  // Normalize data for the list
  const allProjects = [
    ...images.flatMap(item => (item.images || []).map((img, idx) => ({
      id: `${item.id}-${idx}`,
      type: "image",
      title: item.prompt,
      createdAt: item.createdAt,
      preview: img,
      url: img,
      raw: item
    }))),
    ...voices.map(item => ({
      id: item.id,
      type: "voice",
      title: item.title,
      createdAt: item.createdAt,
      preview: null,
      url: item.audioURL,
      raw: item
    })),
    ...enhancers.map(item => ({
      id: item.id,
      type: "enhancer",
      title: item.fileName,
      createdAt: item.createdAt,
      preview: null,
      url: item.fileURL,
      raw: item
    })),
    ...videos.map(item => ({
      id: item.id,
      type: "video",
      title: item.prompt || "Vidéo générée",
      createdAt: item.createdAt,
      preview: item.videoURL,
      url: item.videoURL,
      raw: item
    })),
    ...removers.map(item => ({
      id: item.id,
      type: "remover",
      title: item.fileName,
      createdAt: item.createdAt,
      preview: null,
      url: item.blobURL,
      raw: item
    })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return <ProjectsContent initialProjects={allProjects} />;
}
