export default defineEventHandler(async () => {
  const bearer = await cachedMotToken().catch(() => 0)

  return bearer
})
