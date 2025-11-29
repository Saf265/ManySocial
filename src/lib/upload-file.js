"use server"
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";

// upload file vercel blob
export const uploadFile = async (file) => {
  const randomId = nanoid();
  const { url } = await put(`file-${randomId}`, file, {
    access: 'public',
    addRandomSuffix: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return url;
}