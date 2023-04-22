import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  return new Response('Hello, Next.js!')
}
