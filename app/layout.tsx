import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/stores/authStore';
import { UIProvider } from '@/stores/uiStore';
import { LanguageProvider } from '@/stores/languageStore';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Toaster } from '@/components/ui/sonner';
import { APP_CONFIG } from '@/lib/constants';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: APP_CONFIG.name,
  description: APP_CONFIG.description,
  keywords: ['bénévolat', 'associations', 'ONG', 'volontariat', 'solidarité'],
  authors: [{ name: APP_CONFIG.author }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ErrorBoundary>
          <LanguageProvider>
            <UIProvider>
              <AuthProvider>
                <div className="min-h-screen flex flex-col">
                  <Navbar />
                  <main className="flex-1">
                    {children}
                  </main>
                  <Footer />
                </div>
                <Toaster />
              </AuthProvider>
            </UIProvider>
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}