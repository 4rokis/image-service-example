import { Alert } from "@/components/Alert";
import { IMAGES_SIZES } from "@/components/constants";
import { FileInput } from "@/components/FileInput";
import { ImageCrop } from "@/components/ImageCrop";
import { Loader } from "@/components/Loader";
import { Modal } from "@/components/Modal";
import { Preview } from "@/components/Preview";
import { useImage } from "@/lib/useImage";
import { CropParams } from "@/types";
import { useCallback, useState } from "react";

export default function Home() {
  const { error, loading, image, editUploadedImage, uploadImage } =
    useImage();
  const [editImage, setEditImage] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<string | null>(null);
  const [data, setData] = useState<File | null>();

  const onUpload = useCallback(
    (data: File) => {
      setNewImage(URL.createObjectURL(data));
      setData(data);
    },
    [setEditImage]
  );

  const onEdit = useCallback(() => {
    setEditImage(image);
  }, [setEditImage, image]);

  const onNewClose = useCallback(() => {
    setNewImage((prev) => {
      if (prev?.startsWith("blob")) {
        URL.revokeObjectURL(prev) 
      }
      return null;
    });
  }, [setNewImage]);

  const onEditClose = useCallback(() => {
    setEditImage(null);
  }, [setEditImage]);

  const onNewCrop = useCallback(
    async (path: string, params: CropParams) => {
      if (!data) {
        throw new Error("New Image data not defined");
      }
      try {
        uploadImage(data, params);
      } finally {
        onNewClose();
        setData(null);
      }
    },
    [editUploadedImage, data]
  );

  const onEditCrop = useCallback(
    async (path: string, params: CropParams) => {
      try {
        editUploadedImage(path, params);
      } finally {
        onEditClose();
      }
    },
    [editUploadedImage]
  );

  return (
    <div className="mx-auto max-w-4xl py-5 px-4 sm:px-6 lg:px-8">
      <h1 className="my-4 w-full text-center text-2xl text-gray-900">
        Image service
      </h1>
      <FileInput onUpload={onUpload} />
      {error && (
        <Alert red title={error.message}>
          {error.description}
        </Alert>
      )}
      {image && !loading && (
        <>
          <div className="flex w-full flex-col items-center justify-center pt-9">
            <button
              onClick={onEdit}
              className="inline-flex items-center justify-between rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-500"
            >
              EDIT
            </button>
          </div>
          <div className="relative mt-10 flex w-full flex-col items-center justify-center gap-1">
            {IMAGES_SIZES.map((size) => (
              <div key={size}>
                <h2 className="my-4 w-full text-center text-xl text-gray-900">
                  {size}px
                </h2>
                <Preview src={image} sizes={`${size}px`} />
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
          <ImageCrop image={editImage} aspect={1} onSave={onEditCrop} />
        )}
      </Modal>
      <Modal onClose={onNewClose} open={Boolean(newImage)}>
        {newImage && (
          <ImageCrop image={newImage} aspect={1} onSave={onNewCrop} />
        )}
      </Modal>
    </div>
  );
}
