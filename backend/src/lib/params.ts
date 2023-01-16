import { Params, Query } from './types'
import { isDefined, isNumber } from './utils'

export const checkTransformations = (queryParams: Query) => {
  const { left, top, width, height, rotate } = queryParams

  if (
    isDefined(left) ||
    isDefined(top) ||
    isDefined(width) ||
    isDefined(height) ||
    isDefined(rotate)
  ) {
    return (
      isNumber(left) &&
      isNumber(top) &&
      isNumber(width) &&
      isNumber(height) &&
      isNumber(rotate)
    )
  }
  return true
}

export const checkQueryParams = (queryParams: Query) => {
  const { path } = queryParams
  if (path && typeof path !== 'string') {
    return false
  }
  return checkTransformations(queryParams)
}

export const getQueryParams = (queryParams: Query): Params | null => {
  const { path, left, top, width, height, rotate } = queryParams

  if (!checkQueryParams(queryParams)) {
    return null
  }

  return {
    path: path as string,
    transform:
      isDefined(left) &&
      isDefined(top) &&
      isDefined(width) &&
      isDefined(height) &&
      isDefined(rotate)
        ? {
            left: Number(left),
            top: Number(top),
            width: Number(width),
            height: Number(height),
            rotate: Math.abs(Number(rotate || '0') % 360),
          }
        : undefined,
  }
}
