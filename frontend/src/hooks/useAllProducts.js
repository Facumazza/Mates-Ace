import { PRODUCTS } from '../data/products'
import { useAdminStore } from '../store/useAdminStore'

export function useAllProducts() {
  const adminProducts = useAdminStore((s) => s.adminProducts)
  return [...PRODUCTS, ...adminProducts]
}
