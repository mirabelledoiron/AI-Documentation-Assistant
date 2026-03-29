# AI Functionality Setup Guide

## Getting Your AI Features Working in cPanel

Your AI Design System has all the AI functionality built-in, but you need to configure your Claude API key to make it work.

## Step 1: Get Your Claude API Key

1. **Go to [Anthropic Console](https://console.anthropic.com/)**
2. **Sign in or create an account**
3. **Navigate to API Keys section**
4. **Create a new API key**
5. **Copy the key** (starts with `sk-ant-...`)

## Step 2: Set Environment Variables in cPanel

### Option A: Using cPanel Environment Variables (Recommended)

1. **Login to cPanel**
2. **Go to "Software" → "Setup Node.js App"**
3. **Create a new Node.js app** (if you don't have one)
4. **Add Environment Variable:**
   - **Name:** `VITE_CLAUDE_API_KEY`
   - **Value:** `sk-ant-...` (your actual API key)
5. **Save and restart the app**

### Option B: Using .htaccess (Alternative)

1. **In cPanel File Manager, create/edit `.htaccess` file**
2. **Add this line:**
   ```apache
   SetEnv VITE_CLAUDE_API_KEY "sk-ant-...your-key-here..."
   ```

### Option C: Using PHP (If you have PHP enabled)

1. **Create a `config.php` file in your root directory**
2. **Add:**
   ```php
   <?php
   putenv("VITE_CLAUDE_API_KEY=sk-ant-...your-key-here...");
   ?>
   ```

## Step 3: Test AI Functionality

After setting up your API key:

1. **Visit your deployed app**
2. **Go to "AI Generator" tab**
3. **Try generating a component:**
   - Select a component type (Button, Card, Input, etc.)
   - Choose your framework (React, Vue, etc.)
   - Select styling approach (Tailwind, CSS Modules, etc.)
   - Click "Generate Code"

## Step 4: Verify It's Working

### Success Indicators:
- Code generation completes without errors
- Generated code appears in the output area
- No "fallback code generation" messages
- Console shows successful API calls

### Troubleshooting:
- **"No Claude API key found"** → API key not set correctly
- **"Using fallback code generation"** → API key not accessible
- **Network errors** → Check API key format and permissions

## Step 5: Optional - Storybook Integration

To connect to your Chromatic Storybook:

1. **Add another environment variable:**
   - **Name:** `VITE_STORYBOOK_URL`
   - **Value:** `https://687bba4d795507daa442f549-cgildnerdh.chromatic.com`

2. **This enables:**
   - Component documentation viewing
   - Storybook connectivity
   - Component analysis features

## Security Notes:

**Important Security Considerations:**
- Never commit your API key to git
- Use environment variables, not hardcoded values
- Monitor your API usage in Anthropic Console
- Set up usage limits if needed

## API Usage:

Your Claude API key will be used for:
- **Component Generation** - Creating new UI components
- **Code Analysis** - Analyzing existing components
- **AI Insights** - Providing design system recommendations
- **Smart Suggestions** - Optimizing your design system

## Testing Your Setup:

1. **Generate a simple Button component**
2. **Check the browser console for API calls**
3. **Verify the generated code quality**
4. **Test different component types and frameworks**

## Need Help?

If you're still having issues:

1. **Check browser console** for error messages
2. **Verify environment variable** is set correctly
3. **Test API key** in Anthropic Console
4. **Check cPanel error logs** for any server issues

## Example Working Setup:

```bash
# In cPanel Environment Variables:
VITE_CLAUDE_API_KEY=sk-ant-api03-ABC123...XYZ789
VITE_STORYBOOK_URL=https://687bba4d795507daa442f549-cgildnerdh.chromatic.com
```

Once configured, your AI features will work exactly like they do in development!

---

**Next Steps:**
1. Get your Claude API key from Anthropic Console
2. Set the environment variable in cPanel
3. Test the AI Generator tab
4. Enjoy your fully functional AI-powered design system!
