# DocuScan - Web-Based Document Scanner & OCR

A complete web-based document scanning and OCR (Optical Character Recognition) application that runs entirely in the browser without requiring any software installation.

![DocuScan](https://img.shields.io/badge/DocuScan-v1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Browser](https://img.shields.io/badge/browser-compatible-brightgreen)

## 🚀 Features

### Core Features
- **📷 Scan Documents** - Use your device camera or webcam to scan documents
- **📤 Upload Files** - Support for JPEG, PNG, and PDF file uploads
- **🔍 OCR Text Extraction** - Extract text from scanned documents using Tesseract.js
- **📄 Document Management** - View, search, filter, and manage all your documents
- **✏️ Text Editing** - Edit extracted text with live preview
- **💾 Local Storage** - All documents stored locally in your browser using IndexedDB

### Additional Features
- 🎨 Modern, responsive UI design
- 🔎 Search documents by name or content
- 📊 Sort documents by date or name
- 📋 Copy text to clipboard
- ⬇️ Download extracted text as file
- 🖼️ Split view for document and text comparison
- 🔄 Re-process OCR for improved results
- 🗑️ Delete unwanted documents
- 📱 Mobile-friendly responsive design

## 🛠️ Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables and flexbox/grid
- **Vanilla JavaScript** - No framework dependencies
- **Tesseract.js** - OCR engine for text extraction
- **PDF.js** - PDF file rendering support
- **IndexedDB** - Browser-based document storage

## 📦 Installation

No installation required! DocuScan runs entirely in your browser.

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

### Scanning a Document

1. Click the **"Scan"** tab in the navigation
2. Choose one of the following options:
   - **Use Camera**: Click "Start Camera" to use your device camera
   - **Upload File**: Click "Choose File" to upload an existing image or PDF

3. If using camera:
   - Position the document within the camera view
   - Click "Capture" to take a photo

4. Preview your document and enter a name
5. Click "Save & Process OCR" to extract text

### Viewing Documents

1. Click the **"Documents"** tab in the navigation
2. Browse your scanned documents in the grid view
3. Use the search bar to find specific documents
4. Use the sort dropdown to organize by date or name
5. Click on any document card to open the viewer

### Document Viewer

The viewer provides three views:
- **Document**: View the original scanned image
- **Extracted Text**: View and edit the OCR-extracted text
- **Split View**: See document and text side by side

Available actions:
- **Edit**: Toggle text editing mode
- **Copy**: Copy text to clipboard
- **Download**: Download text as a .txt file
- **Re-process OCR**: Run OCR again for better results
- **Delete**: Remove the document

## 🌐 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 80+ | ✅ Full Support |
| Firefox | 75+ | ✅ Full Support |
| Safari | 14+ | ✅ Full Support |
| Edge | 80+ | ✅ Full Support |
| Mobile Chrome | Latest | ✅ Full Support |
| Mobile Safari | Latest | ✅ Full Support |

## 📁 Project Structure

```
web-based-document-scanner/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styles
├── js/
│   ├── db.js           # IndexedDB database module
│   └── app.js          # Main application logic
└── README.md           # Documentation
```

## 🔒 Privacy & Security

- **100% Client-Side**: All processing happens in your browser
- **No Server Required**: No data is sent to any external server
- **Local Storage**: Documents are stored in your browser's IndexedDB
- **Camera Access**: Camera permissions are requested only when needed
- **No Tracking**: No analytics or tracking of any kind

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Tesseract.js](https://github.com/naptha/tesseract.js) - OCR Engine
- [PDF.js](https://github.com/mozilla/pdf.js) - PDF Rendering

---

Made with ❤️ for document scanning on the web
