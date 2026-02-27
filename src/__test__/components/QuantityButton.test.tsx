import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import QuantityButtons from '@/components/QuantityButtons';
import useStore from '@/store';
import { toast } from 'sonner';

jest.mock('next/navigation');
jest.mock('@/store');
jest.mock('sonner');

describe('QuantityButtons Component', () => {
  const mockProduct = {
    id: 1,
    title: 'Test Product',
    price: 100,
    description: 'Test',
    images: ['image.jpg'],
    slug: 'test-product',
    category: { id: 1, name: 'Category' },
  };

  const mockAddItem = jest.fn();
  const mockRemoveItem = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('should display current quantity', () => {
    const mockState = {
      addItem: mockAddItem,
      removeItem: mockRemoveItem,
      user: { id: 1, name: 'User', email: 'user@test.com', role: 'customer', avatar: '' },
      items: [{ product: mockProduct, quantity: 3 }],
    };

    (useStore as unknown as jest.Mock).mockImplementation((selector) => selector(mockState));

    render(<QuantityButtons product={mockProduct} />);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should increase quantity when plus button clicked', () => {
    const mockState = {
      addItem: mockAddItem,
      removeItem: mockRemoveItem,
      user: { id: 1, name: 'User', email: 'user@test.com', role: 'customer', avatar: '' },
      items: [{ product: mockProduct, quantity: 1 }],
    };

    (useStore as unknown as jest.Mock).mockImplementation((selector) => selector(mockState));

    render(<QuantityButtons product={mockProduct} />);

    const plusButton = screen.getAllByRole('button')[1];
    fireEvent.click(plusButton);

    expect(mockAddItem).toHaveBeenCalledWith(mockProduct);
    expect(toast.success).toHaveBeenCalledWith(
      'Quantity increased!',
      expect.objectContaining({ description: mockProduct.title })
    );
  });

  it('should decrease quantity when minus button clicked', () => {
    const mockState = {
      addItem: mockAddItem,
      removeItem: mockRemoveItem,
      user: { id: 1, name: 'User', email: 'user@test.com', role: 'customer', avatar: '' },
      items: [{ product: mockProduct, quantity: 2 }],
    };

    (useStore as unknown as jest.Mock).mockImplementation((selector) => selector(mockState));

    render(<QuantityButtons product={mockProduct} />);

    const minusButton = screen.getAllByRole('button')[0];
    fireEvent.click(minusButton);

    expect(mockRemoveItem).toHaveBeenCalledWith(mockProduct.id.toString());
  });

  it('should redirect to login when user not authenticated', () => {
    const mockState = {
      addItem: mockAddItem,
      removeItem: mockRemoveItem,
      user: null,
      items: [],
    };

    (useStore as unknown as jest.Mock).mockImplementation((selector) => selector(mockState));

    render(<QuantityButtons product={mockProduct} />);

    const plusButton = screen.getAllByRole('button')[1];
    fireEvent.click(plusButton);

    expect(mockPush).toHaveBeenCalledWith(`/login?redirect=/product/${mockProduct.slug}/${mockProduct.id}`);
  });
});