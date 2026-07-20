import ImageKit from "imagekit";

const publicFolder = "laraspinnal";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
});

export async function uploadImageToImageKit(
  fileBuffer: Buffer,
  fileName: string,
  folder = publicFolder
): Promise<{ url: string; fileId: string }> {
  try {
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: fileName,
      folder: folder,
    });
    return {
      url: response.url,
      fileId: response.fileId,
    };
  } catch (error) {
    console.error("ImageKit upload error:", error);
    throw new Error("Failed to upload image to ImageKit");
  }
}

export async function deleteImageFromImageKit(fileId: string): Promise<void> {
  try {
    await imagekit.deleteFile(fileId);
  } catch (error) {
    console.error("ImageKit delete error:", error);
  }
}

/**
 * Deletes an uploaded file from ImageKit given its public URL rather than a
 * fileId. The upload response's fileId isn't persisted anywhere (only the
 * URL is stored, on products/categories/banners/orders), so removal flows
 * only ever have the URL to work with — this looks the file up by name first.
 * Silently no-ops for URLs that aren't hosted on this ImageKit account
 * (e.g. a manually pasted external image URL), or if no match is found.
 */
export async function deleteImageByUrl(url: string): Promise<void> {
  try {
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || "";
    if (!url || !urlEndpoint || !url.startsWith(urlEndpoint)) return;

    const fileName = decodeURIComponent(url.split("/").pop()?.split("?")[0] || "");
    if (!fileName) return;

    const matches = await imagekit.listFiles({ name: fileName, limit: 5 });
    const match = matches.find((f: any) => f.url === url) || matches[0];

    if (match && "fileId" in match) {
      await imagekit.deleteFile(match.fileId);
    }
  } catch (error) {
    console.error("ImageKit delete-by-url error:", error);
  }
}

export default imagekit;
