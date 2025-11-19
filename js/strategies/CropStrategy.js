/**
 * Crop Strategy
 * Crops images to specific coordinates.
 */
class CropStrategy extends BaseStrategy {
    /**
     * Execute the crop.
     * @param {File} file - Input file.
     * @param {Object} options - { x, y, width, height }
     */
    async execute(file, options = {}) {
        const { x, y, width, height } = options;

        if (width === undefined || height === undefined) {
            throw new Error('Crop dimensions missing.');
        }

        const dataUrl = await this.readFileAsDataURL(file);
        const img = await this.loadImage(dataUrl);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

        // Preserve format
        const format = file.type === 'image/jpeg' || file.type === 'image/webp' ? file.type : 'image/png';

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve({
                    blob: blob,
                    fileName: this.getNewFileName(file.name),
                    originalName: file.name
                });
            }, format, 0.92);
        });
    }

    getNewFileName(originalName) {
        const namePart = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
        const ext = originalName.split('.').pop();
        return `${namePart}-cropped.${ext}`;
    }
}

window.CropStrategy = CropStrategy;
