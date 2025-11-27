"use client";

import { Download } from "lucide-react";
import { useState } from "react";

export default function ImageGrid({ images, prompt }) {
  const [downloading, setDownloading] = useState(null);
  const [downloadingAll, setDownloadingAll] = useState(false);

  const downloadImage = async (url, index) => {
    setDownloading(index);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `image-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      setDownloading(null);
    }
  };

  const downloadAll = async () => {
    setDownloadingAll(true);
    try {
      for (let i = 0; i < images.length; i++) {
        await downloadImage(images[i], i);
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } finally {
      setDownloadingAll(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-gray-900">Images générées</h1>
          <p className="text-sm text-gray-500 mt-0.5 truncate">{prompt}</p>
        </div>
        <button
          onClick={downloadAll}
          disabled={downloadingAll}
          className="flex items-center gap-2 px-3 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors text-sm font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={16} className={downloadingAll ? "animate-bounce" : ""} />
          {downloadingAll ? "Téléchargement..." : "Tout télécharger"}
        </button>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 mt-8 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
        {images.map((imageUrl, index) => (
          <div
            key={index}
            className="relative group bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
            style={{ aspectRatio: '1/1' }}
          >
            <img
              src={imageUrl}
              alt={`Generated image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <button
                onClick={() => downloadImage(imageUrl, index)}
                disabled={downloading === index}
                className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 bg-white text-gray-900 rounded-md hover:bg-gray-100 flex items-center gap-1.5 text-xs font-medium disabled:opacity-50"
              >
                <Download size={14} />
                {downloading === index ? "..." : "Télécharger"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
