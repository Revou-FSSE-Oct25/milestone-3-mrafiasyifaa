import { render, screen } from '@testing-library/react'
import { Label } from '@/src/components/ui/label'

describe('Label Component', () => {
  it('should render label with text', () => {
    render(<Label>Username</Label>)
    const label = screen.getByText('Username')
    expect(label).toBeInTheDocument()
  })

  it('should apply htmlFor attribute', () => {
    render(<Label htmlFor="email">Email</Label>)
    const label = screen.getByText('Email')
    expect(label).toHaveAttribute('for', 'email')
  })

  it('should apply custom className', () => {
    render(<Label className="custom-class">Name</Label>)
    const label = screen.getByText('Name')
    expect(label).toHaveClass('custom-class')
  })
})