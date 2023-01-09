import { isDefined, isNumber } from './utils'

describe('utils', () => {
  describe('isDefined', () => {
    it('simple', () => {
      expect(isDefined('a')).toBeTruthy()
    })
    it('null', () => {
      expect(isDefined(null)).not.toBeTruthy()
    })
    it('undefined', () => {
      expect(isDefined(undefined)).not.toBeTruthy()
    })
    it('empty string', () => {
      expect(isDefined('')).not.toBeTruthy()
    })
    it('undefined string', () => {
      expect(isDefined('undefined')).toBeTruthy()
    })
  })

  describe('isNumber', () => {
    it('simple', () => {
      expect(isNumber('5')).toBeTruthy()
    })
    it('null', () => {
      expect(isNumber(null)).not.toBeTruthy()
    })
    it('undefined', () => {
      expect(isNumber(undefined)).not.toBeTruthy()
    })
    it('empty string', () => {
      expect(isNumber('')).not.toBeTruthy()
    })
    it('0', () => {
      expect(isNumber('0')).toBeTruthy()
    })
    it('undefined string', () => {
      expect(isNumber('undefined')).not.toBeTruthy()
    })
  })
})
