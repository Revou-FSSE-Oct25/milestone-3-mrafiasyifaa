import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import HeaderMenu from '@/src/components/HeaderMenu';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock navigation config
jest.mock('@/src/config/navigation', () => ({
  headerNavigation: [
    { title: 'home', href: '/' },
    { title: 'shop', href: '/shop' },
  ],
}));

describe('HeaderMenu Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render navigation links', () => {
    (usePathname as jest.Mock).mockReturnValue('/');

    render(<HeaderMenu />);

    expect(screen.getByText('home')).toBeInTheDocument();
    expect(screen.getByText('shop')).toBeInTheDocument();
  });

  it('should render links with correct href attributes', () => {
    (usePathname as jest.Mock).mockReturnValue('/');

    render(<HeaderMenu />);

    const homeLink = screen.getByText('home').closest('a');
    const shopLink = screen.getByText('shop').closest('a');

    expect(homeLink).toHaveAttribute('href', '/');
    expect(shopLink).toHaveAttribute('href', '/shop');
  });

  it('should highlight active link based on pathname', () => {
    (usePathname as jest.Mock).mockReturnValue('/');

    render(<HeaderMenu />);

    const homeLink = screen.getByText('home');
    expect(homeLink).toHaveClass('text-revoshop-accent');
  });

  it('should highlight shop link when on shop page', () => {
    (usePathname as jest.Mock).mockReturnValue('/shop');

    render(<HeaderMenu />);

    const shopLink = screen.getByText('shop');
    expect(shopLink).toHaveClass('text-revoshop-accent');
  });

  it('should not highlight links when on different page', () => {
    (usePathname as jest.Mock).mockReturnValue('/about');

    render(<HeaderMenu />);

    const homeLink = screen.getByText('home');
    const shopLink = screen.getByText('shop');

    expect(homeLink).not.toHaveClass('text-revoshop-accent');
    expect(shopLink).not.toHaveClass('text-revoshop-accent');
  });

  it('should have hover effect classes', () => {
    (usePathname as jest.Mock).mockReturnValue('/');

    render(<HeaderMenu />);

    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveClass('hover:text-revoshop-accent-hover');
      expect(link).toHaveClass('hoverEffect');
    });
  });

  it('should render with correct styling classes', () => {
    (usePathname as jest.Mock).mockReturnValue('/');

    render(<HeaderMenu />);

    const container = screen.getByText('home').parentElement;
    expect(container).toHaveClass('hidden');
    expect(container).toHaveClass('md:inline-flex');
  });

  it('should render underline spans for active link', () => {
    (usePathname as jest.Mock).mockReturnValue('/');

    const { container } = render(<HeaderMenu />);

    const homeLink = screen.getByText('home').closest('a');
    const spans = homeLink?.querySelectorAll('span');

    expect(spans).toHaveLength(2);
    spans?.forEach(span => {
      expect(span).toHaveClass('w-1/2');
    });
  });

  it('should render all navigation items from config', () => {
    (usePathname as jest.Mock).mockReturnValue('/');

    render(<HeaderMenu />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
  });

  it('should apply capitalize and font styles', () => {
    (usePathname as jest.Mock).mockReturnValue('/');

    const { container } = render(<HeaderMenu />);

    const navContainer = screen.getByText('home').parentElement;
    expect(navContainer).toHaveClass('capitalize');
    expect(navContainer).toHaveClass('font-semibold');
    expect(navContainer).toHaveClass('text-revoshop-navy');
  });

  it('should have relative positioning for underline effect', () => {
    (usePathname as jest.Mock).mockReturnValue('/');

    render(<HeaderMenu />);

    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveClass('relative');
      expect(link).toHaveClass('group');
    });
  });

  it('should show active underline for current page', () => {
    (usePathname as jest.Mock).mockReturnValue('/shop');

    render(<HeaderMenu />);

    const shopLink = screen.getByText('shop').closest('a');
    const underlineSpans = shopLink?.querySelectorAll('span.left-0, span.right-0');
    
    expect(underlineSpans).toBeDefined();
    expect(underlineSpans!.length).toBeGreaterThan(0);
  });
});
