import { checkQueryParams, getQueryParams } from './params'
import { extractFileName, getFileName } from './utils'

describe('params', () => {
  describe('checkQueryParams', () => {
    it('simple', () => {
      expect(
        checkQueryParams({
          path: 'path',
          left: '1',
          top: '1',
          width: '1',
          height: '1',
          rotate: '1',
        }),
      ).toBeTruthy()
    })

    it('missing path', () => {
      expect(
        checkQueryParams({
          left: '1',
          top: '1',
          width: '1',
          height: '1',
          rotate: '1',
        }),
      ).not.toBeTruthy()
    })

    it('wrong transformations', () => {
      expect(
        checkQueryParams({
          path: 'path',
          left: 'a',
          top: '1',
          width: '1',
          height: '1',
          rotate: '1',
        }),
      ).not.toBeTruthy()
    })

    it('missing transformations', () => {
      expect(
        checkQueryParams({
          path: 'path',
        }),
      ).toBeTruthy()
    })

    it('missing some transformations', () => {
      expect(
        checkQueryParams({
          path: 'path',
          top: '1',
          width: '1',
          height: '1',
          rotate: '1',
        }),
      ).not.toBeTruthy()
    })
  })

  describe('getQueryParams', () => {
    it('simple', () => {
      expect(
        getQueryParams({
          path: 'path',
          left: '1',
          top: '1',
          width: '1',
          height: '1',
          rotate: '1',
        }),
      ).toEqual({
        path: 'path',
        transform: {
          left: 1,
          top: 1,
          width: 1,
          height: 1,
          rotate: 1,
        },
      })
    })

    it('missing transformation', () => {
      expect(
        getQueryParams({
          path: 'path',
        }),
      ).toEqual({
        path: 'path',
        transform: undefined,
      })
    })

    it('missing path', () => {
      expect(
        getQueryParams({
          left: '1',
          top: '1',
          width: '1',
          height: '1',
          rotate: '1',
        }),
      ).toBeNull()
    })

    it('wrong transformations', () => {
      expect(
        getQueryParams({
          path: 'path',
          left: 'a',
          top: '1',
          width: '1',
          height: '1',
          rotate: '1',
        }),
      ).toBeNull()
    })

    it('missing some transformations', () => {
      expect(
        getQueryParams({
          path: 'path',
          top: '1',
          width: '1',
          height: '1',
          rotate: '1',
        }),
      ).toBeNull()
    })
  })

  describe('getFileName', () => {
    it('simple', () => {
      expect(getFileName('name', 'png')).toBe('name.png')
    })

    it('size', () => {
      expect(getFileName('name', 'png', 300)).toBe('name-300.png')
    })
  })

  describe('extractFileName', () => {
    it('simple', () => {
      expect(extractFileName('/path/to/file.png')).toBe('file')
    })

    it('without ending', () => {
      expect(extractFileName('/path/to/file')).toBe('file')
    })

    it('without prefix', () => {
      expect(extractFileName('file.png')).toBe('file')
    })

    it('without prefix, without ending', () => {
      expect(extractFileName('file')).toBe('file')
    })
  })
})
