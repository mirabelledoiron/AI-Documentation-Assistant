import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { Landing } from '@/pages/Landing';
import { Chat } from '@/pages/Chat';
import { SearchInterface } from '@/components/SearchInterface';
import { DocumentUpload } from '@/components/Admin/DocumentUpload';
import { Analytics } from '@/pages/Analytics';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/search" element={<SearchInterface />} />
          <Route path="/upload" element={<DocumentUpload />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
