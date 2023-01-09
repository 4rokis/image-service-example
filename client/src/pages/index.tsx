import { FileInput } from "@/components/FileInput";
import { ImageCrop } from "@/components/ImageCrop";
import { Modal } from "@/components/Modal";
import { Preview } from "@/components/Preview";
import { uploadImage } from "@/lib/uploadImage";
import { useEffect, useState } from "react";

export const SIZES = [160, 320, 640, 750, 828];

export const getFileName = (path: string) => {
  const pathParts = path.split("/");
  const filename = pathParts[pathParts.length - 1];
  return filename.split(".")[0];
};

export default function Home() {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string>("");
  const [data, setData] = useState<File>();

  useEffect(() => {
    (async () => {
      if (!data) {
        return;
      }
      try {
        setLoading(true);
        await uploadImage("", data);
        setImage(`http://localhost:8080/${getFileName(data.name)}.webp`);
      } finally {
        setLoading(false);
      }
    })();
  }, [data]);

  return (
    <div className="h-screen w-screen">
      <FileInput loading={loading} onUpload={setData} />
      {image && !loading && (
        <>
          <div className="flex w-full flex-col items-center justify-center pt-9">
            <button
              onClick={() => setOpen(true)}
              className="relative mx-auto w-full max-w-xs rounded-lg bg-blue-500 py-6 text-center text-lg text-white hover:bg-blue-400"
            >
              EDIT
            </button>
          </div>
          <div className="relative mt-10 flex w-full flex-col items-center justify-center gap-1">
            {SIZES.map((size) => (
              <Preview key={size} src={image} sizes={`${size}px`} />
            ))}
          </div>
        </>
      )}

      <Modal setOpen={setOpen} open={open}>
        <ImageCrop image={image} aspect={1} onSave={setImage} />
      </Modal>
    </div>
  );
}
