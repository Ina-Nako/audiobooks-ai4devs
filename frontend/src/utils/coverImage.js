/**
 * Generate a deterministic random cover image URL based on the book id.
 */
export function getCoverImage(bookId, width = 400, height = 560) {
  const seed = typeof bookId === 'string' ? bookId.replace(/[^a-z0-9]/gi, '').slice(0, 10) : bookId
  return `https://picsum.photos/seed/${seed}/${width}/${height}`
}
