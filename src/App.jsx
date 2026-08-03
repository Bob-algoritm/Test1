import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import { LanguageProvider } from '@/lib/i18n.jsx';
import ScrollToTop from './components/ScrollToTop';
import Home from '@/pages/Home';
import Matrix from '@/pages/Matrix';
import Projects from '@/pages/Projects';

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <LanguageProvider>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/matrix" element={<Matrix />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </LanguageProvider>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App