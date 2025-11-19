/**
 * Favicon Strategy
 * Generates a set of standard app icons and favicons.
 * Dependencies: JSZip
 */
class FaviconStrategy extends BaseStrategy {
    /**
     * Execute the favicon generation.
     * @param {File} file - Input file.
     * @param {Object} options - Unused for now.
     */
    async execute(file, options = {}) {
        if (typeof JSZip === 'undefined') {
            throw new Error('JSZip library not loaded.');
        }

        const sizes = [16, 32, 180, 192, 512];
        const zip = new JSZip();
        const folder = zip.folder("icons");

        const dataUrl = await this.readFileAsDataURL(file);
        const img = await this.loadImage(dataUrl);

        // Generate each size
        const promises = sizes.map(size => {
            return new Promise((resolve) => {
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, size, size);

                canvas.toBlob((blob) => {
                    const name = size === 16 || size === 32 ? `favicon-${size}x${size}.png` : `icon-${size}x${size}.png`;
                    folder.file(name, blob);
                    resolve();
                }, 'image/png');
            });
        });

        await Promise.all(promises);

        const content = await zip.generateAsync({ type: "blob" });

        return {
            blob: content,
            fileName: 'app-icons.zip',
            originalName: file.name
        };
    }
}

window.FaviconStrategy = FaviconStrategy;
