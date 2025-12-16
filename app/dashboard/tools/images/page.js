import { getUserGeneratedImages } from "@/features/images/server/action-images";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ImageGenerator from "./image-generator";

import Image from "next/image";
import Link from "next/link";

export default async function GenerateImagePage() {
  const headersList = await headers()
  const session = await auth.api.getSession({ headers: headersList })
  const user = session?.user
  const generatedImages = user ? await getUserGeneratedImages(user?.id) : [];

  return (
    <div className="w-full p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Form */}
        <ImageGenerator />

        {/* Right Column - Recent Generations */}
        <div>
          <h3 className="text-sm text-gray-600 mb-4">Générations récentes</h3>
          <div className="space-y-4">
            {generatedImages.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm border border-dashed border-gray-200 rounded-lg">
                Aucune génération récente
              </div>
            ) : (
              generatedImages.map((gen) => (
                <Link
                  href={`/dashboard/tools/images/${gen.id}`}
                  key={gen.id}
                  className="block bg-white rounded-lg border border-gray-200 p-3 hover:border-blue-500 transition-colors group"
                >
                  <p className="text-xs text-gray-600 mb-2 line-clamp-1 font-medium group-hover:text-blue-600">
                    {gen.prompt}
                  </p>
                  <div className="grid grid-cols-2 gap-1 rounded-md overflow-hidden bg-gray-100">
                    {gen.images.slice(0, 4).map((imgUrl, i) => (
                      <div key={i} className="aspect-square relative">
                        <Image
                          src={imgUrl}
                          alt={`Generation ${i + 1}`}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
