import assert from 'assert'
import {example} from '../src/index.js'

describe('module', () => {
  it('example', () => {
    assert(example() === 'test')
  })
})
