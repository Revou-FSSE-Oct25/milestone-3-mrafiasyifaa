import { render, screen } from '@testing-library/react'
import ProductCard from '@/src/components/ProductCard'
import { Product } from '@/src/types/product'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  })),
  usePathname: jest.fn(() => '/'),
}))

jest.mock('@/store', () => ({
  __esModule: true,
  default: jest.fn((selector) => {
    const state = {
      items: [],
      addItem: jest.fn(),
      user: null,
    }
    return selector(state)
  }),
}))

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 100,
  description: 'Test Description',
  category: {
    id: 1,
    name: 'Electronics',
    image: 'category.jpg',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  images: ['https://example.com/image.jpg'],
  slug: 'test-product',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
}

describe('ProductCard Component', () => {
  it('should render product information correctly', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText(/100/)).toBeInTheDocument()
  })

  it('should render category name', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Electronics')).toBeInTheDocument()
  })

  it('should render product image', () => {
    render(<ProductCard product={mockProduct} />)
    const image = screen.getByAltText('Test Product')
    expect(image).toBeInTheDocument()
  })
})