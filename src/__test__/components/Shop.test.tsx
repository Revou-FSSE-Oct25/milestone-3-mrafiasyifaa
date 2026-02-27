import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Shop from '@/src/components/Shop';

jest.mock('@/src/components/Container', () => ({
  __esModule: true,
  default: ({ children, className }: any) => (
    <div className={className} data-testid="container">
      {children}
    </div>
  ),
}));

jest.mock('@/src/components/ui/text', () => ({
  SubTitle: ({ children, className }: any) => (
    <h2 className={className}>{children}</h2>
  ),
}));

jest.mock('@/src/components/shop/CategoryList', () => ({
  __esModule: true,
  default: ({ selectedCategory, setSelectedCategory }: any) => (
    <div data-testid="category-list">
      <button onClick={() => setSelectedCategory('electronics')}>
        Set Electronics
      </button>
      <span>Selected: {selectedCategory || 'None'}</span>
    </div>
  ),
}));

jest.mock('@/src/components/shop/PriceList', () => ({
  __esModule: true,
  default: ({ selectedPrice, setSelectedPrice }: any) => (
    <div data-testid="price-list">
      <button onClick={() => setSelectedPrice('0-50')}>
        Set Price 0-50
      </button>
      <span>Price: {selectedPrice || 'None'}</span>
    </div>
  ),
}));

jest.mock('@/src/components/NoProduct', () => ({
  __esModule: true,
  default: ({ className }: any) => (
    <div className={className} data-testid="no-product">
      No products found
    </div>
  ),
}));

jest.mock('@/src/components/ProductCard', () => ({
  __esModule: true,
  default: ({ product }: any) => (
    <div data-testid={`product-${product.id}`}>
      {product.title} - ${product.price}
    </div>
  ),
}));

jest.mock('@/src/components/ui/button', () => ({
  Button: ({ children, onClick, className }: any) => (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));

global.fetch = jest.fn();

describe('Shop Component', () => {

  const originalError = console.error;
  
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  const mockCategories = [
    { id: 1, name: 'Electronics', slug: 'electronics', image: 'image1.jpg' },
    { id: 2, name: 'Clothes', slug: 'clothes', image: 'image2.jpg' },
  ];

  const mockProducts = [
    {
      id: 1,
      title: 'Laptop',
      price: 100,
      description: 'A laptop',
      images: ['laptop.jpg'],
      slug: 'laptop',
      category: { id: 1, name: 'Electronics', slug: 'electronics' },
    },
    {
      id: 2,
      title: 'Phone',
      price: 200,
      description: 'A phone',
      images: ['phone.jpg'],
      slug: 'phone',
      category: { id: 1, name: 'Electronics', slug: 'electronics' },
    },
    {
      id: 3,
      title: 'Shirt',
      price: 150,
      description: 'A shirt',
      images: ['shirt.jpg'],
      slug: 'shirt',
      category: { id: 2, name: 'Clothes', slug: 'clothes' },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it('should render shop component with title', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<Shop categories={mockCategories} />);

    expect(screen.getByText(/Grab your products as you scroll/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByTestId('no-product')).toBeInTheDocument();
    });
  });

  it('should show loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    render(<Shop categories={mockCategories} />);

    expect(screen.getByText(/Loading products.../i)).toBeInTheDocument();
  });

  it('should fetch and display products', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    });

    render(<Shop categories={mockCategories} />);

    await waitFor(() => {
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-2')).toBeInTheDocument();
      expect(screen.getByTestId('product-3')).toBeInTheDocument();
    });
  });

  it('should show NoProduct component when no products found', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<Shop categories={mockCategories} />);

    await waitFor(() => {
      expect(screen.getByTestId('no-product')).toBeInTheDocument();
    });
  });

  it('should display error message on fetch failure', async () => {
    const errorMessage = 'Failed to fetch products: 500';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<Shop categories={mockCategories} />);

    await waitFor(() => {
      expect(screen.getByText(/Error Loading Products/i)).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should retry fetching products when retry button is clicked', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      });

    render(<Shop categories={mockCategories} />);

    await waitFor(() => {
      expect(screen.getByText(/Error Loading Products/i)).toBeInTheDocument();
    });

    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
    });
  });

  it('should filter products by category', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [mockProducts[0], mockProducts[1]],
      });

    render(<Shop categories={mockCategories} />);

    await waitFor(() => {
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
    });

    const setCategoryButton = screen.getByText('Set Electronics');
    fireEvent.click(setCategoryButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.escuelajs.co/api/v1/categories/1/products'
      );
    });
  });

  it('should filter products by price range', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      });

    render(<Shop categories={mockCategories} />);

    await waitFor(() => {
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
    });

    const setPriceButton = screen.getByText('Set Price 0-50');
    fireEvent.click(setPriceButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('should reset filters when Reset Filters button is clicked', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [mockProducts[0]],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      });

    render(<Shop categories={mockCategories} />);

    await waitFor(() => {
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
    });

    const setCategoryButton = screen.getByText('Set Electronics');
    fireEvent.click(setCategoryButton);

    await waitFor(() => {
      expect(screen.getByText('Selected: electronics')).toBeInTheDocument();
    });

    const resetButton = screen.getByText('Reset Filters');
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(screen.getByText('Selected: None')).toBeInTheDocument();
      expect(screen.getByText('Price: None')).toBeInTheDocument();
    });
  });

  it('should handle initial category from props', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [mockProducts[0], mockProducts[1]],
    });

    render(
      <Shop 
        categories={mockCategories} 
        initialCategory="electronics" 
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Selected: electronics')).toBeInTheDocument();
    });
  });

  it('should handle initial price from props', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    });

    render(
      <Shop 
        categories={mockCategories} 
        initialPrice="0-50" 
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Price: 0-50')).toBeInTheDocument();
    });
  });

  it('should render CategoryList and PriceList components', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    });

    render(<Shop categories={mockCategories} />);

    expect(screen.getByTestId('category-list')).toBeInTheDocument();
    expect(screen.getByTestId('price-list')).toBeInTheDocument();
    
    // Wait for async state updates to complete
    await waitFor(() => {
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
    });
  });

  it('should apply price filter correctly', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    });

    render(<Shop categories={mockCategories} initialPrice="0-50" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.escuelajs.co/api/v1/products'
      );
    });
  });

  it('should fetch from category endpoint when category is selected', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    });

    render(<Shop categories={mockCategories} initialCategory="electronics" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.escuelajs.co/api/v1/categories/1/products'
      );
    });
  });

  it('should handle network errors gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );

    render(<Shop categories={mockCategories} />);

    await waitFor(() => {
      expect(screen.getByText(/Error Loading Products/i)).toBeInTheDocument();
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });

  it('should render products in grid layout', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    });

    const { container } = render(<Shop categories={mockCategories} />);

    await waitFor(() => {
      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
      expect(grid).toHaveClass('grid-cols-2');
      expect(grid).toHaveClass('md:grid-cols-3');
      expect(grid).toHaveClass('lg:grid-cols-4');
    });
  });
});
