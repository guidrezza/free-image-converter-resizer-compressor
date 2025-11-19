/**
 * Resizer Strategy
 * Resizes images to specific dimensions.
 */
class ResizerStrategy extends BaseStrategy {
    /**
     * Execute the resize.
     * @param {File} file - Input file.
     * @param {Object} options - { width: number, height: number, maintainAspectRatio: boolean }
     */
    async execute(file, options = {}) {
        const maintainAspectRatio = options.maintainAspectRatio !== false; // Default true
        let targetWidth = parseInt(options.width);
        let targetHeight = parseInt(options.height);

        if (!targetWidth && !targetHeight) {
            throw new Error("Target width or height must be specified.");
        }

        const dataUrl = await this.readFileAsDataURL(file);
        const img = await this.loadImage(dataUrl);

        // Calculate dimensions
        if (maintainAspectRatio) {
            const ratio = img.width / img.height;
            if (targetWidth && !targetHeight) {
                targetHeight = Math.round(targetWidth / ratio);
            } else if (!targetWidth && targetHeight) {
                targetWidth = Math.round(targetHeight * ratio);
            } else if (targetWidth && targetHeight) {
                // Fit within box
                const targetRatio = targetWidth / targetHeight;
                if (ratio > targetRatio) {
                    targetHeight = Math.round(targetWidth / ratio);
                } else {
                    targetWidth = Math.round(targetHeight * ratio);
                }
            }
        } else {
            // If not maintaining aspect ratio, use defaults if missing
            targetWidth = targetWidth || img.width;
            targetHeight = targetHeight || img.height;
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        // Better quality resizing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Preserve original format if possible, else default to PNG
        const format = file.type === 'image/jpeg' || file.type === 'image/webp' ? file.type : 'image/png';

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve({
                    blob: blob,
                    fileName: this.getNewFileName(file.name, targetWidth, targetHeight),
                    originalName: file.name
                });
            }, format, 0.92);
        });
    }

    getNewFileName(originalName, w, h) {
        const namePart = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
        const ext = originalName.split('.').pop();
        return `${namePart}-${w}x${h}.${ext}`;
    }
}

window.ResizerStrategy = ResizerStrategy;
