import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChatInterface } from '@/components/ChatInterface';
import { SearchInterface } from '@/components/SearchInterface';
import { DocumentUpload } from '@/components/Admin/DocumentUpload';
import { MessageCircle, Search, Upload, Menu, X, BarChart } from 'lucide-react';

type TabType = 'chat' | 'search' | 'upload' | 'analytics';

export const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'chat' as TabType, label: 'AI Chat', icon: MessageCircle },
    { id: 'search' as TabType, label: 'Semantic Search', icon: Search },
    { id: 'upload' as TabType, label: 'Upload Docs', icon: Upload },
    { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-semibold text-gray-800">Home</div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-600 hover:text-gray-900"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border border-gray-200 bg-white rounded-lg mb-4"
        >
          <div className="px-4 py-2 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 ${
                    activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="py-2">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {activeTab === 'chat' && 'Chat with AI Assistant'}
            {activeTab === 'search' && 'Semantic Search'}
            {activeTab === 'upload' && 'Upload Documentation'}
            {activeTab === 'analytics' && 'Analytics Dashboard'}
          </h2>
          <p className="text-gray-600">
            {activeTab === 'chat' && 'Ask questions about design components and get instant answers'}
            {activeTab === 'search' && 'Search through 500+ pages of documentation using natural language'}
            {activeTab === 'upload' && 'Add new documentation to expand the AI knowledge base'}
            {activeTab === 'analytics' && 'View usage statistics and popular queries'}
          </p>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'chat' && (
            <div className="h-[calc(100vh-12rem)]">
              <ChatInterface />
            </div>
          )}

          {activeTab === 'search' && <SearchInterface />}

          {activeTab === 'upload' && <DocumentUpload />}

          {activeTab === 'analytics' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Coming Soon</h3>
              <p className="text-gray-600">
                Analytics dashboard with usage statistics, popular queries, and user engagement metrics.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Stats */}
      <div className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-blue-600">150+</div>
            <div className="text-sm text-gray-600">Active Users</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-green-600">60%</div>
            <div className="text-sm text-gray-600">Faster Search</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-purple-600">500+</div>
            <div className="text-sm text-gray-600">Pages Indexed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-orange-600">40%</div>
            <div className="text-sm text-gray-600">More Adoption</div>
          </div>
        </div>
      </div>
    </div>
  );
};
