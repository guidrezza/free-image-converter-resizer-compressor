/**
 * Upscale Strategy
 * Upscales images using bicubic smoothing.
 */
class UpscaleStrategy extends BaseStrategy {
    /**
     * Execute the upscale.
     * @param {File} file - Input file.
     * @param {Object} options - { scale: number (2, 4) }
     */
    async execute(file, options = {}) {
        const scale = options.scale || 2;

        const dataUrl = await this.readFileAsDataURL(file);
        const img = await this.loadImage(dataUrl);

        const targetWidth = img.width * scale;
        const targetHeight = img.height * scale;

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        // Enable high quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Preserve original format
        const format = file.type === 'image/jpeg' || file.type === 'image/webp' ? file.type : 'image/png';

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve({
                    blob: blob,
                    fileName: this.getNewFileName(file.name, scale),
                    originalName: file.name
                });
            }, format, 0.92);
        });
    }

    getNewFileName(originalName, scale) {
        const namePart = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
        const ext = originalName.split('.').pop();
        return `${namePart}-${scale}x.${ext}`;
    }
}

window.UpscaleStrategy = UpscaleStrategy;
