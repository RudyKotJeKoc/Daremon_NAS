/**
 * Offline Queue Module
 * Manages offline queue for survey submissions
 * Automatically syncs when network becomes available
 */

export class OfflineQueue {
    constructor(storageKey = 'offline_queue') {
        this.storageKey = storageKey;
        this.maxQueueSize = 100; // Maximum items in queue
        this.maxRetries = 3; // Maximum retries per item
    }

    /**
     * Add item to queue
     */
    async add(item) {
        try {
            const queue = this.getQueue();

            // Check queue size
            if (queue.length >= this.maxQueueSize) {
                console.warn('⚠️ Queue is full, removing oldest item');
                queue.shift();
            }

            // Add metadata
            const queueItem = {
                id: this.generateId(),
                data: item,
                addedAt: Date.now(),
                retries: 0,
                lastAttempt: null,
                status: 'pending'
            };

            queue.push(queueItem);
            this.saveQueue(queue);

            console.log(`✅ Added item to queue (${queue.length} items total)`);
            return queueItem.id;
        } catch (error) {
            console.error('Failed to add item to queue:', error);
            throw error;
        }
    }

    /**
     * Process all items in queue
     */
    async process(processor) {
        const queue = this.getQueue();
        let processed = 0;
        let failed = 0;

        const pendingItems = queue.filter(item => item.status === 'pending' || item.status === 'retry');

        if (pendingItems.length === 0) {
            console.log('📭 Queue is empty');
            return { processed: 0, failed: 0, total: 0 };
        }

        console.log(`🔄 Processing ${pendingItems.length} items from queue...`);

        for (const item of pendingItems) {
            try {
                // Update last attempt
                item.lastAttempt = Date.now();
                this.saveQueue(queue);

                // Process item
                const result = await processor(item.data);

                if (result.success) {
                    // Remove from queue
                    const index = queue.findIndex(q => q.id === item.id);
                    if (index !== -1) {
                        queue.splice(index, 1);
                    }
                    processed++;
                    console.log(`✅ Processed item ${item.id}`);
                } else {
                    throw new Error(result.error || 'Processing failed');
                }
            } catch (error) {
                console.error(`❌ Failed to process item ${item.id}:`, error);

                // Increment retry count
                item.retries++;

                if (item.retries >= this.maxRetries) {
                    // Move to failed
                    item.status = 'failed';
                    item.error = error.message;
                    console.warn(`⚠️ Item ${item.id} failed after ${this.maxRetries} retries`);
                } else {
                    // Mark for retry
                    item.status = 'retry';
                }

                failed++;
            }

            // Save queue after each item
            this.saveQueue(queue);
        }

        console.log(`✅ Queue processing complete: ${processed} processed, ${failed} failed`);
        return { processed, failed, total: pendingItems.length };
    }

    /**
     * Get all items from queue
     */
    getQueue() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Failed to read queue:', error);
            return [];
        }
    }

    /**
     * Save queue to localStorage
     */
    saveQueue(queue) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(queue));
        } catch (error) {
            console.error('Failed to save queue:', error);
            throw error;
        }
    }

    /**
     * Clear queue
     */
    clear() {
        try {
            localStorage.removeItem(this.storageKey);
            console.log('✅ Queue cleared');
        } catch (error) {
            console.error('Failed to clear queue:', error);
        }
    }

    /**
     * Get queue stats
     */
    getStats() {
        const queue = this.getQueue();
        return {
            total: queue.length,
            pending: queue.filter(item => item.status === 'pending').length,
            retry: queue.filter(item => item.status === 'retry').length,
            failed: queue.filter(item => item.status === 'failed').length,
            oldest: queue.length > 0 ? new Date(queue[0].addedAt) : null,
            newest: queue.length > 0 ? new Date(queue[queue.length - 1].addedAt) : null
        };
    }

    /**
     * Remove failed items
     */
    removeFailedItems() {
        const queue = this.getQueue();
        const filtered = queue.filter(item => item.status !== 'failed');
        const removedCount = queue.length - filtered.length;

        this.saveQueue(filtered);
        console.log(`🗑️ Removed ${removedCount} failed items from queue`);

        return removedCount;
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
}

export default OfflineQueue;
