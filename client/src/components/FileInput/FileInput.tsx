import React from "react";
import { ACCEPT_TYPE, getUploadData, preventAll } from "./utils";

type Props = {
  loading?: boolean
  onUpload(data: File): void;
};

export const FileInput: React.FC<Props> = ({ onUpload, loading }) => {
  const onFileUpload = React.useCallback(
    async (ev: React.ChangeEvent<HTMLInputElement>) => {
      preventAll(ev);
      const files = ev.target.files;
      if (!files) {
        return null;
      }
      const file = files[0];

      if (!file) {
        ev.target.value = null as any;
        return;
      }

      onUpload(file);
    },
    [onUpload, getUploadData]
  );

  return (
    <div className="flex w-full pt-9 flex-col items-center justify-center">
      <div className="text-white rounded-lg relative bg-slate-500 w-full max-w-xs py-6 text-lg hover:bg-slate-400 text-center">
        <input
          disabled={loading}
          className="absolute cursor-pointer inset-0 opacity-0"
          accept={ACCEPT_TYPE.join(",")}
          type="file"
          onChange={onFileUpload}
        />
        {loading ? 'LOADING' : 'UPLOAD PHOTO'}
      </div>
    </div>
  );
};
FileInput.displayName = "FileInput";
