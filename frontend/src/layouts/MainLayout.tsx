import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/Shared/Header';
import { AppSidebar } from '@/components/Shared/Sidebar';
import Footer from '@/components/Shared/Footer';
import { Toaster } from 'react-hot-toast';

export const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <div className="flex-1 px-4 sm:px-8 pb-8">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </div>
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
