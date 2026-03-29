-- docker/postgres/init.sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    url VARCHAR(500),
    category VARCHAR(100),
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create embeddings table
CREATE TABLE IF NOT EXISTS embeddings (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
    vector VECTOR(1536),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_queries table for analytics
CREATE TABLE IF NOT EXISTS user_queries (
    id SERIAL PRIMARY KEY,
    query TEXT NOT NULL,
    response TEXT,
    sources TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at);
CREATE INDEX IF NOT EXISTS idx_embeddings_document_id ON embeddings(document_id);
CREATE INDEX IF NOT EXISTS idx_user_queries_created_at ON user_queries(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for documents table
CREATE TRIGGER update_documents_updated_at 
    BEFORE UPDATE ON documents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create sample data
INSERT INTO documents (title, content, url, category, tags) VALUES
('Button Component', 
 'Primary buttons are used for the main action on a page. They should have high visual weight. Use the .btn-primary class. 
  
  **Properties:**
  - Padding: 12px 24px
  - Border radius: 6px
  - Font weight: 600
  - Background: #007BFF
  - Text color: #FFFFFF
  
  **Usage:**
  ```html
  <button class="btn-primary">Submit</button>
  ```',
 'https://design.indeed.com/components/button',
 'Components',
 ARRAY['button', 'components', 'interaction']),

('Spacing Guidelines',
 'Use a consistent spacing scale across the application. The base unit is 4px (0.25rem).
  
  **Spacing Scale:**
  - xs: 4px (0.25rem)
  - sm: 8px (0.5rem)
  - md: 16px (1rem)
  - lg: 24px (1.5rem)
  - xl: 32px (2rem)
  
  **Best Practices:**
  - Use consistent spacing between related elements
  - Increase spacing between unrelated sections
  - Use the spacing scale exclusively',
 'https://design.indeed.com/guidelines/spacing',
 'Guidelines',
 ARRAY['spacing', 'layout', 'guidelines']),

('Form Validation',
 'Form validation should provide clear, immediate feedback to users.
  
  **Validation States:**
  1. **Default**: No styling needed
  2. **Valid**: Green border, checkmark icon
  3. **Invalid**: Red border, error icon, error message
  
  **Error Messages:**
  - Should be specific and actionable
  - Appear near the invalid field
  - Use clear language
  
  **Example:**
  ```javascript
  if (!email.includes('@')) {
    showError('Please enter a valid email address');
  }
  ```',
 'https://design.indeed.com/patterns/form-validation',
 'Patterns',
 ARRAY['forms', 'validation', 'patterns']),

('Color Tokens',
 'Color tokens provide a consistent color system across the application.
  
  **Primary Colors:**
  - Primary: #007BFF
  - Primary-dark: #0056CC
  - Primary-light: #66B3FF
  
  **Semantic Colors:**
  - Success: #28A745
  - Warning: #FFC107
  - Danger: #DC3545
  
  **Neutral Colors:**
  - Gray-900: #212529
  - Gray-700: #495057
  - Gray-400: #CED4DA
  - Gray-100: #F8F9FA',
 'https://design.indeed.com/tokens/color',
 'Tokens',
 ARRAY['colors', 'tokens', 'design-tokens']),

('Accessibility Guidelines',
 'All components must meet WCAG 2.1 AA standards.
  
  **Key Requirements:**
  - Sufficient color contrast (4.5:1 for text)
  - Keyboard navigable
  - Screen reader compatible
  - Focus indicators visible
  
  **Testing Checklist:**
  - Use NVDA or VoiceOver for screen reader testing
  - Test keyboard navigation (Tab, Enter, Space)
  - Test color contrast with tools like Contrast Checker
  
  **Resources:**
  - [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
  - [ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)',
 'https://design.indeed.com/guidelines/accessibility',
 'Accessibility',
 ARRAY['a11y', 'accessibility', 'guidelines']);
