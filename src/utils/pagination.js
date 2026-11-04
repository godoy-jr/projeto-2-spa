export function paginate(items, page, pageSize) {
  if (!Array.isArray(items)) throw new TypeError('Os registros devem ser um array.')
  if (!Number.isInteger(page) || page < 1) throw new RangeError('A página deve ser um inteiro maior que zero.')
  if (!Number.isInteger(pageSize) || pageSize < 1) throw new RangeError('O tamanho da página deve ser um inteiro maior que zero.')

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * pageSize

  return {
    rows: items.slice(start, start + pageSize),
    currentPage,
    totalPages,
    from: items.length === 0 ? 0 : start + 1,
    to: Math.min(start + pageSize, items.length),
  }
}
