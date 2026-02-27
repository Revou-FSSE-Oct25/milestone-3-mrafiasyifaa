import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import AddToCart from '@/components/AddToCart';
import useStore from '@/store';
import { toast } from 'sonner';

jest.mock('next/navigation');
jest.mock('@/store');
jest.mock('sonner');

describe('AddToCart Component', () => {
  const mockProduct = {
    id: 1,
    title: 'Test Product',
    price: 100,
    description: 'Test Description',
    images: ['image1.jpg'],
    slug: 'test-product',
    category: { id: 1, name: 'Category' },
  };

  const mockPush = jest.fn();
  const mockAddItem = jest.fn();
  const mockUser = { id: 1, name: 'Test User', email: 'test@test.com', role: 'customer' as const, avatar: '' };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('should show "Add to Cart" button when item not in cart', () => {
    const mockState = {
      addItem: mockAddItem,
      user: mockUser,
      items: [],
    };

    (useStore as unknown as jest.Mock).mockImplementation((selector) => selector(mockState));

    render(<AddToCart product={mockProduct} />);
    
    expect(screen.getByText(/add to cart/i)).toBeInTheDocument();
  });

  it('should show quantity buttons when item is in cart', () => {
    const mockState = {
      addItem: mockAddItem,
      user: mockUser,
      items: [{ product: mockProduct, quantity: 2 }],
    };

    (useStore as unknown as jest.Mock).mockImplementation((selector) => selector(mockState));

    render(<AddToCart product={mockProduct} />);
    
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText(/subtotal/i)).toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    const mockState = {
      addItem: mockAddItem,
      user: null,
      items: [],
    };

    (useStore as unknown as jest.Mock).mockImplementation((selector) => selector(mockState));

    render(<AddToCart product={mockProduct} />);
    
    fireEvent.click(screen.getByText(/add to cart/i));

    expect(toast.error).toHaveBeenCalledWith(
      'Please login first',
      expect.objectContaining({
        description: 'You need to be logged in to add items to cart',
      })
    );
    expect(mockPush).toHaveBeenCalledWith(`/login?redirect=/product/${mockProduct.slug}/${mockProduct.id}`);
  });

  it('should add item to cart when user is authenticated', () => {
    const mockState = {
      addItem: mockAddItem,
      user: mockUser,
      items: [],
    };

    (useStore as unknown as jest.Mock).mockImplementation((selector) => selector(mockState));

    render(<AddToCart product={mockProduct} />);
    
    fireEvent.click(screen.getByText(/add to cart/i));

    expect(mockAddItem).toHaveBeenCalledWith(mockProduct);
    expect(toast.success).toHaveBeenCalled();
  });
});