document.addEventListener('DOMContentLoaded', () => {
    const processor = window.imageProcessor;
    const compressBtn = document.getElementById('compress-btn');
    const qualityInput = document.getElementById('quality-input');
    const qualityValue = document.getElementById('quality-value');
    const resultsContainer = document.getElementById('results-container');

    if (qualityInput && qualityValue) {
        qualityInput.addEventListener('input', (e) => {
            qualityValue.textContent = `${e.target.value}%`;
        });
    }

    if (compressBtn) {
        compressBtn.addEventListener('click', async () => {
            if (processor.queue.length === 0) {
                alert('Please select images first.');
                return;
            }

            const quality = parseInt(qualityInput.value) / 100;
            const strategy = new window.CompressorStrategy();

            compressBtn.disabled = true;
            compressBtn.textContent = 'Compressing...';
            resultsContainer.innerHTML = '';

            try {
                const results = await processor.processQueue(strategy, { quality: quality });
                displayResults(results);
            } catch (err) {
                console.error(err);
                alert('An error occurred during compression.');
            } finally {
                compressBtn.disabled = false;
                compressBtn.textContent = 'Compress Images';
            }
        });
    }

    function displayResults(results) {
        resultsContainer.innerHTML = '<h3>Results</h3>';
        const list = document.createElement('div');
        list.className = 'grid grid-2';

        results.forEach(result => {
            if (result.error) return;

            const url = URL.createObjectURL(result.blob);
            // Calculate savings
            // We don't have original size easily accessible here in the result object unless we pass it through
            // But we can just show the new size.

            const card = document.createElement('div');
            card.className = 'glass-card';
            card.innerHTML = `
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                    <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.1); border-radius: 8px; overflow: hidden;">
                        <img src="${url}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div>
                        <div style="font-weight: bold;">${result.fileName}</div>
                        <div style="font-size: 0.8rem; opacity: 0.7;">${(result.blob.size / 1024).toFixed(1)} KB</div>
                    </div>
                </div>
                <a href="${url}" download="${result.fileName}" class="btn btn-primary" style="width: 100%;">Download</a>
            `;
            list.appendChild(card);
        });

        resultsContainer.appendChild(list);
    }
});
