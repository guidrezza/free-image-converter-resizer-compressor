/**
 * UI Controller
 * Handles global drag & drop and UI updates.
 */
document.addEventListener('DOMContentLoaded', () => {
    const dropOverlay = document.getElementById('drop-overlay');
    const fileInput = document.getElementById('file-input');
    const queueContainer = document.getElementById('queue-container');
    const processor = window.imageProcessor;

    // Global Drag & Drop
    let dragCounter = 0;

    window.addEventListener('dragenter', (e) => {
        e.preventDefault();
        dragCounter++;
        dropOverlay.classList.add('active');
    });

    window.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dragCounter--;
        if (dragCounter === 0) {
            dropOverlay.classList.remove('active');
        }
    });

    window.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    window.addEventListener('drop', (e) => {
        e.preventDefault();
        dragCounter = 0;
        dropOverlay.classList.remove('active');

        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });

    // File Input
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });
    }

    function handleFiles(files) {
        const count = processor.addFiles(files);
        if (count > 0) {
            // If we are on the landing page, we might want to redirect or show the queue
            // For now, we just update the queue UI if it exists
        }
    }

    // Queue Rendering
    processor.on('queueUpdated', (queue) => {
        if (!queueContainer) return;

        queueContainer.innerHTML = '';
        if (queue.length === 0) {
            queueContainer.innerHTML = '<p class="text-center">No files selected.</p>';
            return;
        }

        const list = document.createElement('ul');
        list.className = 'file-list';

        queue.forEach(file => {
            const li = document.createElement('li');
            li.className = 'file-item';
            li.innerHTML = `
                <div class="file-info">
                    <span class="file-name">${file.name}</span>
                    <span class="file-meta">${(file.size / 1024).toFixed(1)} KB</span>
                </div>
                <div class="file-status">Ready</div>
            `;
            list.appendChild(li);
        });

        queueContainer.appendChild(list);
    });
});
