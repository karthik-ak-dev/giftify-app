# 🚀 Hostinger Deployment Guide for Giftify Frontend

This guide will walk you through deploying your React application to Hostinger hosting.

## 📋 Prerequisites

- ✅ Hostinger hosting account (Shared, VPS, or Cloud)
- ✅ Domain name configured with Hostinger
- ✅ Git repository access
- ✅ Local development environment set up

## 🛠️ Step-by-Step Deployment Process

### Step 1: Prepare Your Application

#### 1.1 Build the Production Version
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Build the production version
npm run build
```

#### 1.2 Verify Build Output
After building, you should see a `dist` folder with the following structure:
```
dist/
├── index.html
├── .htaccess
├── vite.svg
└── assets/
    ├── index-xxx.css
    ├── index-xxx.js
    ├── vendor-xxx.js
    └── router-xxx.js
```

### Step 2: Access Your Hostinger Control Panel

#### 2.1 Login to Hostinger
1. Go to [hostinger.com](https://hostinger.com)
2. Click "Login" and enter your credentials
3. Navigate to your hosting control panel

#### 2.2 Access File Manager
1. In the control panel, find "File Manager"
2. Click to open the File Manager
3. Navigate to `public_html` directory (this is your website's root)

### Step 3: Upload Your Application

#### 3.1 Clear Existing Files (Optional)
If you have existing files in `public_html`:
1. Select all files in `public_html`
2. Delete them (or move to backup folder)
3. **Note:** Keep any important files like `.htaccess` if you have custom configurations

#### 3.2 Upload Build Files
**Method 1: Using File Manager (Recommended for beginners)**
1. In File Manager, click "Upload Files"
2. Select all files from your local `dist` folder
3. Upload them to `public_html`
4. **Important:** Make sure `.htaccess` is uploaded to the root of `public_html`

**Method 2: Using FTP Client**
1. Download an FTP client (FileZilla, WinSCP, etc.)
2. Get your FTP credentials from Hostinger control panel
3. Connect to your server
4. Upload all contents of `dist` folder to `public_html`

### Step 4: Configure Domain (If Using Custom Domain)

#### 4.1 Domain Setup
1. In Hostinger control panel, go to "Domains"
2. Add your domain if not already added
3. Point your domain to the hosting account
4. Wait for DNS propagation (up to 24 hours)

#### 4.2 SSL Certificate
1. In control panel, find "SSL" section
2. Enable "Let's Encrypt" SSL certificate
3. This provides HTTPS security for your site

### Step 5: Test Your Deployment

#### 5.1 Basic Functionality Test
1. Visit your website URL
2. Check if the homepage loads correctly
3. Test navigation between pages
4. Verify all images and assets load

#### 5.2 React Router Test
1. Navigate to different pages (e.g., `/brands`, `/account`)
2. Refresh the page - it should still work
3. Try direct URL access (e.g., `yoursite.com/brands`)

#### 5.3 Performance Test
1. Use browser dev tools (F12)
2. Check Network tab for loading times
3. Verify compression is working (files should be smaller)

## 🔧 Configuration Files Explained

### .htaccess File
The `.htaccess` file in your `public` folder is automatically copied to `dist` and provides:

- **Client-side routing support** for React Router
- **Compression** for faster loading
- **Caching headers** for better performance
- **Security headers** for protection

### Vite Configuration
Your `vite.config.ts` is optimized for Hostinger:
- **Base path** set to `./` for correct asset loading
- **Code splitting** for better performance
- **Minification** for smaller file sizes

## 🚨 Troubleshooting

### Common Issues and Solutions

#### Issue 1: 404 Error on Direct Page Access
**Problem:** Visiting `/brands` directly shows 404 error
**Solution:** Ensure `.htaccess` file is uploaded to `public_html` root

#### Issue 2: Assets Not Loading
**Problem:** CSS/JS files return 404
**Solution:** Check that all files from `dist` folder are uploaded correctly

#### Issue 3: Slow Loading
**Problem:** Website loads slowly
**Solution:** 
- Verify compression is enabled in `.htaccess`
- Check if all assets are properly cached

#### Issue 4: Mixed Content Errors
**Problem:** HTTPS/HTTP mixed content warnings
**Solution:** Ensure your API endpoints use HTTPS

### Debugging Steps
1. **Check File Permissions:** Ensure files are readable (644 for files, 755 for directories)
2. **Verify .htaccess:** Make sure it's in the root of `public_html`
3. **Clear Browser Cache:** Hard refresh (Ctrl+F5) to see changes
4. **Check Error Logs:** Look in Hostinger control panel for error logs

## 📊 Performance Optimization

### Built-in Optimizations
Your build includes:
- ✅ **Code splitting** - Separate chunks for vendor libraries
- ✅ **Minification** - Compressed JavaScript and CSS
- ✅ **Tree shaking** - Removes unused code
- ✅ **Asset optimization** - Compressed images and fonts

### Additional Recommendations
1. **Enable Gzip compression** (handled by `.htaccess`)
2. **Set up CDN** for global content delivery
3. **Optimize images** before uploading
4. **Monitor performance** using browser dev tools

## 🔄 Updating Your Deployment

### For Future Updates
1. Make changes to your code locally
2. Run `npm run build` to create new `dist` folder
3. Upload new files to Hostinger (replace existing ones)
4. Test the updated website

### Automated Deployment (Advanced)
Consider setting up:
- **GitHub Actions** for automated builds
- **FTP deployment scripts** for one-click deployment
- **CI/CD pipelines** for continuous deployment

## 📞 Support Resources

### Hostinger Support
- **Documentation:** [help.hostinger.com](https://help.hostinger.com)
- **Live Chat:** Available in your control panel
- **Ticket System:** For complex issues

### React/Vite Support
- **Vite Docs:** [vitejs.dev](https://vitejs.dev)
- **React Router:** [reactrouter.com](https://reactrouter.com)
- **Tailwind CSS:** [tailwindcss.com](https://tailwindcss.com)

## ✅ Deployment Checklist

Before going live, ensure:
- [ ] All files uploaded to `public_html`
- [ ] `.htaccess` file in root directory
- [ ] SSL certificate enabled
- [ ] Domain pointing to hosting
- [ ] All pages accessible via direct URLs
- [ ] Images and assets loading correctly
- [ ] API endpoints configured (if applicable)
- [ ] Performance optimized
- [ ] Mobile responsiveness tested

## 🎉 Congratulations!

Your Giftify frontend should now be live on Hostinger! 

**Next Steps:**
1. Share your website URL
2. Monitor performance and user feedback
3. Set up analytics (Google Analytics, etc.)
4. Plan for future updates and maintenance

---

*For any deployment issues, refer to the troubleshooting section or contact Hostinger support.*
