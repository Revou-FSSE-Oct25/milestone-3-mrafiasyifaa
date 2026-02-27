import { render, screen } from '@testing-library/react'
import NoAccess from '@/src/components/NoAccess'

describe('NoAccess Component', () => {
  it('should render default access denied message', () => {
    render(<NoAccess />)
    
    expect(screen.getByText(/You do not have permission/i)).toBeInTheDocument()
  })

  it('should render custom details message', () => {
    render(<NoAccess details="Custom access denied message" />)
    
    expect(screen.getByText('Custom access denied message')).toBeInTheDocument()
  })

  it('should have links to home and login', () => {
    render(<NoAccess />)
    
    expect(screen.getByRole('link', { name: /Back to Home/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /Login with Different Account/i })).toHaveAttribute('href', '/login')
  })
})