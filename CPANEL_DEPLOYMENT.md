# 🚀 cPanel Deployment Guide for AI Design System

## 📋 Prerequisites

- cPanel access to your hosting account
- FTP/SFTP access (if needed)
- Domain or subdomain configured

## 🎯 What We're Deploying

The AI Design System is a React-based application that includes:
- **AI Code Generator** - Generate components with Claude AI
- **Component Library** - Save and manage generated components
- **Design Tokens** - Manage your design system values
- **Dashboard** - Overview and analytics

## 📁 Production Build Files

Your production build is located in the `dist/` folder:
```
dist/
├── index.html (769B)
├── assets/
    ├── index-BLSNMaH1.css (29KB)
    └── index-CiKai4L8.js (277KB)
```

## 🚀 Deployment Steps

### Step 1: Access cPanel
1. Log into your hosting provider's cPanel
2. Navigate to **File Manager** or use **FTP/SFTP**

### Step 2: Navigate to Web Root
- **For main domain**: Go to `public_html/`
- **For subdomain**: Go to `public_html/subdomain_name/`
- **For subdirectory**: Go to `public_html/your_folder/`

### Step 3: Upload Files
1. **Upload all files** from the `dist/` folder to your web root
2. **Maintain the folder structure**:
   - `index.html` → root level
   - `assets/` folder → root level
   - All asset files inside `assets/`

### Step 4: Set Permissions
Set the following permissions:
- **Files**: `644`
- **Folders**: `755`
- **index.html**: `644`

### Step 5: Test Your Deployment
1. Visit your domain/subdomain
2. Verify the application loads correctly
3. Test the main features:
   - Dashboard loads
   - Navigation works
   - AI Generator accessible
   - Component Library accessible

## ⚙️ Environment Configuration

### For AI Features (Optional)
If you want to enable AI-powered code generation:

1. **Create `.env` file** in your web root:
```bash
VITE_CLAUDE_API_KEY=your_actual_api_key_here
```

2. **Get your Claude API key**:
   - Visit [Anthropic Console](https://console.anthropic.com/)
   - Create an account and get your API key
   - Add it to the `.env` file

3. **Restart your application** (if using Node.js hosting)

### Without API Key
The system will work with **fallback code generation** - no API key required!

## 🔧 Troubleshooting

### Common Issues

#### 1. **404 Errors**
- Ensure `index.html` is in the root directory
- Check that all asset files are in the `assets/` folder
- Verify file permissions are correct

#### 2. **Blank Page**
- Check browser console for JavaScript errors
- Verify CSS and JS files are loading
- Check file paths in `index.html`

#### 3. **Assets Not Loading**
- Ensure `assets/` folder is uploaded
- Check file permissions (644 for files, 755 for folders)
- Verify file names match exactly (case-sensitive)

#### 4. **CORS Issues**
- If using a subdomain, ensure proper DNS configuration
- Check that all files are served from the same domain

### Debug Steps
1. **Check browser console** for error messages
2. **Verify file paths** in browser network tab
3. **Test with different browsers** to isolate issues
4. **Check hosting error logs** in cPanel

## 🌐 Domain Configuration

### Main Domain
- Upload to `public_html/`
- Access via `yourdomain.com`

### Subdomain
- Upload to `public_html/subdomain_name/`
- Access via `subdomain.yourdomain.com`

### Subdirectory
- Upload to `public_html/your_folder/`
- Access via `yourdomain.com/your_folder/`

## 📱 Mobile Responsiveness

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔒 Security Considerations

1. **File Permissions**: Keep files at 644, folders at 755
2. **API Keys**: If using Claude API, keep `.env` secure
3. **HTTPS**: Enable SSL certificate for secure connections
4. **Regular Updates**: Keep your hosting environment updated

## 📊 Performance Optimization

The production build is already optimized with:
- **Minified CSS and JavaScript**
- **Optimized asset loading**
- **Efficient bundling**
- **Tree shaking for unused code**

## 🆘 Support

If you encounter issues:

1. **Check this guide** for common solutions
2. **Review browser console** for error messages
3. **Verify file structure** matches exactly
4. **Contact hosting support** for server-side issues

## 🎉 Success Indicators

Your deployment is successful when:
- ✅ Application loads without errors
- ✅ All navigation tabs work
- ✅ Dashboard displays correctly
- ✅ AI Generator is accessible
- ✅ Component Library loads
- ✅ Design Tokens display properly
- ✅ No console errors in browser

---

**🎯 Ready to deploy?** Follow these steps and you'll have your AI Design System running in no time!

**💡 Pro Tip**: Test thoroughly in a staging environment before deploying to production.
