import Sharp from "sharp";
import { CropParams, Params } from "@/lib/types";
import { Storage } from "@/lib/storage/Storage";
import {
  CACHE_DIR,
  getParamsURLPath,
  getTransformations,
  isDefined,
  rotated0,
} from "../utils";

export class ImageService {
  storage: Storage;
  params: Params;
  image!: Sharp.Sharp;
  metadata!: Sharp.Metadata;

  constructor(storage: Storage, params: Params) {
    this.storage = storage;
    this.params = params;
  }

  correctRotation = async () => {
    const orientation = this.metadata.orientation || 1;

    if (orientation === 6) {
      this.image = Sharp(await this.image.rotate(90).toBuffer());
      return;
    }

    if (orientation === 8) {
      this.image = Sharp(await this.image.rotate(-90).toBuffer());
      return;
    }

    if (orientation === 3) {
      this.image = Sharp(await this.image.rotate(180).toBuffer());
      return;
    }
  };

  getCropData = () => {
    const {
      left: x,
      top: y,
      width,
      height,
      rotate: rawRotate,
    } = this.params as CropParams;
    const metaWidth = this.metadata.width as number;
    const metaHeight = this.metadata.height as number;
    const rotate = Math.abs(rawRotate % 360);
    const isRotated = rotate % 90 === 0 && rotate !== 0 && rotate !== 180;
    const rotatedBase = rotated0(metaHeight, metaWidth);
    const [left, top] = isRotated
      ? [x - rotatedBase[0], y - rotatedBase[1]]
      : [x, y];
    const trueLeft = left < 0 ? 0 : left;
    const trueTop = top < 0 ? 0 : top;
    let trueWidth = width;
    if (left < 0) {
      trueWidth = width + left;
    } else if (width + left > metaWidth) {
      trueWidth = metaWidth - trueLeft;
    }

    let trueHeight = height;
    if (top < 0) {
      trueHeight = height + top;
    } else if (height + trueTop > metaHeight) {
      trueHeight = metaHeight - trueTop;
    }
    trueHeight = Math.min(trueHeight, metaHeight);
    trueWidth = Math.min(trueWidth, metaWidth);

    const withBG =
      trueLeft !== left ||
      trueTop !== top ||
      trueWidth !== width ||
      trueHeight !== height;
    return {
      originLeft: Math.round(left),
      originTop: Math.round(top),
      left: Math.round(trueLeft),
      top: Math.round(trueTop),
      width: Math.round(trueWidth),
      height: Math.round(trueHeight),
      withBG,
    };
  };

  compositeWithBg = async ({ width, height, left: x, top: y }: CropParams) => {
    const cropData = await this.image.jpeg().toBuffer();
    const bg = Sharp(
      await Sharp(await Sharp(cropData).resize(10, 10).toBuffer())
        .resize(width, height)
        .toBuffer()
    );
    return Sharp(
      await bg
        .composite([
          {
            input: cropData,
            left: x < 0 ? Math.abs(x) : 0,
            top: y < 0 ? Math.abs(y) : 0,
          },
        ])
        .jpeg()
        .toBuffer()
    );
  };

  isCropped = () => {
    const { left, top, width, height } = this.params;
    return (
      isDefined(left) && isDefined(top) && isDefined(width) && isDefined(height)
    );
  };

  crop = async () => {
    if (!this.isCropped()) {
      return false;
    }

    const { withBG, originLeft, originTop, ...rest } = this.getCropData();

    this.image = this.image.extract(rest);
    if (withBG) {
      this.image = await this.compositeWithBg({
        ...this.params,
        left: originLeft,
        top: originTop,
      } as CropParams);
    }
    return true;
  };

  imageExists = async () => {
    const { fileName, dir } = this.params;
    return await this.storage.objectExits(`${dir}/${fileName}`);
  };

  rotate = async () => {
    const { rotate } = this.params;
    if (!rotate) {
      return false;
    }
    this.image = Sharp(await this.image.rotate(rotate).toBuffer());
    return true;
  };

  getCachedImage = async () => {
    const { fileName, dir } = this.params;
    const encodedParams = Object.entries(getTransformations(this.params))
      .map(([key, value]) => `${key}-${value}`)
      .join("");
    const cachedItemPath = `${dir}/${CACHE_DIR}/${fileName}${encodedParams}`;

    if (await this.storage.objectExits(cachedItemPath)) {
      return await this.storage.getObject(cachedItemPath);
    }

    return null;
  };

  cacheImage = async () => {
    const { fileName, dir } = this.params;
    const encodedParams = Object.entries(getTransformations(this.params))
      .map(([key, value]) => `${key}-${value}`)
      .join("");
    const cachedItemPath = `${dir}/${CACHE_DIR}/${fileName}${encodedParams}`;
    this.storage.writeObject(
      await this.image.jpeg().toBuffer(),
      cachedItemPath
    );
  };

  getImage = async () => {
    const { fileName, dir } = this.params;
    return await this.storage.getObject(`${dir}/${fileName}`);
  };

  resize = async () => {
    const { size_height, size_width } = this.params;
    if (!size_height || !size_width) {
      return false;
    }
    this.image = this.image.resize(size_width, size_height, {
      withoutEnlargement: false,
      fit: "cover",
    });
    return true;
  };

  save = async () => {
    const { size_height, size_width, quality, dir, fileName } = this.params;
    const outDir = `${dir}/${size_width}x${size_height}`;
    const encodedParams = Object.entries(this.params)
      .map(([key, value]) => `${key}-${value}`)
      .join("");

    const data = await this.image.rotate().jpeg({ quality }).toBuffer();

    await this.storage.writeObject(data, getParamsURLPath(this.params));
    return this.storage.getObjectURL(`${outDir}${fileName}${encodedParams}`); 
  }

  async run() {
    if (!this.imageExists()) {
      return null;
    }
    const promises: Promise<void>[] = [];

    const cachedData = await this.getCachedImage();
    this.image = Sharp(cachedData ? cachedData : await this.getImage());
    this.metadata = await this.image.metadata();
    if (!cachedData) {
      await this.correctRotation();
      if ((await this.rotate()) || (await this.crop())) {
        promises.push(this.cacheImage());
      }
    }
    this.resize()
    return this.save()
  }
}
