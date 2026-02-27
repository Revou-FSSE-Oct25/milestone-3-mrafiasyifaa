import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import CategoryList from '@/src/components/CategoryList';

global.fetch = jest.fn();

describe('CategoryList Component', () => {
  const mockCategories = [
    { id: 1, name: 'Electronics', slug: 'electronics', image: 'image1.jpg' },
    { id: 2, name: 'Clothes', slug: 'clothes', image: 'image2.jpg' },
    { id: 3, name: 'Furniture', slug: 'furniture', image: 'image3.jpg' },
    { id: 4, name: 'Here Category', slug: 'here-category', image: 'image4.jpg' }, // Should be filtered out
  ];

  const mockOnTabSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render loading skeleton initially', () => {
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <CategoryList 
        selectedCategory="All" 
        onTabSelect={mockOnTabSelect} 
      />
    );

    const skeletons = screen.getAllByRole('generic').filter(
      el => el.className.includes('animate-pulse')
    );
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should fetch and display categories with "All" option', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories,
    });

    render(
      <CategoryList 
        selectedCategory="All" 
        onTabSelect={mockOnTabSelect} 
      />
    );

    await waitFor(() => {
      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Electronics')).toBeInTheDocument();
      expect(screen.getByText('Clothes')).toBeInTheDocument();
      expect(screen.getByText('Furniture')).toBeInTheDocument();
    });

    expect(screen.queryByText('Here Category')).not.toBeInTheDocument();
  });

  it('should highlight selected category', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories,
    });

    render(
      <CategoryList 
        selectedCategory="Electronics" 
        onTabSelect={mockOnTabSelect} 
      />
    );

    await waitFor(() => {
      const electronicsButton = screen.getByText('Electronics');
      expect(electronicsButton).toHaveClass('bg-revoshop-accent');
      expect(electronicsButton).toHaveClass('text-white');
    });
  });

  it('should call onTabSelect when category button is clicked', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories,
    });

    render(
      <CategoryList 
        selectedCategory="All" 
        onTabSelect={mockOnTabSelect} 
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Electronics')).toBeInTheDocument();
    });

    const electronicsButton = screen.getByText('Electronics');
    fireEvent.click(electronicsButton);

    expect(mockOnTabSelect).toHaveBeenCalledWith('Electronics');
  });

  it('should display error message when fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to fetch categories')
    );

    render(
      <CategoryList 
        selectedCategory="All" 
        onTabSelect={mockOnTabSelect} 
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Error loading categories/i)).toBeInTheDocument();
      expect(screen.getByText(/Failed to fetch categories/i)).toBeInTheDocument();
    });
  });

  it('should handle network error (not ok response)', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(
      <CategoryList 
        selectedCategory="All" 
        onTabSelect={mockOnTabSelect} 
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Error loading categories/i)).toBeInTheDocument();
    });
  });

  it('should abort fetch on component unmount', async () => {
    const abortSpy = jest.spyOn(AbortController.prototype, 'abort');

    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    const { unmount } = render(
      <CategoryList 
        selectedCategory="All" 
        onTabSelect={mockOnTabSelect} 
      />
    );

    unmount();

    expect(abortSpy).toHaveBeenCalled();
  });

  it('should not show error for aborted requests', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce({
      name: 'AbortError',
      message: 'The user aborted a request',
    });

    render(
      <CategoryList 
        selectedCategory="All" 
        onTabSelect={mockOnTabSelect} 
      />
    );

    await waitFor(() => {
      expect(screen.queryByText(/Error loading categories/i)).not.toBeInTheDocument();
    });
  });

  it('should apply hover styles to category buttons', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories,
    });

    render(
      <CategoryList 
        selectedCategory="All" 
        onTabSelect={mockOnTabSelect} 
      />
    );

    await waitFor(() => {
      const electronicsButton = screen.getByText('Electronics');
      expect(electronicsButton).toHaveClass('hover:bg-revoshop-accent-hover');
      expect(electronicsButton).toHaveClass('hover:border-revoshop-navy');
      expect(electronicsButton).toHaveClass('hover:text-white');
    });
  });

  it('should render correct number of categories including All', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories,
    });

    render(
      <CategoryList 
        selectedCategory="All" 
        onTabSelect={mockOnTabSelect} 
      />
    );

    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(4);
    });
  });
});
