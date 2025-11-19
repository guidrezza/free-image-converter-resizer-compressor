/**
 * Base64 Strategy
 * Converts images to Base64 Data URIs.
 */
class Base64Strategy extends BaseStrategy {
    /**
     * Execute the conversion.
     * @param {File} file - Input file.
     * @param {Object} options - Unused.
     */
    async execute(file, options = {}) {
        const dataUrl = await this.readFileAsDataURL(file);

        return {
            dataUrl: dataUrl,
            fileName: file.name,
            originalName: file.name
        };
    }
}

window.Base64Strategy = Base64Strategy;
