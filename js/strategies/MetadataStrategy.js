/**
 * Metadata Strategy
 * View or Scrub image metadata.
 * Dependencies: exif-js (for viewing)
 */
class MetadataStrategy extends BaseStrategy {
    /**
     * Execute the metadata operation.
     * @param {File} file - Input file.
     * @param {Object} options - { action: 'view' | 'scrub' }
     */
    async execute(file, options = {}) {
        const action = options.action || 'view';

        if (action === 'view') {
            return this.getMetadata(file);
        } else {
            return this.scrubMetadata(file);
        }
    }

    getMetadata(file) {
        return new Promise((resolve, reject) => {
            if (typeof EXIF === 'undefined') {
                reject(new Error('exif-js library not loaded.'));
                return;
            }

            EXIF.getData(file, function () {
                const allTags = EXIF.getAllTags(this);
                resolve({
                    type: 'metadata',
                    data: allTags,
                    fileName: file.name,
                    originalName: file.name
                });
            });
        });
    }

    async scrubMetadata(file) {
        // To scrub metadata, we simply draw the image to a canvas and export it.
        // This creates a new file without the original EXIF/IPTC data.
        const dataUrl = await this.readFileAsDataURL(file);
        const img = await this.loadImage(dataUrl);

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // Preserve format (default to jpeg if jpg/jpeg, else png)
        // Note: WebP also supports metadata, but canvas export usually strips it unless specifically added.
        let format = file.type;
        if (format !== 'image/png' && format !== 'image/webp') {
            format = 'image/jpeg';
        }

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
        return `${namePart}-clean.${ext}`;
    }
}

window.MetadataStrategy = MetadataStrategy;
