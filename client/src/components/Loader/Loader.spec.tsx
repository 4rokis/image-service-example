/**
 * @jest-environment jsdom
 */
import React from 'react'

import { render } from '@/../testUtils'
import { Loader } from './Loader'

const ID = 'loader'

describe('Loader', () => {
  it('simple', () => {
    const { getByTestId } = render(<Loader />)
    expect(getByTestId(ID)).toBeTruthy()
  })
})
