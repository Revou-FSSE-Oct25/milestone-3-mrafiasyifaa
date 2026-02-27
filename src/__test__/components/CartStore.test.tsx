import { renderHook, act } from '@testing-library/react';
import useStore from '@/store';

describe('Cart Store', () => {
  const mockProduct = {
    id: 1,
    title: 'Test Product',
    price: 100,
    description: 'Test',
    images: ['image.jpg'],
    slug: 'test-product',
    category: { id: 1, name: 'Category' },
  };

  beforeEach(() => {
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.resetCart();
    });
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product.id).toBe(mockProduct.id);
    expect(result.current.items[0].quantity).toBe(1);
  });

  it('should increase quantity when adding same item', () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      result.current.addItem(mockProduct);
      result.current.addItem(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      result.current.addItem(mockProduct);
      result.current.addItem(mockProduct);
    });

    expect(result.current.items[0].quantity).toBe(2);

    act(() => {
      result.current.removeItem(mockProduct.id.toString());
    });

    expect(result.current.items[0].quantity).toBe(1);
  });

  it('should delete item completely when quantity is 1', () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);

    act(() => {
      result.current.removeItem(mockProduct.id.toString());
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('should calculate total price correctly', () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      result.current.addItem(mockProduct);
      result.current.addItem(mockProduct);
    });

    expect(result.current.getTotalPrice()).toBe(200);
  });

  it('should reset cart', () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);

    act(() => {
      result.current.resetCart();
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('should get item count for specific product', () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      result.current.addItem(mockProduct);
      result.current.addItem(mockProduct);
    });

    expect(result.current.getItemCount(mockProduct.id.toString())).toBe(2);
  });
});