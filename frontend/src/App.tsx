import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { Home } from '@/pages/Home';
import { SearchInterface } from '@/components/SearchInterface';
import { DocumentUpload } from '@/components/Admin/DocumentUpload';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchInterface />} />
          <Route path="/upload" element={<DocumentUpload />} />
          <Route
            path="/analytics"
            element={<div className="bg-white rounded-lg shadow p-6">Coming Soon</div>}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
