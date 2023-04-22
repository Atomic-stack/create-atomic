#!/usr/bin/env node
import crypto from 'crypto'

function main() {
  console.log('Hello World!')
  const hash = crypto.createHash('sha1')
  hash.update('Hello World!')
  console.log(hash.digest('hex'))
}

main()
