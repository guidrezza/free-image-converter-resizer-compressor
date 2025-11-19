document.addEventListener('DOMContentLoaded', () => {
    const processor = window.imageProcessor;
    const generateBtn = document.getElementById('generate-btn');
    const resultsContainer = document.getElementById('results-container');

    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            if (processor.queue.length === 0) {
                alert('Please select an image first.');
                return;
            }

            const strategy = new window.FaviconStrategy();

            generateBtn.disabled = true;
            generateBtn.textContent = 'Generating Zip...';
            resultsContainer.innerHTML = '';

            try {
                // Only process the first image if multiple are selected, or process all?
                // Usually favicon gen is one by one, but our processor handles queues.
                // Let's let it handle the queue, each image gets its own zip.
                const results = await processor.processQueue(strategy, {});
                displayResults(results);
            } catch (err) {
                console.error(err);
                alert('An error occurred. Make sure JSZip is loaded.');
            } finally {
                generateBtn.disabled = false;
                generateBtn.textContent = 'Generate Icons';
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
            const card = document.createElement('div');
            card.className = 'glass-card';
            card.innerHTML = `
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                    <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 24px;">📦</span>
                    </div>
                    <div>
                        <div style="font-weight: bold;">${result.fileName}</div>
                        <div style="font-size: 0.8rem; opacity: 0.7;">${(result.blob.size / 1024).toFixed(1)} KB</div>
                    </div>
                </div>
                <a href="${url}" download="${result.fileName}" class="btn btn-primary" style="width: 100%;">Download ZIP</a>
            `;
            list.appendChild(card);
        });

        resultsContainer.appendChild(list);
    }
});
