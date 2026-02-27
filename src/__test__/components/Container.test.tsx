import { render, screen } from '@testing-library/react'
import Container from '@/src/components/Container'

describe('Container Component', () => {
  it('should render children correctly', () => {
    render(
      <Container>
        <div>Test Content</div>
      </Container>
    )
    
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <Container className="custom-class">
        <div>Content</div>
      </Container>
    )
    
    const divElement = container.firstChild as HTMLElement
    expect(divElement).toHaveClass('custom-class')
    expect(divElement).toHaveClass('max-w-screen-2xl')
  })
})