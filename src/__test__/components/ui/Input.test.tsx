import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/src/components/ui/input'

describe('Input Component', () => {
  it('should render input element', () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
  })

  it('should handle user input', async () => {
    const user = userEvent.setup()
    render(<Input placeholder="Type here" />)
    const input = screen.getByPlaceholderText('Type here') as HTMLInputElement
    
    await user.type(input, 'Hello World')
    expect(input.value).toBe('Hello World')
  })

  it('should apply disabled state', () => {
    render(<Input disabled placeholder="Disabled input" />)
    const input = screen.getByPlaceholderText('Disabled input')
    expect(input).toBeDisabled()
  })

  it('should accept different types', () => {
    render(<Input type="email" placeholder="Email" />)
    const input = screen.getByPlaceholderText('Email')
    expect(input).toHaveAttribute('type', 'email')
  })
})