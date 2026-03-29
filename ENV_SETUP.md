# Environment Setup for AI Code Generation

To enable AI-powered code generation in your design system, you need to set up your Claude API key.

## Step 1: Get Your Claude API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign in or create an account
3. Navigate to API Keys
4. Create a new API key
5. Copy the key (it starts with `sk-ant-...`)

## Step 2: Create Environment File

Create a `.env` file in your project root with:

```env
REACT_APP_CLAUDE_API_KEY=your_actual_api_key_here
```

**Important**: Replace `your_actual_api_key_here` with your real API key from step 1.

## Step 3: Restart Your Development Server

After creating the `.env` file:

1. Stop your current dev server (Ctrl+C)
2. Run `npm run dev` again

## Step 4: Test Code Generation

1. Go to the Code Generator tab
2. Select a component type
3. Click "Generate Component Code"
4. You should now see AI-generated code instead of fallback templates

## Troubleshooting

- **"No Claude API key found"**: Make sure your `.env` file exists and has the correct variable name
- **API errors**: Check that your API key is valid and has sufficient credits
- **Environment variable not loading**: Restart your dev server after creating the `.env` file

## Security Note

- Never commit your `.env` file to git
- The `.env` file is already in `.gitignore` to prevent accidental commits
- Keep your API key secure and don't share it publicly
