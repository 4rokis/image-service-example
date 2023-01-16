import { extractFileName, getFileName } from './utils'

describe('utils', () => {
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
