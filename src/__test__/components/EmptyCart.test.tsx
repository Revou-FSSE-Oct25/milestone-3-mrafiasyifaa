import { render, screen } from '@testing-library/react'
import EmptyCart from '@/src/components/EmptyCart'

describe('EmptyCart Component', () => {
  it('should render empty cart message', () => {
    render(<EmptyCart />)
    
    expect(screen.getByText('Your Cart is Empty!')).toBeInTheDocument()
    expect(screen.getByText(/It looks like you haven't added anything/i)).toBeInTheDocument()
  })

  it('should have link to home page', () => {
    render(<EmptyCart />)
    const link = screen.getByRole('link', { name: /Discover Our Curated Products!/i })
    expect(link).toHaveAttribute('href', '/')
  })
})