// frontend/src/layouts/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/Shared/Header';
import { Sidebar } from '@/components/Shared/Sidebar';
import Footer from '@/components/Shared/Footer';
import { Toaster } from 'react-hot-toast';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 px-8 pb-8">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
          },
          success: {
            duration: 3000,
            iconTheme: { primary: '#10B981', secondary: '#fff' },
          },
          error: {
            duration: 4000,
            iconTheme: { primary: '#EF4444', secondary: '#fff' },
          },
        }}
      />
    </div>
  );
};
