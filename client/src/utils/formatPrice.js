export const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)

export const getDiscount = (price, mrp) =>
  mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0

export const truncate = (text, max = 60) =>
  text?.length > max ? text.slice(0, max) + '…' : text
