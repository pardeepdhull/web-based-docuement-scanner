# My Medical Details - Web-Based Document Scanner & OCR

A complete web-based medical document management system with OCR (Optical Character Recognition) capabilities that runs entirely in the browser without requiring any software installation. Manage your medical documents, medications, appointments, and health information securely in your browser.

![My Medical Details](https://img.shields.io/badge/My%20Medical%20Details-v1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Browser](https://img.shields.io/badge/browser-compatible-brightgreen)

## 📋 Table of Contents
- [Features](#-features)
- [Technology Stack](#️-technology-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Usage Guide](#-usage-guide)
- [Troubleshooting](#-troubleshooting)
- [Project Structure](#-project-structure)
- [Browser Compatibility](#-browser-compatibility)
- [Customization](#-customization)
- [Privacy & Security](#-privacy--security)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)
- [Acknowledgments](#-acknowledgments)

## 🚀 Features

### Core Features
- **📷 Scan Documents** - Use your device camera or webcam to scan medical documents
- **📤 Upload Files** - Support for JPEG, PNG, and PDF file uploads
- **🔍 OCR Text Extraction** - Extract text from scanned documents using Tesseract.js
- **📄 Document Management** - View, search, filter, and manage all your medical documents
- **✏️ Text Editing** - Edit extracted text with live preview
- **💾 Local Storage** - All data stored locally in your browser using IndexedDB
- **📝 Create Text Pages** - Manually create text-based notes and documents

### Medical Management Features
- **💊 Medication List** - Track all your medications with doses and schedules
- **📅 Appointment Calendar** - Manage medical appointments with calendar views (month/week/day)
- **🔔 Appointment Reminders** - Set reminders for upcoming appointments
- **👥 User Management** - Admin users can manage multiple user accounts

### Authentication & Security
- **🔐 User Authentication** - Secure login and registration system
- **👤 Multi-User Support** - Separate accounts for different family members or patients
- **🛡️ Admin Controls** - Administrative features for managing user access
- **🔒 Privacy First** - All data stays in your browser, no external servers

### Additional Features
- 🎨 Modern, responsive UI design with Material Symbols icons
- 🔎 Search documents by name or content
- 📊 Sort documents by date or name
- 📋 Copy text to clipboard
- ⬇️ Download extracted text as file
- 🖼️ Split view for document and text comparison
- 🔄 Re-process OCR for improved results
- 🗑️ Delete unwanted documents
- 📱 Mobile-friendly responsive design
- 🌙 Clean, professional interface optimized for healthcare use

## 🛠️ Technology Stack

- **HTML5** - Semantic markup with accessibility features
- **CSS3** - Modern styling with CSS variables, flexbox, and grid
- **Vanilla JavaScript** - No framework dependencies for maximum compatibility
- **Tesseract.js** - OCR engine for text extraction from images
- **PDF.js** - PDF file rendering and text extraction support
- **IndexedDB** - Browser-based document and data storage
- **Material Symbols** - Modern icon library for UI elements

## ✅ Prerequisites

### Minimum Requirements
- **Modern Web Browser** (one of the following):
  - Google Chrome 80+ or Chromium-based browsers
  - Mozilla Firefox 75+
  - Safari 14+
  - Microsoft Edge 80+
  - Mobile browsers: Chrome/Safari on iOS/Android

### Recommended Setup
- **Internet Connection**: Required for initial setup to load external libraries (Tesseract.js, PDF.js)
- **Camera Access**: Optional, required only if you want to scan documents using your device camera
- **Local Storage**: At least 50MB of available browser storage for document management
- **Screen Resolution**: Minimum 320px width (mobile-friendly)

### For Development/Local Hosting
- **Python 3.x** OR **Node.js** OR **PHP** (for running a local server)
- **Git** (for cloning the repository)
- **Text Editor** (VS Code, Sublime Text, etc. for customization)

### System Permissions
- **Camera Permission**: Browser will request camera access when using scan feature
- **Storage Permission**: Browser automatically manages IndexedDB storage

> **Note**: No installation or compilation required! This is a pure web application that runs entirely in your browser.

## 📦 Installation

No installation required! My Medical Details runs entirely in your browser.

### Option 1: Open Directly
Simply open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge).

### Option 2: Local Server
For the best experience (required for camera access on some browsers):

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (npx)
npx serve .

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

### Option 3: GitHub Pages
Host on GitHub Pages for free:
1. Push this repository to GitHub
2. Go to Settings → Pages
3. Select "main" branch and "/ (root)" folder
4. Your app will be available at `https://yourusername.github.io/repo-name`

## 📖 Usage Guide

### First Time Setup

1. **Open the Application**
   - Open `index.html` in your browser OR access via local server

2. **Create an Account**
   - Click "Sign Up" on the login screen
   - Enter a username and password
   - Confirm your password
   - Click "Sign Up" to create your account

3. **Login**
   - Use the demo credentials: `admin` / `admin123`
   - Or use your newly created account credentials

### Scanning a Document

1. Click the **"Scan"** tab in the navigation
2. Choose one of the following options:
   - **Use Camera**: Click "Start Camera" to use your device camera
   - **Upload File**: Click "Choose File" to upload an existing image or PDF
   - **Create Text Page**: Click "Create Text Page" to manually enter text

3. If using camera:
   - Allow camera permissions when prompted
   - Position the document within the camera view
   - Click "Capture" to take a photo

4. Preview your document and enter a descriptive name
5. Click "Save & Process OCR" to extract text from the document

### Managing Medications

1. Click the **"My Medication List"** tab
2. Click **"Add Medication"** button
3. Fill in the medication details:
   - Medication name (required)
   - Dose (e.g., "500mg", "2 tablets")
   - Start date (required)
   - Stop date (optional)
   - Additional notes
4. Click "Save Medication"
5. View all medications in the list with search functionality

### Managing Appointments

1. Click the **"Appointments"** tab
2. Click **"Add Appointment"** button
3. Enter appointment details:
   - Title (required)
   - Date and time (required)
   - Location (optional)
   - Category (e.g., Medical, Personal)
   - Description/Notes
   - Reminder settings
4. Click "Save Appointment"
5. View appointments in Month/Week/Day calendar views
6. Click on appointments to edit or delete them

### Viewing Documents

1. Click the **"Documents"** tab in the navigation
2. Browse your scanned documents in the grid view
3. Use the search bar to find specific documents by name or content
4. Use the sort dropdown to organize by:
   - Newest First
   - Oldest First
   - Name (A-Z)
   - Name (Z-A)
5. Click on any document card to open the viewer

### Document Viewer

The viewer provides three views:
- **Document**: View the original scanned image or PDF
- **Extracted Text**: View and edit the OCR-extracted text
- **Split View**: See document and text side by side for comparison

Available actions:
- **Edit**: Toggle text editing mode to modify extracted text
- **Copy**: Copy text to clipboard for use in other applications
- **Download**: Download text as a .txt file
- **Re-process OCR**: Run OCR again if initial results need improvement
- **Delete**: Remove the document permanently
- **Save Changes**: Save any edits made to the extracted text

### User Management (Admin Only)

1. Admin users will see the **"User Management"** tab
2. View all registered users in the system
3. Monitor user accounts and activity
4. Manage access control and permissions

> **Tip**: Regular backups of your browser data are recommended. Use browser export features or the download function for important documents.

## 🔧 Troubleshooting

### Camera Issues

**Problem**: Camera not starting or permission denied
- **Solution**: 
  - Check browser permissions and allow camera access
  - Ensure no other application is using the camera
  - Try using HTTPS (camera access may be blocked on HTTP)
  - Use a local server instead of opening the file directly
  - Check if your browser supports the MediaDevices API

**Problem**: Camera shows black screen
- **Solution**:
  - Refresh the page and try again
  - Check camera settings in your operating system
  - Try a different browser
  - Ensure proper lighting in the environment

### OCR Issues

**Problem**: OCR not extracting text correctly
- **Solution**:
  - Ensure document is well-lit and in focus
  - Try re-scanning with better image quality
  - Use the "Re-process OCR" button for another attempt
  - Make sure text is clearly visible and not too small
  - For best results, use high-contrast images (dark text on light background)

**Problem**: OCR processing is slow
- **Solution**:
  - This is normal for large or high-resolution images
  - Wait for the process to complete (may take 10-30 seconds)
  - Consider reducing image size before uploading
  - Close other browser tabs to free up memory

### Storage Issues

**Problem**: Cannot save documents or "Storage Full" error
- **Solution**:
  - Clear browser cache and unnecessary data
  - Check available browser storage in browser settings
  - Delete old or unnecessary documents
  - Each browser has storage limits (usually 50MB - 100MB)

**Problem**: Documents disappeared after clearing browser data
- **Solution**:
  - Browser data clearing will remove all stored documents
  - Always download important documents as backups
  - Consider exporting text regularly
  - IndexedDB data is tied to browser profile

### Login Issues

**Problem**: Cannot login or "Invalid credentials" error
- **Solution**:
  - Verify username and password are correct (case-sensitive)
  - Try using demo credentials: `admin` / `admin123`
  - Clear browser cache and cookies, then try again
  - If forgotten, you may need to clear browser data and create new account

**Problem**: Registration not working
- **Solution**:
  - Ensure username is unique
  - Make sure passwords match in both fields
  - Check browser console for error messages
  - Try a different browser if issue persists

### PDF Upload Issues

**Problem**: PDF file not uploading or processing
- **Solution**:
  - Ensure PDF file is not corrupted
  - Try a different PDF file to test
  - Check if PDF is text-based or image-based (image-based PDFs work better with OCR)
  - Large PDF files may take longer to process

### General Issues

**Problem**: Application not loading or blank screen
- **Solution**:
  - Check browser console for JavaScript errors (F12)
  - Ensure all files are in correct directory structure
  - Try clearing browser cache (Ctrl+Shift+Delete)
  - Verify internet connection for loading external libraries
  - Use a supported browser (see Browser Compatibility section)

**Problem**: Features not working on mobile
- **Solution**:
  - Some features may have limited mobile support
  - Use desktop mode in browser settings
  - Ensure mobile browser is up to date
  - Try in landscape mode for better experience

**Problem**: Slow performance
- **Solution**:
  - Close unnecessary browser tabs
  - Clear browser cache and data
  - Reduce number of stored documents
  - Use a modern device with adequate RAM (4GB+)

> **Need More Help?** Check the browser console (F12) for detailed error messages, or see the [Contact](#-contact) section to report issues.

## 🌐 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 80+ | ✅ Full Support |
| Firefox | 75+ | ✅ Full Support |
| Safari | 14+ | ✅ Full Support |
| Edge | 80+ | ✅ Full Support |
| Mobile Chrome | Latest | ✅ Full Support |
| Mobile Safari | Latest | ✅ Full Support |

## 🎨 Customization

### Theming and Styling

The application uses CSS variables for easy customization. You can modify the color scheme by editing `css/styles.css`:

```css
:root {
    --primary-color: #4285f4;      /* Main brand color */
    --secondary-color: #34a853;     /* Secondary accent */
    --danger-color: #ea4335;        /* Delete/warning actions */
    --background-color: #f5f5f5;    /* Page background */
    --text-color: #202124;          /* Primary text */
    --border-color: #dadce0;        /* Borders and dividers */
    /* ... and more */
}
```

### Customization Options

1. **Color Scheme**
   - Edit CSS variables in `css/styles.css` (lines near the top)
   - Change primary, secondary, and accent colors
   - Adjust background and text colors for different themes

2. **Logo and Branding**
   - Replace the Material Symbol icon in `index.html`
   - Update the `<title>` tag and brand name
   - Modify the login screen header and app name

3. **Default Settings**
   - Demo credentials: Modify in `js/auth.js`
   - OCR language: Configure in `js/app.js` (default: English)
   - Storage limits: Adjust validation in `js/db.js`

4. **Feature Toggle**
   - Comment out sections in `index.html` to hide features
   - Disable navigation items by adding `hidden` class
   - Remove unwanted features from the navigation menu

5. **OCR Configuration**
   - Language: Change Tesseract language in `js/app.js`
   - Recognition mode: Adjust PSM (Page Segmentation Mode)
   - Performance: Modify recognition parameters for speed vs accuracy

### Adding New Features

1. **New Data Types**
   - Add object stores in `js/db.js` (e.g., for lab results, prescriptions)
   - Create corresponding UI sections in `index.html`
   - Implement CRUD operations in `js/app.js`

2. **Additional Document Types**
   - Extend file input accept types in `index.html`
   - Add processing logic in `js/app.js`
   - Update viewer modal for new content types

3. **Export Formats**
   - Add export functions in `js/app.js` (CSV, JSON, etc.)
   - Create download utilities for different formats
   - Implement data serialization methods

### Development Tips

- Use browser DevTools for testing changes
- Test on multiple browsers and devices
- Keep backups before making structural changes
- Follow the existing code style and conventions
- Comment your custom modifications for future reference

## 📁 Project Structure

```
web-based-document-scanner/
├── index.html              # Main application HTML file
├── package.json            # NPM dependencies and project metadata
├── .gitignore             # Git ignore configuration
├── README.md              # Project documentation (this file)
│
├── css/
│   └── styles.css         # All application styles and responsive design
│
├── js/
│   ├── app.js             # Main application logic and UI interactions
│   ├── auth.js            # User authentication and session management
│   └── db.js              # IndexedDB database operations and data management
│
├── fonts/
│   └── [font files]       # Custom fonts (if any)
│
└── vendor/                # Third-party libraries (loaded locally)
    ├── tesseract.js/      # OCR engine files
    │   └── tesseract.min.js
    ├── pdf.min.mjs        # PDF.js library for PDF support
    └── pdf.worker.min.mjs # PDF.js web worker
```

### Key Files Description

- **index.html**: Main entry point with complete UI markup including login, document management, appointments, medications, and modals
- **css/styles.css**: Comprehensive styling with CSS variables, responsive design, and modern UI components
- **js/app.js**: Core application logic for document scanning, OCR processing, UI navigation, and feature coordination
- **js/auth.js**: User authentication system with login, registration, and session management
- **js/db.js**: IndexedDB wrapper for storing documents, medications, appointments, and user data
- **vendor/**: Local copies of external libraries for offline functionality

### Data Storage

All data is stored locally in IndexedDB with the following object stores:
- **documents**: Scanned documents with images and extracted text
- **medications**: Medication list with doses and schedules
- **appointments**: Calendar appointments with reminders
- **users**: User accounts and authentication data (hashed passwords)

## 🔒 Privacy & Security

- **100% Client-Side**: All processing happens in your browser
- **No Server Required**: No data is sent to any external server
- **Local Storage**: Documents are stored in your browser's IndexedDB
- **Camera Access**: Camera permissions are requested only when needed
- **No Tracking**: No analytics or tracking of any kind

## 🤝 Contributing

Contributions are welcome! We appreciate your interest in improving My Medical Details.

### How to Contribute

1. **Fork the repository**
   - Click the "Fork" button on GitHub
   - Clone your forked repository to your local machine

2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Make your changes**
   - Follow the existing code style and conventions
   - Test your changes across multiple browsers
   - Ensure responsive design is maintained
   - Add comments for complex logic

4. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

5. **Push to your branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

6. **Open a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Provide a clear description of your changes
   - Reference any related issues

### Contribution Guidelines

- **Code Quality**: Write clean, readable, and well-documented code
- **Testing**: Test on Chrome, Firefox, Safari, and mobile browsers
- **Responsive Design**: Ensure changes work on all screen sizes
- **Accessibility**: Maintain ARIA labels and keyboard navigation
- **Performance**: Keep bundle size minimal, optimize images and assets
- **Security**: Never commit sensitive data or credentials
- **Documentation**: Update README.md if adding new features

### Areas for Contribution

- 🐛 Bug fixes and error handling improvements
- ✨ New features (e.g., data export formats, print functionality)
- 🎨 UI/UX enhancements and accessibility improvements
- 📝 Documentation improvements and translations
- 🔧 Performance optimizations
- 🧪 Test coverage and quality assurance
- 🌍 Internationalization (i18n) support

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the issue, not the person
- Help create a welcoming environment for all contributors

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📧 Contact

### Project Maintainer

For questions, suggestions, or issues related to My Medical Details:

- **GitHub Issues**: [Report a bug or request a feature](https://github.com/pardeepdhull/web-based-docuement-scanner/issues)
- **GitHub Discussions**: [Ask questions or share ideas](https://github.com/pardeepdhull/web-based-docuement-scanner/discussions)
- **Repository**: [github.com/pardeepdhull/web-based-docuement-scanner](https://github.com/pardeepdhull/web-based-docuement-scanner)

### Getting Help

1. **Check the Documentation**: Review this README, especially the [Troubleshooting](#-troubleshooting) section
2. **Search Existing Issues**: Someone may have already reported or solved your problem
3. **Open a New Issue**: If your problem is new, create a detailed issue report with:
   - Clear description of the problem
   - Steps to reproduce
   - Browser and version information
   - Screenshots or error messages (if applicable)
   - Expected vs actual behavior

### Contributing

We welcome contributions! See the [Contributing](#-contributing) section for guidelines.

### Community

- Share your experience and use cases
- Help other users in discussions
- Contribute to documentation and translations
- Report bugs and suggest enhancements

> **Note**: This is an open-source project maintained by the community. Response times may vary.

## 🙏 Acknowledgments

This project leverages several excellent open-source libraries and resources:

- **[Tesseract.js](https://github.com/naptha/tesseract.js)** - Pure JavaScript OCR engine for browser-based text recognition
- **[PDF.js](https://github.com/mozilla/pdf.js)** - Mozilla's PDF rendering library for web browsers
- **[Material Symbols](https://fonts.google.com/icons)** - Google's comprehensive icon library
- **IndexedDB API** - Browser storage technology for client-side data persistence
- **MediaDevices API** - Web API for camera and media device access

### Inspiration

Built with a focus on:
- Privacy-first medical document management
- Accessibility and ease of use for all users
- Offline-capable progressive web application principles
- Modern web standards and best practices

### Special Thanks

- Open source community for continuous improvements and feedback
- Contributors who help improve this project
- Users who provide valuable feedback and bug reports

---

**Made with ❤️ for secure, private medical document management on the web**

*No servers, no tracking, no data collection - your medical information stays yours.*
