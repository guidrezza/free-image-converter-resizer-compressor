document.addEventListener('DOMContentLoaded', () => {
    const processor = window.imageProcessor;
    const convertBtn = document.getElementById('convert-btn');
    const resultsContainer = document.getElementById('results-container');

    if (convertBtn) {
        convertBtn.addEventListener('click', async () => {
            if (processor.queue.length === 0) {
                alert('Please select images first.');
                return;
            }

            const strategy = new window.Base64Strategy();

            convertBtn.disabled = true;
            convertBtn.textContent = 'Encoding...';
            resultsContainer.innerHTML = '';

            try {
                const results = await processor.processQueue(strategy, {});
                displayResults(results);
            } catch (err) {
                console.error(err);
                alert('An error occurred.');
            } finally {
                convertBtn.disabled = false;
                convertBtn.textContent = 'Encode to Base64';
            }
        });
    }

    function displayResults(results) {
        resultsContainer.innerHTML = '<h3>Results</h3>';
        const list = document.createElement('div');
        list.className = 'grid grid-2';

        results.forEach(result => {
            if (result.error) return;

            const card = document.createElement('div');
            card.className = 'glass-card';

            // Truncate for display
            const shortString = result.dataUrl.substring(0, 50) + '...';

            card.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 8px;">${result.fileName}</div>
                <div style="background: rgba(0,0,0,0.3); padding: 8px; border-radius: 8px; font-family: monospace; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px; word-break: break-all;">
                    ${shortString}
                </div>
                <button class="btn btn-primary copy-btn" data-content="${result.dataUrl}" style="width: 100%;">Copy Data URI</button>
            `;
            list.appendChild(card);
        });

        resultsContainer.appendChild(list);

        // Bind copy buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const content = e.target.getAttribute('data-content');
                navigator.clipboard.writeText(content).then(() => {
                    const originalText = e.target.textContent;
                    e.target.textContent = 'Copied!';
                    setTimeout(() => {
                        e.target.textContent = originalText;
                    }, 2000);
                });
            });
        });
    }
});
