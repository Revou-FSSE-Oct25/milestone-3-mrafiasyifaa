import { render, screen } from '@testing-library/react'
import NoProduct from '@/src/components/NoProduct'

describe('NoProduct Component', () => {
  it('should render no product message', () => {
    render(<NoProduct />)
    
    expect(screen.getByText('No Product Available')).toBeInTheDocument()
    expect(screen.getByText(/We're restocking shortly/i)).toBeInTheDocument()
  })

  it('should display selected category', () => {
    render(<NoProduct selectedCategory="Electronics" />)
    
    expect(screen.getByText('Electronics')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<NoProduct className="custom-class" />)
    
    const divElement = container.firstChild as HTMLElement
    expect(divElement).toHaveClass('custom-class')
  })
})