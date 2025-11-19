/**
 * Compressor Strategy
 * Compresses images by adjusting quality.
 */
class CompressorStrategy extends BaseStrategy {
    /**
     * Execute the compression.
     * @param {File} file - Input file.
     * @param {Object} options - { quality: number (0-1) }
     */
    async execute(file, options = {}) {
        const quality = options.quality !== undefined ? options.quality : 0.8;

        const dataUrl = await this.readFileAsDataURL(file);
        const img = await this.loadImage(dataUrl);

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // Determine output format
        // PNG compression is lossless and doesn't support quality param in toBlob in the same way
        // So we default to JPEG if original is JPEG, or WebP if original is WebP.
        // If PNG, we might convert to JPEG or WebP for compression, OR just return as is if user wants PNG (but PNG doesn't compress well with this method).
        // Smart logic: If input is PNG, suggest converting to WebP for compression, or force WebP/JPEG.
        // For now, let's stick to: if JPEG/WebP, keep format. If PNG, convert to WebP for better compression.

        let format = file.type;
        if (format === 'image/png') {
            format = 'image/webp'; // Auto-convert PNG to WebP for compression
        }

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve({
                    blob: blob,
                    fileName: this.getNewFileName(file.name, format),
                    originalName: file.name
                });
            }, format, quality);
        });
    }

    getNewFileName(originalName, mimeType) {
        const namePart = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
        let ext = '';
        switch (mimeType) {
            case 'image/jpeg': ext = 'jpg'; break;
            case 'image/png': ext = 'png'; break;
            case 'image/webp': ext = 'webp'; break;
        }
        return `${namePart}-min.${ext}`;
    }
}

window.CompressorStrategy = CompressorStrategy;
