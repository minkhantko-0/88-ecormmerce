'use client';

import { useState } from 'react';
import { SignedIn, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <header className='relative py-4'>
      <nav className='container mx-auto flex items-center justify-between px-4'>
        {/* Logo / Brand */}
        <Link href='/' className='text-xl font-bold'>
          88 Online Shop
        </Link>

        {/* Desktop Navigation */}
        <div className='hidden items-center gap-10 sm:flex'>
          <ul className='flex gap-6 text-sm font-medium'>
            <li>
              <Link href='/'>Home</Link>
            </li>
            {/* Add more navigation items here if needed */}
          </ul>
          <div className='flex items-center gap-6'>
            <ThemeToggle />
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>

        {/* Mobile Header Icons */}
        <div className='flex items-center gap-4 sm:hidden'>
          <ThemeToggle />
          <SignedIn>
            <UserButton />
          </SignedIn>
          <button
            onClick={toggleDrawer}
            className='rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary'
            aria-label='Toggle menu'
          >
            {drawerOpen ? (
              <X className='h-6 w-6' />
            ) : (
              <Menu className='h-6 w-6' />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ${drawerOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
        onClick={toggleDrawer}
      ></div>

      {/* Mobile Drawer Menu */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 transform bg-white shadow-md transition-transform duration-300 dark:bg-gray-800 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className='p-4'>
          {/* Mobile Navigation Items */}
          <ul className='flex flex-col gap-4'>
            <li>
              <Link href='/' onClick={() => setDrawerOpen(false)}>
                Home
              </Link>
            </li>
            {/* Add more mobile navigation items here */}
          </ul>
        </div>
      </aside>
    </header>
  );
}
