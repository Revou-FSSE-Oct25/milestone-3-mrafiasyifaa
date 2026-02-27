import { render, screen, fireEvent } from '@testing-library/react'
import Question from '@/src/components/Question'
import { FAQ } from '@/src/config/questions'

const mockFAQ: FAQ = {
  id: 1,
  question: 'What is RevoShop?',
  answer: 'RevoShop is an e-commerce platform'
}

describe('Question Component', () => {
  it('should render question text', () => {
    render(<Question data={mockFAQ} />)
    
    expect(screen.getByText('What is RevoShop?')).toBeInTheDocument()
  })

  it('should render answer text', () => {
    render(<Question data={mockFAQ} />)
    
    expect(screen.getByText('RevoShop is an e-commerce platform')).toBeInTheDocument()
  })

  it('should have clickable button', () => {
    render(<Question data={mockFAQ} />)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    fireEvent.click(button)
  })
})