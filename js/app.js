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
    
    // Appointments state
    let appointments = [];
    let currentAppointmentId = null;
    let currentCalendarView = 'month';
    let currentDate = new Date();

    // DOM Elements
    const elements = {
        // Authentication Elements
        loginScreen: document.getElementById('login-screen'),
        registerScreen: document.getElementById('register-screen'),
        appContainer: document.getElementById('app-container'),
        loginForm: document.getElementById('login-form'),
        loginUsername: document.getElementById('login-username'),
        loginPassword: document.getElementById('login-password'),
        loginError: document.getElementById('login-error'),
        loginBtn: document.getElementById('login-btn'),
        registerForm: document.getElementById('register-form'),
        registerUsername: document.getElementById('register-username'),
        registerPassword: document.getElementById('register-password'),
        registerPasswordConfirm: document.getElementById('register-password-confirm'),
        registerError: document.getElementById('register-error'),
        registerBtn: document.getElementById('register-btn'),
        showRegisterLink: document.getElementById('show-register-link'),
        showLoginLink: document.getElementById('show-login-link'),
        logoutBtn: document.getElementById('logout-btn'),
        currentUsername: document.getElementById('current-username'),
        userManagementNavBtn: document.getElementById('user-management-nav-btn'),
        
        // Navigation
        navBtns: document.querySelectorAll('.nav-btn'),
        
        // Views
        scanView: document.getElementById('scan-view'),
        documentsView: document.getElementById('documents-view'),
        appointmentsView: document.getElementById('appointments-view'),
        usersView: document.getElementById('users-view'),
        
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
        
        // User Management Elements
        usersList: document.getElementById('users-list'),
        noUsers: document.getElementById('no-users'),
        
        // Appointments Elements
        calendarViewBtns: document.querySelectorAll('.view-toggle-btn'),
        addAppointmentBtn: document.getElementById('add-appointment-btn'),
        addAppointmentBtn2: document.getElementById('add-appointment-btn-2'),
        prevPeriodBtn: document.getElementById('prev-period-btn'),
        nextPeriodBtn: document.getElementById('next-period-btn'),
        todayBtn: document.getElementById('today-btn'),
        currentPeriod: document.getElementById('current-period'),
        monthCalendar: document.getElementById('month-calendar'),
        weekCalendar: document.getElementById('week-calendar'),
        dayCalendar: document.getElementById('day-calendar'),
        calendarGrid: document.getElementById('calendar-grid'),
        weekGrid: document.getElementById('week-grid'),
        dayGrid: document.getElementById('day-grid'),
        appointmentsList: document.getElementById('appointments-list'),
        noAppointments: document.getElementById('no-appointments'),
        
        // Appointment Modal Elements
        appointmentModal: document.getElementById('appointment-modal'),
        appointmentModalTitle: document.getElementById('appointment-modal-title'),
        closeAppointmentModalBtn: document.getElementById('close-appointment-modal-btn'),
        appointmentForm: document.getElementById('appointment-form'),
        appointmentTitle: document.getElementById('appointment-title'),
        appointmentDate: document.getElementById('appointment-date'),
        appointmentTime: document.getElementById('appointment-time'),
        appointmentLocation: document.getElementById('appointment-location'),
        appointmentCategory: document.getElementById('appointment-category'),
        appointmentDescription: document.getElementById('appointment-description'),
        appointmentReminder: document.getElementById('appointment-reminder'),
        cancelAppointmentBtn: document.getElementById('cancel-appointment-btn'),
        saveAppointmentBtn: document.getElementById('save-appointment-btn'),
        
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
        // Check authentication status first
        checkAuthAndShowScreen();
        
        // Setup event listeners
        setupEventListeners();
        
        // Set PDF.js worker
        if (typeof pdfjsLib !== 'undefined') {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
        }
    }

    /**
     * Check authentication status and show appropriate screen
     */
    function checkAuthAndShowScreen() {
        if (DocuAuth.isAuthenticated()) {
            showApp();
        } else {
            showLogin();
        }
    }

    /**
     * Show the login screen
     */
    function showLogin() {
        elements.loginScreen.classList.remove('hidden');
        elements.registerScreen.classList.add('hidden');
        elements.appContainer.classList.add('hidden');
        // Clear form
        elements.loginUsername.value = '';
        elements.loginPassword.value = '';
        elements.loginError.classList.add('hidden');
        elements.loginError.textContent = '';
    }

    /**
     * Show the registration screen
     */
    function showRegister() {
        elements.loginScreen.classList.add('hidden');
        elements.registerScreen.classList.remove('hidden');
        elements.appContainer.classList.add('hidden');
        // Clear form
        elements.registerUsername.value = '';
        elements.registerPassword.value = '';
        elements.registerPasswordConfirm.value = '';
        elements.registerError.classList.add('hidden');
        elements.registerError.textContent = '';
    }

    /**
     * Show the main application
     */
    function showApp() {
        elements.loginScreen.classList.add('hidden');
        elements.registerScreen.classList.add('hidden');
        elements.appContainer.classList.remove('hidden');
        // Display current username
        const username = DocuAuth.getCurrentUsername();
        if (username && elements.currentUsername) {
            elements.currentUsername.textContent = username;
        }
        // Show/hide user management button based on admin status
        if (elements.userManagementNavBtn) {
            if (DocuAuth.isAdmin()) {
                elements.userManagementNavBtn.classList.remove('hidden');
            } else {
                elements.userManagementNavBtn.classList.add('hidden');
            }
        }
        // Load documents when app is shown
        loadDocuments();
    }

    /**
     * Handle login form submission
     * @param {Event} event - Form submit event
     */
    async function handleLogin(event) {
        event.preventDefault();
        
        const username = elements.loginUsername.value;
        const password = elements.loginPassword.value;
        
        // Clear previous error
        elements.loginError.classList.add('hidden');
        elements.loginError.textContent = '';
        
        // Disable button during login
        elements.loginBtn.disabled = true;
        const btnTextElement = elements.loginBtn.querySelector('.btn-text');
        if (btnTextElement) {
            btnTextElement.textContent = 'Logging in...';
        }
        
        try {
            const result = await DocuAuth.login(username, password);
            
            if (result.success) {
                showApp();
            } else {
                elements.loginError.textContent = result.message;
                elements.loginError.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Login error:', error);
            elements.loginError.textContent = 'An error occurred during login';
            elements.loginError.classList.remove('hidden');
        } finally {
            elements.loginBtn.disabled = false;
            if (btnTextElement) {
                btnTextElement.textContent = 'Log In';
            }
        }
    }

    /**
     * Handle logout
     */
    function handleLogout() {
        DocuAuth.logout();
        showLogin();
    }

    /**
     * Handle registration form submission
     * @param {Event} event - Form submit event
     */
    async function handleRegister(event) {
        event.preventDefault();
        
        const username = elements.registerUsername.value;
        const password = elements.registerPassword.value;
        const passwordConfirm = elements.registerPasswordConfirm.value;
        
        // Clear previous error
        elements.registerError.classList.add('hidden');
        elements.registerError.textContent = '';
        
        // Check if passwords match
        if (password !== passwordConfirm) {
            elements.registerError.textContent = 'Passwords do not match';
            elements.registerError.classList.remove('hidden');
            return;
        }
        
        // Disable button during registration
        elements.registerBtn.disabled = true;
        const btnTextElement = elements.registerBtn.querySelector('.btn-text');
        if (btnTextElement) {
            btnTextElement.textContent = 'Creating account...';
        }
        
        try {
            const result = await DocuAuth.register(username, password);
            
            if (result.success) {
                showToast(result.message, 'success');
                // Auto-switch to login screen after successful registration
                setTimeout(() => {
                    showLogin();
                    // Pre-fill username
                    elements.loginUsername.value = username;
                }, 1500);
            } else {
                elements.registerError.textContent = result.message;
                elements.registerError.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Registration error:', error);
            elements.registerError.textContent = 'An error occurred during registration';
            elements.registerError.classList.remove('hidden');
        } finally {
            elements.registerBtn.disabled = false;
            if (btnTextElement) {
                btnTextElement.textContent = 'Sign Up';
            }
        }
    }

    /**
     * Setup all event listeners
     */
    function setupEventListeners() {
        // Authentication
        elements.loginForm.addEventListener('submit', handleLogin);
        elements.registerForm.addEventListener('submit', handleRegister);
        elements.showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            showRegister();
        });
        elements.showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            showLogin();
        });
        elements.logoutBtn.addEventListener('click', handleLogout);
        
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
        
        // Appointments View
        if (elements.calendarViewBtns) {
            elements.calendarViewBtns.forEach(btn => {
                btn.addEventListener('click', () => switchCalendarView(btn.dataset.calendarView));
            });
        }
        if (elements.addAppointmentBtn) {
            elements.addAppointmentBtn.addEventListener('click', () => openAppointmentModal());
        }
        if (elements.addAppointmentBtn2) {
            elements.addAppointmentBtn2.addEventListener('click', () => openAppointmentModal());
        }
        if (elements.prevPeriodBtn) {
            elements.prevPeriodBtn.addEventListener('click', navigatePreviousPeriod);
        }
        if (elements.nextPeriodBtn) {
            elements.nextPeriodBtn.addEventListener('click', navigateNextPeriod);
        }
        if (elements.todayBtn) {
            elements.todayBtn.addEventListener('click', navigateToday);
        }
        
        // Appointment Modal
        if (elements.closeAppointmentModalBtn) {
            elements.closeAppointmentModalBtn.addEventListener('click', closeAppointmentModal);
        }
        if (elements.cancelAppointmentBtn) {
            elements.cancelAppointmentBtn.addEventListener('click', closeAppointmentModal);
        }
        if (elements.appointmentForm) {
            elements.appointmentForm.addEventListener('submit', saveAppointment);
        }
        if (elements.appointmentModal) {
            elements.appointmentModal.addEventListener('click', (e) => {
                if (e.target === elements.appointmentModal) closeAppointmentModal();
            });
        }

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
                } else if (!elements.appointmentModal.classList.contains('hidden')) {
                    closeAppointmentModal();
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
     * @param {string} view - View name ('scan', 'documents', 'appointments', or 'users')
     */
    function switchView(view) {
        // Check if user is trying to access admin-only view
        if (view === 'users' && !DocuAuth.isAdmin()) {
            showToast('You do not have permission to access this page', 'error');
            return;
        }

        currentView = view;
        
        // Update navigation
        elements.navBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        // Update views
        elements.scanView.classList.toggle('active', view === 'scan');
        elements.documentsView.classList.toggle('active', view === 'documents');
        if (elements.appointmentsView) {
            elements.appointmentsView.classList.toggle('active', view === 'appointments');
        }
        if (elements.usersView) {
            elements.usersView.classList.toggle('active', view === 'users');
        }
        
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
        
        // Load appointments when switching to appointments view
        if (view === 'appointments') {
            loadAppointments();
            renderCalendar();
        }
        
        // Load users when switching to users view
        if (view === 'users') {
            loadUsers();
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
        
        // Set default title using ISO date format for consistency
        const dateStr = new Date().toISOString().split('T')[0];
        elements.textPageNameInput.value = `Text Page ${dateStr}`;
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
        const name = elements.textPageNameInput.value.trim();
        const content = elements.textPageContentInput.value.trim();
        
        // Validation: prevent saving with empty title
        if (!name) {
            showToast('Please enter a title for the text page', 'error');
            elements.textPageNameInput.focus();
            return;
        }
        
        // Validation: prevent saving empty text pages
        if (!content) {
            showToast('Please enter some content for the text page', 'error');
            elements.textPageContentInput.focus();
            return;
        }
        
        try {
            const username = DocuAuth.getCurrentUsername();
            if (!username) {
                showToast('You must be logged in to save documents', 'error');
                return;
            }
            
            // Save to database
            await DocuDB.addDocument({
                name,
                imageData: null,
                extractedText: content,
                processed: true,
                type: 'text-page'
            }, username);
            
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
        
        const username = DocuAuth.getCurrentUsername();
        if (!username) {
            showToast('You must be logged in to save documents', 'error');
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
            }, username);
            
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
            const username = DocuAuth.getCurrentUsername();
            if (!username) {
                documents = [];
                renderDocuments();
                return;
            }
            
            documents = await DocuDB.getDocumentsByUser(username);
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
            
            // Determine match type for search results
            let matchIndicator = '';
            if (searchQuery) {
                const titleMatch = doc.name.toLowerCase().includes(searchQuery);
                const contentMatch = doc.extractedText && doc.extractedText.toLowerCase().includes(searchQuery);
                
                if (titleMatch && contentMatch) {
                    matchIndicator = '<span class="match-indicator match-both">📌 Matches in title & content</span>';
                } else if (titleMatch) {
                    matchIndicator = '<span class="match-indicator match-title">📌 Matches in title</span>';
                } else if (contentMatch) {
                    matchIndicator = '<span class="match-indicator match-content">📌 Matches in content</span>';
                }
            }
            
            // For text pages, show a text preview thumbnail; for scanned docs, show image
            const textContent = doc.extractedText || '';
            const thumbnailHtml = isTextPage 
                ? `<div class="text-page-thumbnail">
                       <span class="text-icon">📄</span>
                       <span class="text-preview">${escapeHtml(textContent.substring(0, 100))}${textContent.length > 100 ? '...' : ''}</span>
                   </div>`
                : `<img class="document-thumbnail" src="${doc.imageData}" alt="${escapeHtml(doc.name)}" loading="lazy">`;
            
            return `
                <div class="document-card" data-id="${doc.id}">
                    ${thumbnailHtml}
                    <div class="document-info">
                        <div class="document-name" title="${escapeHtml(doc.name)}">${escapeHtml(doc.name)}</div>
                        <div class="document-date">${formatDate(doc.createdAt)}</div>
                        ${matchIndicator}
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
            
            // Security check: ensure document belongs to current user
            const currentUser = DocuAuth.getCurrentUsername();
            if (!currentUser || doc.username !== currentUser) {
                showToast('You do not have permission to view this document', 'error');
                return;
            }
            
            currentDocumentId = docId;
            const isTextPage = doc.type === 'text-page';
            
            // Set viewer content
            const fallbackText = 'No text content';
            elements.viewerTitle.textContent = doc.name;
            elements.textContent.textContent = doc.extractedText || fallbackText;
            elements.splitTextContent.textContent = doc.extractedText || fallbackText;
            
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
    async function deleteDocument() {
        if (!currentDocumentId) return;
        
        try {
            // Security check: ensure document belongs to current user
            const doc = await DocuDB.getDocument(currentDocumentId);
            if (!doc) {
                showToast('Document not found', 'error');
                return;
            }
            
            const currentUser = DocuAuth.getCurrentUsername();
            if (!currentUser || doc.username !== currentUser) {
                showToast('You do not have permission to delete this document', 'error');
                return;
            }
            
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
        } catch (error) {
            console.error('Delete check error:', error);
            showToast('Failed to verify document ownership', 'error');
        }
    }

    /**
     * Re-process OCR for current document
     */
    async function reprocessOCR() {
        if (!currentDocumentId) return;
        
        try {
            const doc = await DocuDB.getDocument(currentDocumentId);
            if (!doc) return;
            
            // Security check: ensure document belongs to current user
            const currentUser = DocuAuth.getCurrentUsername();
            if (!currentUser || doc.username !== currentUser) {
                showToast('You do not have permission to modify this document', 'error');
                return;
            }
            
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
        
        try {
            // Security check: ensure document belongs to current user
            const doc = await DocuDB.getDocument(currentDocumentId);
            if (!doc) {
                showToast('Document not found', 'error');
                return;
            }
            
            const currentUser = DocuAuth.getCurrentUsername();
            if (!currentUser || doc.username !== currentUser) {
                showToast('You do not have permission to modify this document', 'error');
                return;
            }
            
            const newText = elements.textContent.textContent;
            
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

    /**
     * Load all users (admin only)
     */
    function loadUsers() {
        if (!DocuAuth.isAdmin()) {
            showToast('Access denied: Admin only', 'error');
            switchView('scan');
            return;
        }

        const users = DocuAuth.getAllUsers();
        const currentUsername = DocuAuth.getCurrentUsername();
        
        // Filter out current user
        const otherUsers = users.filter(u => u.username !== currentUsername);
        
        renderUsers(otherUsers);
    }

    /**
     * Render users list
     * @param {Array} users - Array of user objects
     */
    function renderUsers(users) {
        const list = elements.usersList;
        
        if (users.length === 0) {
            list.innerHTML = '';
            elements.noUsers.classList.remove('hidden');
            return;
        }
        
        elements.noUsers.classList.add('hidden');
        
        list.innerHTML = users.map(user => {
            const statusClass = user.isActive ? 'active' : 'inactive';
            const statusText = user.isActive ? 'Active' : 'Inactive';
            const statusIcon = user.isActive ? '✓' : '✕';
            const toggleText = user.isActive ? 'Deactivate' : 'Activate';
            const roleText = user.isAdmin ? 'Admin' : 'User';
            const roleBadge = user.isAdmin ? '<span class="role-badge admin">👑 Admin</span>' : '<span class="role-badge user">👤 User</span>';
            
            return `
                <div class="user-card">
                    <div class="user-info">
                        <div class="user-header">
                            <h3 class="user-name">${escapeHtml(user.username)}</h3>
                            ${roleBadge}
                            <span class="user-status ${statusClass}">
                                ${statusIcon} ${statusText}
                            </span>
                        </div>
                        ${user.createdAt ? `<p class="user-date">Joined: ${formatDate(user.createdAt)}</p>` : ''}
                    </div>
                    <div class="user-actions">
                        <button class="btn btn-sm btn-secondary" onclick="DocuScanApp.toggleUserStatus('${escapeHtml(user.username)}', ${!user.isActive})">
                            ${toggleText}
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="DocuScanApp.confirmDeleteUser('${escapeHtml(user.username)}')">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Toggle user active status
     * @param {string} username - Username to toggle
     * @param {boolean} isActive - New active status
     */
    function toggleUserStatus(username, isActive) {
        if (!DocuAuth.isAdmin()) {
            showToast('Access denied: Admin only', 'error');
            return;
        }

        const success = DocuAuth.setUserStatus(username, isActive);
        
        if (success) {
            const statusText = isActive ? 'activated' : 'deactivated';
            showToast(`User ${username} has been ${statusText}`, 'success');
            loadUsers();
        } else {
            showToast('Failed to update user status', 'error');
        }
    }

    /**
     * Confirm user deletion
     * @param {string} username - Username to delete
     */
    function confirmDeleteUser(username) {
        if (!DocuAuth.isAdmin()) {
            showToast('Access denied: Admin only', 'error');
            return;
        }

        showConfirm(
            'Delete User',
            `Are you sure you want to delete user "${username}"? This action cannot be undone.`,
            () => deleteUser(username)
        );
    }

    /**
     * Delete a user
     * @param {string} username - Username to delete
     */
    function deleteUser(username) {
        if (!DocuAuth.isAdmin()) {
            showToast('Access denied: Admin only', 'error');
            return;
        }

        const success = DocuAuth.deleteUser(username);
        
        if (success) {
            showToast(`User ${username} has been deleted`, 'success');
            loadUsers();
        } else {
            showToast('Failed to delete user', 'error');
        }
    }

    // ========== APPOINTMENTS FUNCTIONS ==========

    /**
     * Load appointments from database
     */
    async function loadAppointments() {
        try {
            const username = DocuAuth.getCurrentUsername();
            if (!username) return;
            
            appointments = await DocuDB.getAppointmentsByUser(username);
            renderAppointmentsList();
        } catch (error) {
            console.error('Error loading appointments:', error);
            showToast('Failed to load appointments', 'error');
        }
    }

    /**
     * Switch calendar view
     * @param {string} view - 'month', 'week', or 'day'
     */
    function switchCalendarView(view) {
        currentCalendarView = view;
        
        // Update buttons
        elements.calendarViewBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.calendarView === view);
        });
        
        // Update calendar views
        if (elements.monthCalendar) {
            elements.monthCalendar.classList.toggle('active', view === 'month');
        }
        if (elements.weekCalendar) {
            elements.weekCalendar.classList.toggle('active', view === 'week');
        }
        if (elements.dayCalendar) {
            elements.dayCalendar.classList.toggle('active', view === 'day');
        }
        
        renderCalendar();
    }

    /**
     * Navigate to previous period
     */
    function navigatePreviousPeriod() {
        if (currentCalendarView === 'month') {
            currentDate.setMonth(currentDate.getMonth() - 1);
        } else if (currentCalendarView === 'week') {
            currentDate.setDate(currentDate.getDate() - 7);
        } else if (currentCalendarView === 'day') {
            currentDate.setDate(currentDate.getDate() - 1);
        }
        renderCalendar();
    }

    /**
     * Navigate to next period
     */
    function navigateNextPeriod() {
        if (currentCalendarView === 'month') {
            currentDate.setMonth(currentDate.getMonth() + 1);
        } else if (currentCalendarView === 'week') {
            currentDate.setDate(currentDate.getDate() + 7);
        } else if (currentCalendarView === 'day') {
            currentDate.setDate(currentDate.getDate() + 1);
        }
        renderCalendar();
    }

    /**
     * Navigate to today
     */
    function navigateToday() {
        currentDate = new Date();
        renderCalendar();
    }

    /**
     * Render the calendar based on current view
     */
    function renderCalendar() {
        if (currentCalendarView === 'month') {
            renderMonthCalendar();
        } else if (currentCalendarView === 'week') {
            renderWeekCalendar();
        } else if (currentCalendarView === 'day') {
            renderDayCalendar();
        }
        updatePeriodLabel();
    }

    /**
     * Update period label
     */
    function updatePeriodLabel() {
        if (!elements.currentPeriod) return;
        
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        
        if (currentCalendarView === 'month') {
            elements.currentPeriod.textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        } else if (currentCalendarView === 'week') {
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            elements.currentPeriod.textContent = `${months[startOfWeek.getMonth()]} ${startOfWeek.getDate()} - ${months[endOfWeek.getMonth()]} ${endOfWeek.getDate()}, ${currentDate.getFullYear()}`;
        } else if (currentCalendarView === 'day') {
            elements.currentPeriod.textContent = `${months[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
        }
    }

    /**
     * Render month calendar
     */
    function renderMonthCalendar() {
        if (!elements.calendarGrid) return;
        
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const prevLastDay = new Date(year, month, 0);
        
        const firstDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();
        const daysInPrevMonth = prevLastDay.getDate();
        
        let html = '';
        const today = new Date();
        
        // Previous month days
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            html += `<div class="calendar-day other-month"><div class="day-number">${day}</div></div>`;
        }
        
        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = date.toDateString() === today.toDateString();
            const dayAppointments = getAppointmentsForDate(date);
            
            let dayClass = 'calendar-day';
            if (isToday) dayClass += ' today';
            
            html += `
                <div class="${dayClass}" data-date="${date.toISOString()}">
                    <div class="day-number">${day}</div>
                    <div class="day-appointments">
                        ${dayAppointments.slice(0, 3).map(appt => `
                            <div class="calendar-appointment-dot" title="${escapeHtml(appt.title)}" onclick="DocuScanApp.editAppointment('${appt.id}')">
                                ${escapeHtml(appt.title)}
                            </div>
                        `).join('')}
                        ${dayAppointments.length > 3 ? `<div class="calendar-appointment-dot">+${dayAppointments.length - 3} more</div>` : ''}
                    </div>
                </div>
            `;
        }
        
        // Next month days
        const totalCells = firstDayOfWeek + daysInMonth;
        const remainingCells = 7 - (totalCells % 7);
        if (remainingCells < 7) {
            for (let day = 1; day <= remainingCells; day++) {
                html += `<div class="calendar-day other-month"><div class="day-number">${day}</div></div>`;
            }
        }
        
        elements.calendarGrid.innerHTML = html;
    }

    /**
     * Render week calendar
     */
    function renderWeekCalendar() {
        if (!elements.weekGrid) return;
        
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        
        let html = '<div class="week-time-label"></div>';
        
        // Day headers
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            html += `<div class="week-day-header">${days[i]}<br>${date.getDate()}</div>`;
        }
        
        // Time slots (8 AM to 8 PM)
        for (let hour = 8; hour <= 20; hour++) {
            html += `<div class="week-time-label">${hour}:00</div>`;
            for (let i = 0; i < 7; i++) {
                const date = new Date(startOfWeek);
                date.setDate(startOfWeek.getDate() + i);
                const dayAppointments = getAppointmentsForDateHour(date, hour);
                
                html += `
                    <div class="week-time-slot">
                        ${dayAppointments.map(appt => `
                            <div class="week-appointment" onclick="DocuScanApp.editAppointment('${appt.id}')" title="${escapeHtml(appt.title)}">
                                ${escapeHtml(appt.title)}
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        }
        
        elements.weekGrid.innerHTML = html;
    }

    /**
     * Render day calendar
     */
    function renderDayCalendar() {
        if (!elements.dayGrid) return;
        
        let html = '';
        
        // Time slots (8 AM to 8 PM)
        for (let hour = 8; hour <= 20; hour++) {
            const dayAppointments = getAppointmentsForDateHour(currentDate, hour);
            
            html += `
                <div class="day-time-label">${hour}:00</div>
                <div class="day-time-slot">
                    ${dayAppointments.map(appt => {
                        const time = new Date(appt.dateTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                        return `
                            <div class="day-appointment" onclick="DocuScanApp.editAppointment('${appt.id}')">
                                <div class="day-appointment-title">${escapeHtml(appt.title)}</div>
                                <div class="day-appointment-details">
                                    ${time}${appt.location ? ' • ' + escapeHtml(appt.location) : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }
        
        elements.dayGrid.innerHTML = html;
    }

    /**
     * Get appointments for a specific date
     */
    function getAppointmentsForDate(date) {
        const dateStr = date.toDateString();
        return appointments.filter(appt => {
            const apptDate = new Date(appt.dateTime);
            return apptDate.toDateString() === dateStr;
        }).sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    }

    /**
     * Get appointments for a specific date and hour
     */
    function getAppointmentsForDateHour(date, hour) {
        const dateStr = date.toDateString();
        return appointments.filter(appt => {
            const apptDate = new Date(appt.dateTime);
            return apptDate.toDateString() === dateStr && apptDate.getHours() === hour;
        }).sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    }

    /**
     * Render appointments list
     */
    function renderAppointmentsList() {
        if (!elements.appointmentsList) return;
        
        const now = new Date();
        const upcoming = appointments.filter(appt => new Date(appt.dateTime) >= now)
            .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
        
        if (upcoming.length === 0) {
            elements.noAppointments.classList.remove('hidden');
            elements.appointmentsList.innerHTML = '';
            return;
        }
        
        elements.noAppointments.classList.add('hidden');
        
        elements.appointmentsList.innerHTML = upcoming.map(appt => {
            const date = new Date(appt.dateTime);
            const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
            const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            
            return `
                <div class="appointment-card" onclick="DocuScanApp.editAppointment('${appt.id}')">
                    <div class="appointment-card-header">
                        <h3 class="appointment-title">${escapeHtml(appt.title)}</h3>
                        ${appt.category ? `<span class="appointment-category">${escapeHtml(appt.category)}</span>` : ''}
                    </div>
                    <div class="appointment-datetime">
                        <span>📅</span> ${dateStr} at ${timeStr}
                    </div>
                    ${appt.location ? `
                        <div class="appointment-location">
                            <span>📍</span> ${escapeHtml(appt.location)}
                        </div>
                    ` : ''}
                    ${appt.description ? `
                        <div class="appointment-description">${escapeHtml(appt.description)}</div>
                    ` : ''}
                    <div class="appointment-actions">
                        <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation(); DocuScanApp.editAppointment('${appt.id}')">✏️ Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="event.stopPropagation(); DocuScanApp.confirmDeleteAppointment('${appt.id}')">🗑️ Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Open appointment modal
     * @param {string} id - Optional appointment ID for editing
     */
    function openAppointmentModal(id = null) {
        if (!elements.appointmentModal) return;
        
        currentAppointmentId = id;
        
        if (id) {
            // Editing existing appointment
            const appt = appointments.find(a => a.id === id);
            if (appt) {
                elements.appointmentModalTitle.textContent = 'Edit Appointment';
                elements.appointmentTitle.value = appt.title;
                
                const date = new Date(appt.dateTime);
                elements.appointmentDate.value = date.toISOString().split('T')[0];
                elements.appointmentTime.value = date.toTimeString().slice(0, 5);
                
                elements.appointmentLocation.value = appt.location || '';
                elements.appointmentCategory.value = appt.category || '';
                elements.appointmentDescription.value = appt.description || '';
                elements.appointmentReminder.value = appt.reminder || 'none';
            }
        } else {
            // Creating new appointment
            elements.appointmentModalTitle.textContent = 'Add Appointment';
            elements.appointmentForm.reset();
            
            // Set default date to today
            const today = new Date();
            elements.appointmentDate.value = today.toISOString().split('T')[0];
        }
        
        elements.appointmentModal.classList.remove('hidden');
    }

    /**
     * Close appointment modal
     */
    function closeAppointmentModal() {
        if (!elements.appointmentModal) return;
        
        elements.appointmentModal.classList.add('hidden');
        elements.appointmentForm.reset();
        currentAppointmentId = null;
    }

    /**
     * Save appointment
     */
    async function saveAppointment(event) {
        event.preventDefault();
        
        const title = elements.appointmentTitle.value.trim();
        const date = elements.appointmentDate.value;
        const time = elements.appointmentTime.value;
        const location = elements.appointmentLocation.value.trim();
        const category = elements.appointmentCategory.value.trim();
        const description = elements.appointmentDescription.value.trim();
        const reminder = elements.appointmentReminder.value;
        
        if (!title || !date || !time) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        
        const dateTime = new Date(`${date}T${time}`).toISOString();
        
        const appointmentData = {
            title,
            dateTime,
            location,
            category,
            description,
            reminder
        };
        
        try {
            const username = DocuAuth.getCurrentUsername();
            
            if (currentAppointmentId) {
                // Update existing appointment
                await DocuDB.updateAppointment(currentAppointmentId, appointmentData);
                showToast('Appointment updated successfully', 'success');
            } else {
                // Create new appointment
                await DocuDB.addAppointment(appointmentData, username);
                showToast('Appointment added successfully', 'success');
            }
            
            closeAppointmentModal();
            await loadAppointments();
            renderCalendar();
        } catch (error) {
            console.error('Error saving appointment:', error);
            showToast('Failed to save appointment', 'error');
        }
    }

    /**
     * Edit appointment
     * @param {string} id - Appointment ID
     */
    function editAppointment(id) {
        openAppointmentModal(id);
    }

    /**
     * Confirm delete appointment
     * @param {string} id - Appointment ID
     */
    function confirmDeleteAppointment(id) {
        const appt = appointments.find(a => a.id === id);
        if (!appt) return;
        
        showConfirm(
            'Delete Appointment',
            `Are you sure you want to delete "${escapeHtml(appt.title)}"?`,
            () => deleteAppointmentById(id)
        );
    }

    /**
     * Delete appointment
     * @param {string} id - Appointment ID
     */
    async function deleteAppointmentById(id) {
        try {
            await DocuDB.deleteAppointment(id);
            showToast('Appointment deleted successfully', 'success');
            await loadAppointments();
            renderCalendar();
        } catch (error) {
            console.error('Error deleting appointment:', error);
            showToast('Failed to delete appointment', 'error');
        }
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
        loadDocuments,
        toggleUserStatus,
        confirmDeleteUser,
        editAppointment,
        confirmDeleteAppointment
    };
})();
