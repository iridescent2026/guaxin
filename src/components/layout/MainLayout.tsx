import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Container } from './Container';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Container className="py-6 sm:py-8 lg:py-12">
          {children}
        </Container>
      </main>
      <Footer />
    </div>
  );
}
