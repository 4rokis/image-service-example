import { Params, Transformations } from "./types";

export const CACHE_DIR = "CACHE";

export const rotated0 = (width: number, height: number): [number, number] => {
  const x = width / 2;
  const y = height / 2;

  return rotatePointMinus90(x, y);
};
export const rotatePointMinus90 = (x: number, y: number): [number, number] => {
  return [-y + x, y - x];
};
export const isDefined = (x: any) => Boolean(x) || x === 0;
export const isNumberOrUndefined = (x: any) => isDefined(x) ? Boolean(Number(x)) : true

export const getTransformations = (params: Params): Transformations => {
  const {
    left,
    top,
    width,
    height,
    rotate,
  } = params;

  return {
    left,
    top,
    width,
    height,
    rotate,
  };
}

export const getParamsURLPath = (params: Params) => {
  const {
    dir,
    fileName,
    size_width,
    size_height,
    left,
    top,
    width,
    height,
    rotate,
  } = params;

  const transformations = {
    left,
    top,
    width,
    height,
    rotate,
  };
  const encodedParams = Object.entries(transformations)
    .map(([key, value]) => `${key}-${value}`)
    .join("");
  const outFileName = `${fileName}${encodedParams}`;
  const outDir = `${dir}/${size_width}x${size_height}`;
  return `${outDir}/${outFileName}`;
};

export const isURLExists = async (url: string) => {
  const res = await fetch(url, { method: "HEAD" });
  return res.ok;
};
