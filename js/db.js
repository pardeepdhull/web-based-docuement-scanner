/**
 * DocuScan - IndexedDB Database Module
 * Handles all database operations for document storage
 */

const DocuDB = (function() {
    const DB_NAME = 'DocuScanDB';
    const DB_VERSION = 2;
    const STORE_NAME = 'documents';
    
    let db = null;

    /**
     * Initialize the IndexedDB database
     * @returns {Promise<IDBDatabase>}
     */
    async function init() {
        return new Promise((resolve, reject) => {
            if (db) {
                resolve(db);
                return;
            }

            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                reject(new Error('Failed to open database'));
            };

            request.onsuccess = (event) => {
                db = event.target.result;
                resolve(db);
            };

            request.onupgradeneeded = (event) => {
                const database = event.target.result;
                const transaction = event.target.transaction;
                
                // Create documents object store if it doesn't exist
                if (!database.objectStoreNames.contains(STORE_NAME)) {
                    const store = database.createObjectStore(STORE_NAME, { 
                        keyPath: 'id',
                        autoIncrement: false 
                    });
                    
                    // Create indexes for searching and sorting
                    store.createIndex('name', 'name', { unique: false });
                    store.createIndex('createdAt', 'createdAt', { unique: false });
                    store.createIndex('processed', 'processed', { unique: false });
                    store.createIndex('username', 'username', { unique: false });
                } else {
                    // If store exists, check if username index needs to be added
                    const store = transaction.objectStore(STORE_NAME);
                    if (!store.indexNames.contains('username')) {
                        store.createIndex('username', 'username', { unique: false });
                    }
                }
            };
        });
    }

    /**
     * Generate a unique ID for documents using cryptographically secure random values
     * @returns {string}
     */
    function generateId() {
        const randomPart = crypto.getRandomValues(new Uint32Array(2));
        return 'doc_' + Date.now() + '_' + randomPart[0].toString(36) + randomPart[1].toString(36);
    }

    /**
     * Add a new document to the database
     * @param {Object} document - Document object with imageData, name, etc.
     * @param {string} username - Username of the document owner
     * @returns {Promise<string>} - Document ID
     */
    async function addDocument(document, username) {
        await init();
        
        if (!username) {
            throw new Error('Username is required to add a document');
        }
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            
            const doc = {
                id: generateId(),
                name: document.name || 'Untitled Document',
                imageData: document.imageData || null,
                extractedText: document.extractedText || '',
                processed: document.processed || false,
                type: document.type || 'scanned-document', // 'scanned-document' or 'text-page'
                username: username,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            const request = store.add(doc);
            
            request.onsuccess = () => {
                resolve(doc.id);
            };
            
            request.onerror = () => {
                reject(new Error('Failed to add document'));
            };
        });
    }

    /**
     * Get a document by ID
     * @param {string} id - Document ID
     * @returns {Promise<Object|null>}
     */
    async function getDocument(id) {
        await init();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(id);
            
            request.onsuccess = () => {
                resolve(request.result || null);
            };
            
            request.onerror = () => {
                reject(new Error('Failed to get document'));
            };
        });
    }

    /**
     * Get all documents
     * @returns {Promise<Array>}
     */
    async function getAllDocuments() {
        await init();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();
            
            request.onsuccess = () => {
                resolve(request.result || []);
            };
            
            request.onerror = () => {
                reject(new Error('Failed to get documents'));
            };
        });
    }

    /**
     * Get documents by username
     * @param {string} username - Username to filter by
     * @returns {Promise<Array>}
     */
    async function getDocumentsByUser(username) {
        await init();
        
        if (!username) {
            return [];
        }
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const index = store.index('username');
            const request = index.getAll(username);
            
            request.onsuccess = () => {
                resolve(request.result || []);
            };
            
            request.onerror = () => {
                reject(new Error('Failed to get documents by user'));
            };
        });
    }

    /**
     * Update a document
     * @param {string} id - Document ID
     * @param {Object} updates - Fields to update
     * @returns {Promise<void>}
     */
    async function updateDocument(id, updates) {
        await init();
        
        const doc = await getDocument(id);
        if (!doc) {
            throw new Error('Document not found');
        }
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            
            const updatedDoc = {
                ...doc,
                ...updates,
                updatedAt: new Date().toISOString()
            };
            
            const request = store.put(updatedDoc);
            
            request.onsuccess = () => {
                resolve();
            };
            
            request.onerror = () => {
                reject(new Error('Failed to update document'));
            };
        });
    }

    /**
     * Delete a document
     * @param {string} id - Document ID
     * @returns {Promise<void>}
     */
    async function deleteDocument(id) {
        await init();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);
            
            request.onsuccess = () => {
                resolve();
            };
            
            request.onerror = () => {
                reject(new Error('Failed to delete document'));
            };
        });
    }

    /**
     * Clear all documents
     * @returns {Promise<void>}
     */
    async function clearAll() {
        await init();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.clear();
            
            request.onsuccess = () => {
                resolve();
            };
            
            request.onerror = () => {
                reject(new Error('Failed to clear documents'));
            };
        });
    }

    /**
     * Search documents by name for a specific user
     * @param {string} query - Search query
     * @param {string} username - Username to filter by
     * @returns {Promise<Array>}
     */
    async function searchDocuments(query, username) {
        if (!username) {
            return [];
        }
        
        const userDocs = await getDocumentsByUser(username);
        const lowerQuery = query.toLowerCase();
        
        return userDocs.filter(doc => 
            doc.name.toLowerCase().includes(lowerQuery) ||
            (doc.extractedText && doc.extractedText.toLowerCase().includes(lowerQuery))
        );
    }

    // Public API
    return {
        init,
        addDocument,
        getDocument,
        getAllDocuments,
        getDocumentsByUser,
        updateDocument,
        deleteDocument,
        clearAll,
        searchDocuments
    };
})();

// Initialize database on load
DocuDB.init().catch(console.error);
