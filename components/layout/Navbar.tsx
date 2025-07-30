'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/hooks/useUI';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { 
  Menu, 
  User, 
  Settings, 
  LogOut, 
  Bell,
  Calendar,
  Users,
  Home
} from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications } = useUI();
  const { t, isRTL } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const publicNavItems = [
    { href: '/', label: t('home'), icon: Home },
    { href: '/ongs', label: t('ongs'), icon: Users },
    { href: '/events', label: t('events'), icon: Calendar },
  ];

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    return user.role === 'ong_admin' ? '/admin/dashboard' : '/dashboard';
  };

  return (
    <nav className="bg-white shadow-sm border-b border-emerald-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between h-16 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link href="/" className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
              <div className="relative w-8 h-8">
                <Image
                  src="/logo.jpeg"
                  alt="Ummati Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Ummati
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className={`hidden md:flex items-center space-x-8 ${isRTL ? 'space-x-reverse' : ''}`}>
            {publicNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-emerald-600 transition-colors duration-200 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
            {/* Language Switcher */}
            <LanguageSwitcher />

            {isAuthenticated && user ? (
              <>
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative hover:bg-emerald-50">
                      <Bell className="h-5 w-5 text-emerald-600" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-emerald-600">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.length > 0 ? (
                      notifications.slice(0, 5).map((notification) => (
                        <DropdownMenuItem key={notification.id}>
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className="text-xs text-gray-500">{notification.message}</p>
                          </div>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <DropdownMenuItem>
                        <p className="text-sm text-gray-500">Aucune notification</p>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8 border-2 border-emerald-200">
                        <AvatarImage src={user.avatar} alt={user.firstName} />
                        <AvatarFallback className="bg-emerald-100 text-emerald-700">
                          {getInitials(user.firstName, user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align={isRTL ? "start" : "end"} forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardLink()}>
                        <Home className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        <span>{t('dashboard')}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        <span>{t('profile')}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        <span>{t('settings')}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      <span>{t('logout')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Menu for authenticated users */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="md:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side={isRTL ? "left" : "right"}>
                    <SheetHeader>
                      <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      {publicNavItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors ${isRTL ? 'space-x-reverse' : ''}`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                      <div className="pt-4 border-t space-y-2">
                        <Link href={getDashboardLink()}>
                          <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                            <Home className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            {t('dashboard')}
                          </Button>
                        </Link>
                        <Link href="/profile">
                          <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                            <User className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            {t('profile')}
                          </Button>
                        </Link>
                        <Button variant="ghost" className="w-full justify-start text-red-600" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                          <LogOut className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                          {t('logout')}
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              <>
                {/* Buttons for non-authenticated users */}
                <Link href="/login">
                  <Button variant="ghost" className="text-emerald-700 hover:bg-emerald-50">{t('login')}</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">{t('register')}</Button>
                </Link>

                {/* Mobile Menu for non-authenticated users */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="md:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side={isRTL ? "left" : "right"}>
                    <SheetHeader>
                      <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      {publicNavItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors ${isRTL ? 'space-x-reverse' : ''}`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                      <div className="pt-4 space-y-2">
                        <Link href="/login">
                          <Button variant="ghost" className="w-full justify-start text-emerald-700 hover:bg-emerald-50" onClick={() => setMobileMenuOpen(false)}>
                            {t('login')}
                          </Button>
                        </Link>
                        <Link href="/register">
                          <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => setMobileMenuOpen(false)}>{t('register')}</Button>
                        </Link>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}