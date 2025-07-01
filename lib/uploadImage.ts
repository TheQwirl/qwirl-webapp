export async function uploadImage(file: File): Promise<string> {
  console.log(file);
  return new Promise(() => "sdijsidj");
  //   try {
  //     const response = await upload(file.name, file, {
  //       access: "public",
  //       handleUploadUrl: "/api/upload",
  //     });
  //     return response.url;
  //   } catch (error) {
  //     console.error("Upload failed:", error);
  //     throw error;
  //   }
}
