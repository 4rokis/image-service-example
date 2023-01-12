import { FileInput } from "@/components/FileInput";
import { ImageCrop } from "@/components/ImageCrop";
import { Loader } from "@/components/Loader";
import { Modal } from "@/components/Modal";
import { Preview } from "@/components/Preview";
import { createImageURL, destroyImageURL } from "@/lib/createImageURL";
import { uploadImage } from "@/lib/uploadImage";
import { useCallback, useState } from "react";

export const SIZES = [160, 320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string>("");
  const [editImage, setEditImage] = useState<string | null>(null);
  const [data, setData] = useState<File>();

  const onUpload = useCallback(
    (data: File) => {
      setEditImage(createImageURL(data));
      setData(data);
    },
    [setEditImage]
  );

  const onEditClose = useCallback(() => {
    setEditImage((prev) => {
      if (prev?.startsWith("blog")) {
        destroyImageURL(prev);
      }
      return null;
    });
  }, [setEditImage]);

  const onCrop = useCallback(
    async (paramsQuery: string) => {
      if (!data) {
        throw new Error("File data not defined");
      }
      try {
        setLoading(true);
        onEditClose();
        const url = await uploadImage(paramsQuery, data);
        if (!url) {
          throw new Error('Upload failed')
        }
        setImage(url);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [setImage, uploadImage, data]
  );

  return (
    <div className="mx-auto max-w-4xl py-5 px-4 sm:px-6 lg:px-8">
      <h1 className="my-4 w-full text-center text-2xl text-gray-900">
        Image service
      </h1>
      <FileInput onUpload={onUpload} />
      {image && !loading && (
        <>
          <div className="flex w-full flex-col items-center justify-center pt-9">
            {/* <button
              onClick={() => setOpen(true)}
              className="relative mx-auto w-full max-w-xs rounded-lg bg-blue-500 py-6 text-center text-lg text-white hover:bg-blue-400"
            >
              EDIT
            </button> */}
          </div>
          <div className="relative mt-10 flex w-full flex-col items-center justify-center gap-1">
            {SIZES.map((size) => (
              <div>
                <h2 className="my-4 w-full text-center text-xl text-gray-900">
                  {size}px
                </h2>
                <Preview key={size} src={image} sizes={`${size}px`} />
              </div>
            ))}
          </div>
        </>
      )}
      {loading && (
        <div className="fixed left-0 top-0 flex h-screen w-screen items-center justify-center bg-slate-800/30">
          <Loader color="bg-white" />
        </div>
      )}

      <Modal onClose={onEditClose} open={Boolean(editImage)}>
        {editImage && (
          <ImageCrop image={editImage} aspect={1} onSave={onCrop} />
        )}
      </Modal>
    </div>
  );
}
