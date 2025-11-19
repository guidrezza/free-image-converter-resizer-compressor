/**
 * Base Strategy Class
 * Interface for all image operation strategies.
 */
class BaseStrategy {
    constructor() {
        if (this.constructor === BaseStrategy) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    /**
     * Execute the strategy on a file.
     * @param {File} file - The input file.
     * @param {Object} options - Configuration options.
     * @returns {Promise<Blob>} - The processed image blob.
     */
    async execute(file, options) {
        throw new Error("Method 'execute()' must be implemented.");
    }

    /**
     * Helper to read file as Data URL.
     * @param {File} file 
     * @returns {Promise<string>}
     */
    readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /**
     * Helper to load image from source.
     * @param {string} src 
     * @returns {Promise<HTMLImageElement>}
     */
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }
}

window.BaseStrategy = BaseStrategy;
