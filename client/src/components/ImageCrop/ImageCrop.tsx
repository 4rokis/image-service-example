import React from "react";
import Cropper from "react-easy-crop";
import queryString from "query-string";
import {
  PlusIcon,
  MinusIcon,
  ArrowUturnRightIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/20/solid";

import {
  Crop,
  MAX_ZOOM,
  MIN_ZOOM,
  ROTATE_ANGLE,
  ZOOM_STEP,
} from "./ImageCropUtils";

type Props = {
  aspect: number;
  image: string;
  onSave(value: string): void;
};

export const ImageCrop: React.FC<Props> = ({
  image,
  aspect,
  onSave,
}) => {
  const [loadedImage, setLoadedImage] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [originalImage, urlParams] = image.split("?");
  const croppedAreaPixels = React.useRef({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [params, setParams] = React.useState({
    x: 0,
    y: 0,
    zoom: 1,
    rotate: 0,
  });

  const onCropComplete = React.useCallback(
    async (_: any, crop: Crop) => {
      croppedAreaPixels.current = crop;
    },
    [image]
  );

  React.useEffect(() => {
    const {
      rotate = 0,
      zoom = 1,
      x = 0,
      y = 0,
    } = queryString.parse(urlParams) || {};
    setParams({
      x: Number(x),
      y: Number(y),
      zoom: Number(zoom),
      rotate: Number(rotate),
    });
  }, [image]);

  const onCrop = async () => {
    setLoading(true);
  };

  React.useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setLoadedImage(originalImage);
    };
    img.src = originalImage;
  }, [originalImage]);

  const upload = async () => {
    if (!croppedAreaPixels.current) {
      throw new Error("Crop data should be present");
    }
    const [key] = image.split("?");
    const { x, y, width, height } = croppedAreaPixels.current;
    const { x: cropX, y: cropY } = params;
    onSave(
      `${key}?${queryString.stringify({
        rotate: rotate,
        zoom: zoom,
        left: x,
        top: y,
        x: cropX,
        y: cropY,
        width,
        height,
      })}`
    );
  };

  React.useEffect(() => {
    if (loading) {
      upload();
    }
  }, [loading]);

  const rotateRight = () => {
    setParams(({ rotate, ...rest }) => ({
      ...rest,
      rotate: rotate + ROTATE_ANGLE,
    }));
  };

  const rotateLeft = () => {
    setParams(({ rotate, ...rest }) => ({
      ...rest,
      rotate: rotate - ROTATE_ANGLE,
    }));
  };

  const zoomOut = () => {
    setParams(({ zoom, ...rest }) => ({
      ...rest,
      zoom: Math.max(zoom - ZOOM_STEP, MIN_ZOOM),
    }));
  };

  const zoomIn = () => {
    setParams(({ zoom, ...rest }) => ({
      ...rest,
      zoom: Math.min(zoom + ZOOM_STEP, MAX_ZOOM),
    }));
  };
  const setZoom = (newZoom: number) => {
    setParams(({ ...rest }) => ({
      ...rest,
      zoom: newZoom,
    }));
  };

  const setCrop = ({ x: newX, y: newY }: { x: number; y: number }) => {
    setParams(({ ...rest }) => ({
      ...rest,
      x: newX,
      y: newY,
    }));
  };

  const { zoom, rotate, ...crop } = params;

  return (
    <div className="relative flex h-full w-full">
      <div className="relative h-full w-full flex-none">
        <Cropper
          image={loadedImage}
          crop={crop}
          zoom={zoom}
          objectFit="horizontal-cover"
          rotation={rotate}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          aspect={aspect}
          restrictPosition={false}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className="absolute bottom-5 left-1/2 flex w-full max-w-xs -translate-x-1/2 justify-between px-4">
        <button
          type="button"
          onClick={zoomOut}
          className="inline-flex items-center rounded-full border border-transparent bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <MinusIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={rotateLeft}
          className="inline-flex items-center rounded-full border border-transparent bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <ArrowUturnLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="submit"
          onClick={onCrop}
          className="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Crop
        </button>
        <button
          type="button"
          onClick={rotateRight}
          className="inline-flex items-center rounded-full border border-transparent bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <ArrowUturnRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={zoomIn}
          className="inline-flex items-center rounded-full border border-transparent bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <PlusIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
