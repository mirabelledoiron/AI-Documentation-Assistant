# cPanel Deployment Guide

## Production Build Ready

Your AI Design System has been built and is ready for cPanel deployment.

## Files to Upload to cPanel

### Option 1: Upload the entire `dist` folder contents

Upload these files to your cPanel's `public_html` directory:

```jsx
📁 public_html/
├── index.html
└── assets/
    ├── index-CruKDM18.css
    └── index-Sa3Pe4VQ.js
```

### Option 2: Upload individual files

- `index.html` → `public_html/index.html`
- `assets/index-CruKDM18.css` → `public_html/assets/index-CruK18.css`
- `assets/index-Sa3Pe4VQ.js` → `public_html/assets/index-Sa3Pe4VQ.js`

## cPanel Upload Steps

1. **Login to cPanel**
2. **Go to File Manager**
3. **Navigate to `public_html`**
4. **Upload the files** (drag & drop or use upload button)
5. **Ensure file permissions** are set to 644 for files, 755 for folders

## Important Notes

### Environment Variables

- The app will work without API keys, but AI features will use fallback data
- To enable full AI functionality, you'll need to set environment variables in cPanel:
  - `VITE_CLAUDE_API_KEY` - Your Claude AI API key
  - `VITE_STORYBOOK_URL` - Your Storybook URL (optional)

### AI Functionality Setup

- **Want AI features to work?** See `AI_SETUP.md` for detailed instructions
- **Need help with Claude API key?** Check the AI setup guide
- **AI features include:** Component generation, code analysis, smart insights

### Storybook Connection

- The app is configured to connect to your Chromatic Storybook
- If you need to change the URL, update `src/services/storybookService.ts`

### File Paths

- The build uses relative paths, so it should work in any subdirectory
- If you deploy to a subdirectory (e.g., `yoursite.com/design-system/`), the app will work

## Testing After Deployment

1. **Visit your domain** - the app should load immediately
2. **Test navigation** - all tabs should work
3. **Test Quick Actions** - buttons should navigate between sections
4. **Check AI features** - if API key is set, code generation should work

## Troubleshooting

### If the app doesn't load

- Check file permissions (644 for files, 755 for folders)
- Ensure all files are uploaded to the correct location
- Check cPanel error logs

### If assets don't load

- Verify the `assets` folder is in the same directory as `index.html`
- Check that file names match exactly (case-sensitive)

### If AI features don't work

- Verify your Claude API key is set correctly
- Check browser console for any error messages
- See `AI_SETUP.md` for detailed troubleshooting

## Performance

- **CSS**: 26KB (5.19KB gzipped)
- **JavaScript**: 250KB (72.84KB gzipped)
- **Total**: ~276KB (78KB gzipped)

Your app is optimized and ready for production!

## Need Help?

- Check browser console for errors
- Verify all files are uploaded correctly
- Ensure proper file permissions in cPanel
- **For AI setup help:** See `AI_SETUP.md`
