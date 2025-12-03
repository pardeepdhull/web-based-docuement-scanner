/**
 * DocuScan - Main Application Module
 * Web-Based Document Scanner & OCR Application
 */

const DocuScanApp = (function() {
    // State
    let currentView = 'scan';
    let currentDocumentId = null;
    let cameraStream = null;
    let isEditing = false;
    let documents = [];

    // DOM Elements
    const elements = {
        // Navigation
        navBtns: document.querySelectorAll('.nav-btn'),
        
        // Views
        scanView: document.getElementById('scan-view'),
        documentsView: document.getElementById('documents-view'),
        
        // Scan View Elements
        startCameraBtn: document.getElementById('start-camera-btn'),
        uploadBtn: document.getElementById('upload-btn'),
        fileInput: document.getElementById('file-input'),
        cameraContainer: document.getElementById('camera-container'),
        closeCameraBtn: document.getElementById('close-camera-btn'),
        cameraVideo: document.getElementById('camera-video'),
        captureCanvas: document.getElementById('capture-canvas'),
        captureBtn: document.getElementById('capture-btn'),
        previewContainer: document.getElementById('preview-container'),
        closePreviewBtn: document.getElementById('close-preview-btn'),
        previewImage: document.getElementById('preview-image'),
        docNameInput: document.getElementById('doc-name'),
        retakeBtn: document.getElementById('retake-btn'),
        saveScanBtn: document.getElementById('save-scan-btn'),
        
        // Text Editor Elements
        createTextBtn: document.getElementById('create-text-btn'),
        textEditorContainer: document.getElementById('text-editor-container'),
        closeTextEditorBtn: document.getElementById('close-text-editor-btn'),
        textPageNameInput: document.getElementById('text-page-name'),
        textPageContentInput: document.getElementById('text-page-content'),
        cancelTextPageBtn: document.getElementById('cancel-text-page-btn'),
        saveTextPageBtn: document.getElementById('save-text-page-btn'),
        
        // Documents View Elements
        searchInput: document.getElementById('search-input'),
        sortSelect: document.getElementById('sort-select'),
        documentsGrid: document.getElementById('documents-grid'),
        noDocuments: document.getElementById('no-documents'),
        goScanBtn: document.getElementById('go-scan-btn'),
        
        // Viewer Modal Elements
        viewerModal: document.getElementById('viewer-modal'),
        viewerTitle: document.getElementById('viewer-title'),
        closeViewerBtn: document.getElementById('close-viewer-btn'),
        tabBtns: document.querySelectorAll('.tab-btn'),
        imageTab: document.getElementById('image-tab'),
        textTab: document.getElementById('text-tab'),
        splitTab: document.getElementById('split-tab'),
        viewerImage: document.getElementById('viewer-image'),
        splitImage: document.getElementById('split-image'),
        textContent: document.getElementById('text-content'),
        splitTextContent: document.getElementById('split-text-content'),
        editTextBtn: document.getElementById('edit-text-btn'),
        copyTextBtn: document.getElementById('copy-text-btn'),
        downloadTextBtn: document.getElementById('download-text-btn'),
        deleteDocBtn: document.getElementById('delete-doc-btn'),
        reprocessBtn: document.getElementById('reprocess-btn'),
        saveTextBtn: document.getElementById('save-text-btn'),
        
        // Processing Modal Elements
        processingModal: document.getElementById('processing-modal'),
        processingText: document.getElementById('processing-text'),
        progressFill: document.getElementById('progress-fill'),
        progressStatus: document.getElementById('progress-status'),
        
        // Confirmation Modal Elements
        confirmModal: document.getElementById('confirm-modal'),
        confirmTitle: document.getElementById('confirm-title'),
        confirmMessage: document.getElementById('confirm-message'),
        confirmCancelBtn: document.getElementById('confirm-cancel-btn'),
        confirmOkBtn: document.getElementById('confirm-ok-btn'),
        
        // Toast Container
        toastContainer: document.getElementById('toast-container')
    };

    // Confirmation callback
    let confirmCallback = null;

    /**
     * Initialize the application
     */
    function init() {
        setupEventListeners();
        loadDocuments();
        
        // Set PDF.js worker
        if (typeof pdfjsLib !== 'undefined') {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
        }
    }

    /**
     * Setup all event listeners
     */
    function setupEventListeners() {
        // Navigation
        elements.navBtns.forEach(btn => {
            btn.addEventListener('click', () => switchView(btn.dataset.view));
        });

        // Scan View
        elements.startCameraBtn.addEventListener('click', startCamera);
        elements.uploadBtn.addEventListener('click', () => elements.fileInput.click());
        elements.fileInput.addEventListener('change', handleFileUpload);
        elements.closeCameraBtn.addEventListener('click', stopCamera);
        elements.captureBtn.addEventListener('click', captureImage);
        elements.closePreviewBtn.addEventListener('click', closePreview);
        elements.retakeBtn.addEventListener('click', retake);
        elements.saveScanBtn.addEventListener('click', saveDocument);

        // Text Editor
        elements.createTextBtn.addEventListener('click', showTextEditor);
        elements.closeTextEditorBtn.addEventListener('click', closeTextEditor);
        elements.cancelTextPageBtn.addEventListener('click', closeTextEditor);
        elements.saveTextPageBtn.addEventListener('click', saveTextPage);

        // Documents View
        elements.searchInput.addEventListener('input', debounce(filterDocuments, 300));
        elements.sortSelect.addEventListener('change', sortDocuments);
        elements.goScanBtn.addEventListener('click', () => switchView('scan'));

        // Viewer Modal
        elements.closeViewerBtn.addEventListener('click', closeViewer);
        elements.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        });
        elements.editTextBtn.addEventListener('click', toggleEdit);
        elements.copyTextBtn.addEventListener('click', copyText);
        elements.downloadTextBtn.addEventListener('click', downloadText);
        elements.deleteDocBtn.addEventListener('click', deleteDocument);
        elements.reprocessBtn.addEventListener('click', reprocessOCR);
        elements.saveTextBtn.addEventListener('click', saveTextChanges);
        elements.textContent.addEventListener('input', () => {
            elements.saveTextBtn.disabled = false;
        });

        // Confirmation Modal
        elements.confirmCancelBtn.addEventListener('click', hideConfirm);
        elements.confirmOkBtn.addEventListener('click', () => {
            if (confirmCallback) {
                confirmCallback();
            }
            hideConfirm();
        });

        // Close modals on outside click
        elements.viewerModal.addEventListener('click', (e) => {
            if (e.target === elements.viewerModal) closeViewer();
        });
        elements.confirmModal.addEventListener('click', (e) => {
            if (e.target === elements.confirmModal) hideConfirm();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (!elements.confirmModal.classList.contains('hidden')) {
                    hideConfirm();
                } else if (!elements.viewerModal.classList.contains('hidden')) {
                    closeViewer();
                } else if (!elements.cameraContainer.classList.contains('hidden')) {
                    stopCamera();
                } else if (!elements.previewContainer.classList.contains('hidden')) {
                    closePreview();
                } else if (!elements.textEditorContainer.classList.contains('hidden')) {
                    closeTextEditor();
                }
            }
        });
    }

    /**
     * Switch between views
     * @param {string} view - View name ('scan' or 'documents')
     */
    function switchView(view) {
        currentView = view;
        
        // Update navigation
        elements.navBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        // Update views
        elements.scanView.classList.toggle('active', view === 'scan');
        elements.documentsView.classList.toggle('active', view === 'documents');
        
        // Reset scan view state when switching away
        if (view !== 'scan') {
            stopCamera();
            closePreview();
            closeTextEditor();
        }
        
        // Reload documents when switching to documents view
        if (view === 'documents') {
            loadDocuments();
        }
    }

    /**
     * Start the camera for scanning
     */
    async function startCamera() {
        try {
            const constraints = {
                video: {
                    facingMode: { ideal: 'environment' },
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            };
            
            cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
            elements.cameraVideo.srcObject = cameraStream;
            elements.cameraContainer.classList.remove('hidden');
            
            showToast('Camera started successfully', 'success');
        } catch (error) {
            console.error('Camera error:', error);
            showToast('Failed to access camera. Please check permissions.', 'error');
        }
    }

    /**
     * Stop the camera
     */
    function stopCamera() {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            cameraStream = null;
        }
        elements.cameraVideo.srcObject = null;
        elements.cameraContainer.classList.add('hidden');
    }

    /**
     * Capture image from camera
     */
    function captureImage() {
        const video = elements.cameraVideo;
        const canvas = elements.captureCanvas;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        showPreview(imageData);
        stopCamera();
    }

    /**
     * Handle file upload
     * @param {Event} event - File input change event
     */
    async function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        try {
            let imageData;
            
            if (file.type === 'application/pdf') {
                imageData = await convertPDFToImage(file);
            } else if (file.type.startsWith('image/')) {
                imageData = await readFileAsDataURL(file);
            } else {
                showToast('Unsupported file type. Please upload an image or PDF.', 'error');
                return;
            }
            
            // Set default name from file name
            const fileName = file.name.replace(/\.[^/.]+$/, '');
            elements.docNameInput.value = fileName;
            
            showPreview(imageData);
        } catch (error) {
            console.error('File upload error:', error);
            showToast('Failed to process file.', 'error');
        }
        
        // Reset file input
        event.target.value = '';
    }

    /**
     * Convert PDF to image
     * @param {File} file - PDF file
     * @returns {Promise<string>} - Base64 image data
     */
    async function convertPDFToImage(file) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        
        const scale = 2;
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({
            canvasContext: ctx,
            viewport: viewport
        }).promise;
        
        return canvas.toDataURL('image/jpeg', 0.9);
    }

    /**
     * Read file as Data URL
     * @param {File} file - File to read
     * @returns {Promise<string>} - Base64 data URL
     */
    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /**
     * Show image preview
     * @param {string} imageData - Base64 image data
     */
    function showPreview(imageData) {
        elements.previewImage.src = imageData;
        elements.previewContainer.classList.remove('hidden');
        
        // Set default document name if empty
        if (!elements.docNameInput.value) {
            elements.docNameInput.value = `Document ${new Date().toLocaleDateString()}`;
        }
    }

    /**
     * Close preview
     */
    function closePreview() {
        elements.previewContainer.classList.add('hidden');
        elements.previewImage.src = '';
        elements.docNameInput.value = '';
    }

    /**
     * Retake - go back to scanning
     */
    function retake() {
        closePreview();
        startCamera();
    }

    /**
     * Show text editor for creating text pages
     */
    function showTextEditor() {
        // Close other containers if open
        stopCamera();
        closePreview();
        
        // Set default title
        elements.textPageNameInput.value = `Text Page ${new Date().toLocaleDateString()}`;
        elements.textPageContentInput.value = '';
        
        // Show text editor
        elements.textEditorContainer.classList.remove('hidden');
        elements.textPageContentInput.focus();
    }

    /**
     * Close text editor
     */
    function closeTextEditor() {
        elements.textEditorContainer.classList.add('hidden');
        elements.textPageNameInput.value = '';
        elements.textPageContentInput.value = '';
    }

    /**
     * Save text page
     */
    async function saveTextPage() {
        const name = elements.textPageNameInput.value.trim() || 'Untitled Text Page';
        const content = elements.textPageContentInput.value.trim();
        
        // Validation: prevent saving empty text pages
        if (!content) {
            showToast('Please enter some content for the text page', 'error');
            elements.textPageContentInput.focus();
            return;
        }
        
        try {
            // Save to database
            await DocuDB.addDocument({
                name,
                imageData: null,
                extractedText: content,
                processed: true,
                type: 'text-page'
            });
            
            closeTextEditor();
            showToast('Text page saved successfully!', 'success');
            
            // Switch to documents view
            switchView('documents');
        } catch (error) {
            console.error('Save error:', error);
            showToast('Failed to save text page: ' + error.message, 'error');
        }
    }

    /**
     * Save document and process OCR
     */
    async function saveDocument() {
        const imageData = elements.previewImage.src;
        const name = elements.docNameInput.value.trim() || 'Untitled Document';
        
        if (!imageData) {
            showToast('No image to save', 'error');
            return;
        }
        
        // Show processing modal
        showProcessing('Processing Document...');
        
        try {
            // Extract text using OCR
            const extractedText = await performOCR(imageData);
            
            // Save to database
            const docId = await DocuDB.addDocument({
                name,
                imageData,
                extractedText,
                processed: true,
                type: 'scanned-document'
            });
            
            hideProcessing();
            closePreview();
            showToast('Document saved successfully!', 'success');
            
            // Switch to documents view
            switchView('documents');
        } catch (error) {
            console.error('Save error:', error);
            hideProcessing();
            showToast('Failed to save document: ' + error.message, 'error');
        }
    }

    /**
     * Perform OCR on image
     * @param {string} imageData - Base64 image data
     * @returns {Promise<string>} - Extracted text
     */
    async function performOCR(imageData) {
        updateProgress(0, 'Initializing OCR engine...');
        
        try {
            const worker = await Tesseract.createWorker('eng', 1, {
                logger: (m) => {
                    if (m.status === 'recognizing text') {
                        const progress = Math.round(m.progress * 100);
                        updateProgress(progress, `Recognizing text... ${progress}%`);
                    } else {
                        updateProgress(m.progress * 50, m.status);
                    }
                }
            });
            
            const { data: { text } } = await worker.recognize(imageData);
            await worker.terminate();
            
            updateProgress(100, 'Complete!');
            return text.trim();
        } catch (error) {
            console.error('OCR error:', error);
            throw new Error('OCR processing failed');
        }
    }

    /**
     * Load all documents
     */
    async function loadDocuments() {
        try {
            documents = await DocuDB.getAllDocuments();
            renderDocuments();
        } catch (error) {
            console.error('Load error:', error);
            showToast('Failed to load documents', 'error');
        }
    }

    /**
     * Render documents grid
     */
    function renderDocuments() {
        const grid = elements.documentsGrid;
        
        if (documents.length === 0) {
            grid.innerHTML = '';
            elements.noDocuments.classList.remove('hidden');
            return;
        }
        
        elements.noDocuments.classList.add('hidden');
        
        // Sort documents
        const sortValue = elements.sortSelect.value;
        const sortedDocs = sortDocumentsList(documents, sortValue);
        
        // Filter by search
        const searchQuery = elements.searchInput.value.toLowerCase();
        const filteredDocs = searchQuery 
            ? sortedDocs.filter(doc => 
                doc.name.toLowerCase().includes(searchQuery) ||
                (doc.extractedText && doc.extractedText.toLowerCase().includes(searchQuery))
              )
            : sortedDocs;
        
        if (filteredDocs.length === 0) {
            grid.innerHTML = '<p class="no-results">No documents match your search.</p>';
            return;
        }
        
        grid.innerHTML = filteredDocs.map(doc => {
            const isTextPage = doc.type === 'text-page';
            const docTypeIcon = isTextPage ? '📝' : '📷';
            const docTypeLabel = isTextPage ? 'Text Page' : 'Scanned';
            const docTypeClass = isTextPage ? 'text-page' : 'scanned-document';
            
            // For text pages, show a text preview thumbnail; for scanned docs, show image
            const thumbnailHtml = isTextPage 
                ? `<div class="text-page-thumbnail">
                       <span class="text-icon">📄</span>
                       <span class="text-preview">${escapeHtml((doc.extractedText || '').substring(0, 100))}${(doc.extractedText || '').length > 100 ? '...' : ''}</span>
                   </div>`
                : `<img class="document-thumbnail" src="${doc.imageData}" alt="${escapeHtml(doc.name)}" loading="lazy">`;
            
            return `
                <div class="document-card" data-id="${doc.id}">
                    ${thumbnailHtml}
                    <div class="document-info">
                        <div class="document-name" title="${escapeHtml(doc.name)}">${escapeHtml(doc.name)}</div>
                        <div class="document-date">${formatDate(doc.createdAt)}</div>
                        <span class="document-type-badge ${docTypeClass}">
                            ${docTypeIcon} ${docTypeLabel}
                        </span>
                        <span class="document-status ${doc.processed ? 'processed' : 'pending'}">
                            ${doc.processed ? '✓ Processed' : '⏳ Pending'}
                        </span>
                    </div>
                </div>
            `;
        }).join('');
        
        // Add click handlers
        grid.querySelectorAll('.document-card').forEach(card => {
            card.addEventListener('click', () => openViewer(card.dataset.id));
        });
    }

    /**
     * Sort documents list
     * @param {Array} docs - Documents array
     * @param {string} sortValue - Sort option
     * @returns {Array} - Sorted documents
     */
    function sortDocumentsList(docs, sortValue) {
        const sorted = [...docs];
        
        switch (sortValue) {
            case 'date-desc':
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'date-asc':
                return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'name-asc':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'name-desc':
                return sorted.sort((a, b) => b.name.localeCompare(a.name));
            default:
                return sorted;
        }
    }

    /**
     * Filter documents based on search input
     */
    function filterDocuments() {
        renderDocuments();
    }

    /**
     * Sort documents based on select value
     */
    function sortDocuments() {
        renderDocuments();
    }

    /**
     * Open document viewer
     * @param {string} docId - Document ID
     */
    async function openViewer(docId) {
        try {
            const doc = await DocuDB.getDocument(docId);
            if (!doc) {
                showToast('Document not found', 'error');
                return;
            }
            
            currentDocumentId = docId;
            const isTextPage = doc.type === 'text-page';
            
            // Set viewer content
            elements.viewerTitle.textContent = doc.name;
            elements.textContent.textContent = doc.extractedText || 'No text content';
            elements.splitTextContent.textContent = doc.extractedText || 'No text content';
            
            // Handle text pages vs scanned documents differently
            if (isTextPage) {
                // For text pages: hide image-related elements, show text tab
                elements.viewerImage.src = '';
                elements.splitImage.src = '';
                
                // Hide tabs that don't apply to text pages
                elements.tabBtns.forEach(btn => {
                    if (btn.dataset.tab === 'image' || btn.dataset.tab === 'split') {
                        btn.style.display = 'none';
                    } else {
                        btn.style.display = '';
                    }
                });
                
                // Hide reprocess button for text pages
                elements.reprocessBtn.style.display = 'none';
                
                // Switch to text tab
                switchTab('text');
            } else {
                // For scanned documents: show all tabs
                elements.viewerImage.src = doc.imageData;
                elements.splitImage.src = doc.imageData;
                
                // Show all tabs
                elements.tabBtns.forEach(btn => {
                    btn.style.display = '';
                });
                
                // Show reprocess button
                elements.reprocessBtn.style.display = '';
                
                // Switch to image tab
                switchTab('image');
            }
            
            // Reset edit state
            isEditing = false;
            elements.textContent.contentEditable = 'false';
            elements.editTextBtn.textContent = '✏️ Edit';
            elements.saveTextBtn.disabled = true;
            
            // Show modal
            elements.viewerModal.classList.remove('hidden');
        } catch (error) {
            console.error('Viewer error:', error);
            showToast('Failed to open document', 'error');
        }
    }

    /**
     * Close document viewer
     */
    function closeViewer() {
        elements.viewerModal.classList.add('hidden');
        currentDocumentId = null;
        
        // Reset edit state
        isEditing = false;
        elements.textContent.contentEditable = 'false';
    }

    /**
     * Switch viewer tab
     * @param {string} tab - Tab name
     */
    function switchTab(tab) {
        elements.tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        
        elements.imageTab.classList.toggle('active', tab === 'image');
        elements.textTab.classList.toggle('active', tab === 'text');
        elements.splitTab.classList.toggle('active', tab === 'split');
    }

    /**
     * Toggle text editing mode
     */
    function toggleEdit() {
        isEditing = !isEditing;
        elements.textContent.contentEditable = isEditing ? 'true' : 'false';
        elements.editTextBtn.textContent = isEditing ? '📝 Editing' : '✏️ Edit';
        
        if (isEditing) {
            elements.textContent.focus();
        }
    }

    /**
     * Copy text to clipboard
     */
    async function copyText() {
        const text = elements.textContent.textContent;
        
        try {
            await navigator.clipboard.writeText(text);
            showToast('Text copied to clipboard!', 'success');
        } catch (error) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast('Text copied to clipboard!', 'success');
        }
    }

    /**
     * Download text as file
     */
    function downloadText() {
        const text = elements.textContent.textContent;
        const fileName = elements.viewerTitle.textContent.replace(/[^a-z0-9]/gi, '_') + '.txt';
        
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('Text file downloaded!', 'success');
    }

    /**
     * Delete current document
     */
    function deleteDocument() {
        if (!currentDocumentId) return;
        
        showConfirm(
            'Delete Document',
            'Are you sure you want to delete this document? This action cannot be undone.',
            async () => {
                try {
                    await DocuDB.deleteDocument(currentDocumentId);
                    closeViewer();
                    loadDocuments();
                    showToast('Document deleted successfully', 'success');
                } catch (error) {
                    console.error('Delete error:', error);
                    showToast('Failed to delete document', 'error');
                }
            }
        );
    }

    /**
     * Re-process OCR for current document
     */
    async function reprocessOCR() {
        if (!currentDocumentId) return;
        
        try {
            const doc = await DocuDB.getDocument(currentDocumentId);
            if (!doc) return;
            
            // Only allow reprocessing for scanned documents
            if (doc.type === 'text-page') {
                showToast('OCR reprocessing is not available for text pages', 'warning');
                return;
            }
            
            closeViewer();
            showProcessing('Re-processing OCR...');
            
            const extractedText = await performOCR(doc.imageData);
            
            await DocuDB.updateDocument(currentDocumentId, {
                extractedText,
                processed: true
            });
            
            hideProcessing();
            showToast('OCR re-processed successfully!', 'success');
            loadDocuments();
            openViewer(currentDocumentId);
        } catch (error) {
            console.error('Reprocess error:', error);
            hideProcessing();
            showToast('Failed to re-process OCR', 'error');
        }
    }

    /**
     * Save text changes
     */
    async function saveTextChanges() {
        if (!currentDocumentId) return;
        
        const newText = elements.textContent.textContent;
        
        try {
            await DocuDB.updateDocument(currentDocumentId, {
                extractedText: newText
            });
            
            elements.splitTextContent.textContent = newText;
            elements.saveTextBtn.disabled = true;
            isEditing = false;
            elements.textContent.contentEditable = 'false';
            elements.editTextBtn.textContent = '✏️ Edit';
            
            showToast('Changes saved successfully!', 'success');
        } catch (error) {
            console.error('Save error:', error);
            showToast('Failed to save changes', 'error');
        }
    }

    /**
     * Show processing modal
     * @param {string} text - Processing text
     */
    function showProcessing(text) {
        elements.processingText.textContent = text;
        elements.progressFill.style.width = '0%';
        elements.progressStatus.textContent = 'Initializing...';
        elements.processingModal.classList.remove('hidden');
    }

    /**
     * Hide processing modal
     */
    function hideProcessing() {
        elements.processingModal.classList.add('hidden');
    }

    /**
     * Show confirmation modal
     * @param {string} title - Modal title
     * @param {string} message - Confirmation message
     * @param {Function} onConfirm - Callback when confirmed
     */
    function showConfirm(title, message, onConfirm) {
        elements.confirmTitle.textContent = title;
        elements.confirmMessage.textContent = message;
        confirmCallback = onConfirm;
        elements.confirmModal.classList.remove('hidden');
    }

    /**
     * Hide confirmation modal
     */
    function hideConfirm() {
        elements.confirmModal.classList.add('hidden');
        confirmCallback = null;
    }

    /**
     * Update progress bar
     * @param {number} progress - Progress percentage (0-100)
     * @param {string} status - Status text
     */
    function updateProgress(progress, status) {
        elements.progressFill.style.width = `${progress}%`;
        elements.progressStatus.textContent = status;
    }

    /**
     * Show toast notification
     * @param {string} message - Toast message
     * @param {string} type - Toast type ('success', 'error', 'warning')
     */
    function showToast(message, type = 'success') {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠'
        };
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${icons[type]}</span>
            <span class="toast-message">${escapeHtml(message)}</span>
            <button class="toast-close">&times;</button>
        `;
        
        elements.toastContainer.appendChild(toast);
        
        // Close button handler
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} - Escaped text
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Format date for display
     * @param {string} dateString - ISO date string
     * @returns {string} - Formatted date
     */
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Debounce function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} - Debounced function
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API
    return {
        switchView,
        loadDocuments
    };
})();
