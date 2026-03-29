import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { Landing } from '@/pages/Landing';
import { Chat } from '@/pages/Chat';
import { DocumentUpload } from '@/components/Admin/DocumentUpload';
import { Analytics } from '@/pages/Analytics';
import { ApiKeys } from '@/pages/ApiKeys';
import { CaseStudies } from '@/pages/CaseStudies';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/upload" element={<DocumentUpload />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/settings/api-keys" element={<ApiKeys />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
