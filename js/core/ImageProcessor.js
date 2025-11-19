/**
 * Core Image Processor Class
 * Manages the queue of files and executes strategies.
 */
class ImageProcessor {
    constructor() {
        this.queue = [];
        this.maxFiles = 100;
        this.listeners = {};
    }

    /**
     * Add files to the processing queue.
     * @param {FileList|File[]} files - List of files to add.
     * @returns {number} - Number of files added.
     */
    addFiles(files) {
        const filesToAdd = Array.from(files).filter(f => f.type.startsWith('image/'));
        
        if (this.queue.length + filesToAdd.length > this.maxFiles) {
            alert(`Max limit of ${this.maxFiles} files reached.`);
            return 0;
        }

        this.queue.push(...filesToAdd);
        this.emit('queueUpdated', this.queue);
        return filesToAdd.length;
    }

    /**
     * Clear the queue.
     */
    clearQueue() {
        this.queue = [];
        this.emit('queueUpdated', this.queue);
    }

    /**
     * Process the queue with a specific strategy.
     * @param {Object} strategy - The strategy object (must have execute method).
     * @param {Object} options - Options for the strategy.
     */
    async processQueue(strategy, options) {
        if (!strategy || typeof strategy.execute !== 'function') {
            throw new Error('Invalid strategy provided.');
        }

        this.emit('processingStart');

        const results = [];
        for (let i = 0; i < this.queue.length; i++) {
            const file = this.queue[i];
            try {
                this.emit('progress', { current: i + 1, total: this.queue.length, file: file.name });
                const result = await strategy.execute(file, options);
                results.push(result);
            } catch (error) {
                console.error(`Error processing ${file.name}:`, error);
                results.push({ error: error.message, file: file.name });
            }
        }

        this.emit('processingComplete', results);
        return results;
    }

    // Simple Event Emitter
    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    }
}

// Export singleton
window.imageProcessor = new ImageProcessor();
