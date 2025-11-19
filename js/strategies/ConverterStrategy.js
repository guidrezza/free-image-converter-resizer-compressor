/**
 * Converter Strategy
 * Converts images to PNG, JPG, or WEBP.
 */
class ConverterStrategy extends BaseStrategy {
    /**
     * Execute the conversion.
     * @param {File} file - Input file.
     * @param {Object} options - { format: 'image/png' | 'image/jpeg' | 'image/webp', quality: 0.8 }
     */
    async execute(file, options = {}) {
        const format = options.format || 'image/png';
        const quality = options.quality || 0.92;

        const dataUrl = await this.readFileAsDataURL(file);
        const img = await this.loadImage(dataUrl);

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // For JPEGs, fill background with white (transparency turns black otherwise)
        if (format === 'image/jpeg') {
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
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
        return `${namePart}.${ext}`;
    }
}

window.ConverterStrategy = ConverterStrategy;
