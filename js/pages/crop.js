document.addEventListener('DOMContentLoaded', () => {
    const processor = window.imageProcessor;
    const cropBtn = document.getElementById('crop-btn');
    const editorContainer = document.getElementById('editor-container');
    const resultsContainer = document.getElementById('results-container');

    let cropper = null;
    let currentFile = null;

    // Override default processor behavior - we want to intercept the file add
    // to show it in the editor immediately.
    const originalAddFiles = processor.addFiles.bind(processor);
    processor.addFiles = (files) => {
        if (files.length > 0) {
            // Only take the first file
            const file = files[0];
            currentFile = file;
            loadEditor(file);
            // We don't add to queue in the traditional sense until we crop
            return 1;
        }
        return 0;
    };

    async function loadEditor(file) {
        editorContainer.innerHTML = '';
        const img = document.createElement('img');
        img.style.maxWidth = '100%';
        img.style.maxHeight = '60vh';
        img.style.display = 'block'; // Fix cropper issues

        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
            editorContainer.appendChild(img);

            if (cropper) cropper.destroy();
            cropper = new Cropper(img, {
                viewMode: 1,
                dragMode: 'move',
                autoCropArea: 0.8,
                restore: false,
                guides: true,
                center: true,
                highlight: false,
                cropBoxMovable: true,
                cropBoxResizable: true,
                toggleDragModeOnDblclick: false,
            });

            cropBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }

    if (cropBtn) {
        cropBtn.addEventListener('click', async () => {
            if (!cropper || !currentFile) return;

            const data = cropper.getData(); // { x, y, width, height, rotate, scaleX, scaleY }
            // Note: Cropper.js returns data relative to original image size, which is perfect.

            const strategy = new window.CropStrategy();

            cropBtn.disabled = true;
            cropBtn.textContent = 'Cropping...';
            resultsContainer.innerHTML = '';

            try {
                const result = await strategy.execute(currentFile, {
                    x: data.x,
                    y: data.y,
                    width: data.width,
                    height: data.height
                });

                displayResult(result);
            } catch (err) {
                console.error(err);
                alert('An error occurred during cropping.');
            } finally {
                cropBtn.disabled = false;
                cropBtn.textContent = 'Crop Selection';
            }
        });
    }

    function displayResult(result) {
        resultsContainer.innerHTML = '<h3>Result</h3>';

        const url = URL.createObjectURL(result.blob);
        const card = document.createElement('div');
        card.className = 'glass-card';
        card.style.maxWidth = '400px';
        card.innerHTML = `
            <div style="width: 100%; height: 200px; background: rgba(255,255,255,0.1); border-radius: 8px; overflow: hidden; margin-bottom: 16px;">
                <img src="${url}" style="width: 100%; height: 100%; object-fit: contain;">
            </div>
            <div style="font-weight: bold; margin-bottom: 8px;">${result.fileName}</div>
            <a href="${url}" download="${result.fileName}" class="btn btn-primary" style="width: 100%;">Download Cropped Image</a>
        `;
        resultsContainer.appendChild(card);
    }
});
