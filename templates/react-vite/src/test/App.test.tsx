import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('<App />', () => {
  test('App mounts properly', async () => {
    const wrapper = render(<App />)
    expect(wrapper).toBeTruthy()

    // See the docs for writing tests
    // https://testing-library.com/docs/react-testing-library/intro/
  })
})
