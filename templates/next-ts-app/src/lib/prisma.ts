import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient
}

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  // In production mode, it's best to not use a global variable.
  prisma = new PrismaClient()
} else {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

// Export a module-scoped PrismaClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default prisma
