"use client";

import { useCallback, useEffect, useState } from "react";

export const ACCEPT_TYPE = ["image/x-png", "image/jpeg", "image/png"];

export const getUploadData = (
  ev: React.ChangeEvent<HTMLInputElement>
): File | null => {
  const files = ev.target.files;
  if (!files) {
    return null;
  }
  return files[0];
};

export const uploadImageData = async (
  url: string,
  data: File
): Promise<boolean> => {
  const form_data = new FormData(); // Creating object of FormData class
  form_data.append("file", data) // Appending parameter named file with properties of file_field to form_data
  return await fetch(url, {
    method: "PUT",
    headers: {},
    body: form_data,
  })
    .then(async (res) => {
      if (res.status >= 400) {
        console.error(`[${res.status}] ${res.statusText}`);
        return false;
      }
      return true;
    })
    .catch((e) => {
      console.error(e);
      return false;
    });
};

export const Input: React.FC = () => {
  const [data, setData] = useState<File>();
  const onFileUpload = useCallback(
    async (ev: React.ChangeEvent<HTMLInputElement>) => {
      ev.preventDefault();

      const data = await getUploadData(ev);
      if (data) {
        setData(data);
      }
    },
    [getUploadData]
  );

  const upload = useCallback(async () => {
    if (data) {
      await uploadImageData("http://localhost:8080/api/upload?left=100&top=100&width=900&height=900&rotate=0", data);
      setData(data);
    }
  }, [data]);
  return (
    <>
      <input
        accept={ACCEPT_TYPE.join(",")}
        type="file"
        onChange={onFileUpload}
      />
      <button type="button" onClick={upload}>
        Upload
      </button>
    </>
  );
};
