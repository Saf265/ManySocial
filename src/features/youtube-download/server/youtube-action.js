"use server"

import { uploadFile } from "@/lib/upload-file"

export const handleDonwloadFormat= async (url)=>{
      const response = await fetch(url)
      const blob = await response.blob()

      const stockedId = await uploadFile(blob)
      // first 40 blob
      console.log(blob)
      return stockedId

    }