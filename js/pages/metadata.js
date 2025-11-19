document.addEventListener('DOMContentLoaded', () => {
    const processor = window.imageProcessor;
    const actionBtn = document.getElementById('action-btn');
    const actionSelect = document.getElementById('action-select');
    const resultsContainer = document.getElementById('results-container');

    if (actionBtn) {
        actionBtn.addEventListener('click', async () => {
            if (processor.queue.length === 0) {
                alert('Please select images first.');
                return;
            }

            const action = actionSelect.value;
            const strategy = new window.MetadataStrategy();

            actionBtn.disabled = true;
            actionBtn.textContent = action === 'view' ? 'Reading...' : 'Scrubbing...';
            resultsContainer.innerHTML = '';

            try {
                const results = await processor.processQueue(strategy, { action: action });
                displayResults(results, action);
            } catch (err) {
                console.error(err);
                alert('An error occurred.');
            } finally {
                actionBtn.disabled = false;
                actionBtn.textContent = action === 'view' ? 'View Metadata' : 'Scrub Metadata';
            }
        });
    }

    // Update button text when selection changes
    actionSelect.addEventListener('change', (e) => {
        actionBtn.textContent = e.target.value === 'view' ? 'View Metadata' : 'Scrub Metadata';
    });

    function displayResults(results, action) {
        resultsContainer.innerHTML = '<h3>Results</h3>';

        if (action === 'view') {
            const list = document.createElement('div');
            list.className = 'grid grid-2'; // Or 1 column for large JSON?

            results.forEach(result => {
                if (result.error) return;

                const card = document.createElement('div');
                card.className = 'glass-card';
                card.style.overflow = 'hidden';

                // Format metadata nicely
                let metaHtml = '<div style="max-height: 300px; overflow-y: auto; font-family: monospace; font-size: 0.85rem;">';
                if (Object.keys(result.data).length === 0) {
                    metaHtml += '<p class="text-muted">No EXIF data found.</p>';
                } else {
                    for (const [key, value] of Object.entries(result.data)) {
                        // Skip thumbnail binary data for display cleanliness
                        if (key === 'thumbnail') continue;
                        metaHtml += `<div style="margin-bottom: 4px;"><span style="color: var(--accent-primary);">${key}:</span> <span style="color: var(--text-secondary);">${value}</span></div>`;
                    }
                }
                metaHtml += '</div>';

                card.innerHTML = `
                    <div style="font-weight: bold; margin-bottom: 12px;">${result.fileName}</div>
                    ${metaHtml}
                `;
                list.appendChild(card);
            });
            resultsContainer.appendChild(list);

        } else {
            // Scrub mode - show download links
            const list = document.createElement('div');
            list.className = 'grid grid-2';

            results.forEach(result => {
                if (result.error) return;

                const url = URL.createObjectURL(result.blob);
                const card = document.createElement('div');
                card.className = 'glass-card';
                card.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                        <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.1); border-radius: 8px; overflow: hidden;">
                            <img src="${url}" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <div>
                            <div style="font-weight: bold;">${result.fileName}</div>
                            <div style="font-size: 0.8rem; opacity: 0.7;">Cleaned</div>
                        </div>
                    </div>
                    <a href="${url}" download="${result.fileName}" class="btn btn-primary" style="width: 100%;">Download</a>
                `;
                list.appendChild(card);
            });
            resultsContainer.appendChild(list);
        }
    }
});
