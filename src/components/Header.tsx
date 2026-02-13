import React from 'react';
import { cookies } from 'next/headers';
import Container from './Container';
import Logo from './Logo';
import HeaderMenu from './HeaderMenu';
import SearchBar from './SearchBar';
import Cart from './Cart';
import SignIn from './SignIn';
import MobileMenu from './MobileMenu';
import type { User } from '@/store';

const Header = async () => {
  // Read auth cookie from server-side
  let user: User | null = null;
  
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth_session');
    
    if (authCookie) {
      user = JSON.parse(authCookie.value);
    }
  } catch (error) {
    console.error('Error reading auth cookie:', error);
  }

  return (
    <header className="bg-white/70 max-w-full py-5 sticky top-0 z-50 backdrop-blur-sm">
      <Container className="flex items-center justify-between text-lightColor md:gap-0">
        <div className="w-auto md:-1/3 flex items-center gap-2.5 justify-start md:gap-0">
          <MobileMenu />
          <Logo className="text-4xl"/>
        </div>
        <HeaderMenu />
        <div className="w-auto md:w-1/3 flex items-center justify-end space-x-4">
          <SearchBar/>
          <Cart />
          <SignIn serverUser={user} />
        </div>
        
      </Container>
    </header>
  );
};

export default Header;
