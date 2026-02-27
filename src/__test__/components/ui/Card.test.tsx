import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/src/components/ui/card'

describe('Card Component', () => {
  it('should render card with content', () => {
    render(
      <Card>
        <CardContent>Card content</CardContent>
      </Card>
    )
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('should render card with header and title', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
      </Card>
    )
    expect(screen.getByText('Card Title')).toBeInTheDocument()
  })

  it('should render card with description', () => {
    render(
      <Card>
        <CardHeader>
          <CardDescription>This is a description</CardDescription>
        </CardHeader>
      </Card>
    )
    expect(screen.getByText('This is a description')).toBeInTheDocument()
  })

  it('should render complete card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    )
    
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })
})