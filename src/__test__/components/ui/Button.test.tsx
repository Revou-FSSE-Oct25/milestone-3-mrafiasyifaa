import { render, screen } from '@testing-library/react'
import { Button } from '@/src/components/ui/button'

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Click Me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })

  it('should apply default variant class', () => {
    render(<Button variant="default">Primary</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-primary')
  })
})