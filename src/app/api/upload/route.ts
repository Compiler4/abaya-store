import cloudinary from "@/lib/cloudinary";
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const uploadRes = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: "products" },
        (
          err?: UploadApiErrorResponse,
          result?: UploadApiResponse
        ) => {
          if (err) return reject(err);
          if (!result) return reject(new Error("Upload failed"));
          resolve(result);
        }
      )
      .end(buffer);
  });

  return Response.json(uploadRes);
}