import { Params, Query } from "./types";
import { isDefined, isNumberOrUndefined } from "./utils";

export const checkQueryParams = (queryParams: Query) => {
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
      quality,
  } = queryParams;
  if (
    !isDefined(dir) ||
    !isDefined(fileName) ||
    !isDefined(size_width) ||
    !isDefined(size_height) ||
    !isNumberOrUndefined(left) ||
    !isNumberOrUndefined(top) ||
    !isNumberOrUndefined(width) ||
    !isNumberOrUndefined(height) ||
    !isNumberOrUndefined(rotate) ||
    !isNumberOrUndefined(quality)
  ) {
    return false;
  }

  return true
};

export const getQueryParams = (queryParams: Query): Params => {
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
      quality,
    } = queryParams;

    return {
      dir: dir as string,
      fileName: fileName as string,
      size_width: size_width === "AUTO" ? null : Number(size_width),
      size_height: size_height === "AUTO" ? null : Number(size_height),
      left: left ? Number(left) : null,
      top: top ? Number(top) : null,
      width: width ? Number(width) : null,
      height: height ? Number(height) : null,
      rotate: rotate ? Number(rotate) : 0,
      quality: quality ? Number(quality) : 90,
    };
};