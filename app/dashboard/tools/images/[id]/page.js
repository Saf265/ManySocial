import { db } from "@/db/drizzle";
import { ImagesGenerated } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import ImageGrid from "./components/ImageGrid";

export default async function ResultImagesPage({ params }) {
  const { id } = await params;

  const result = await db
    .select()
    .from(ImagesGenerated)
    .where(eq(ImagesGenerated.id, id))
    .limit(1);

  if (!result || result.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-900 font-medium mb-1">Images non trouvées</p>
          <p className="text-gray-500 text-sm">
            Cette génération n'existe pas ou a été supprimée
          </p>
        </div>
      </div>
    );
  }

  const imageData = result[0];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <ImageGrid images={imageData.images} prompt={imageData.prompt} />
    </div>
  );
}
