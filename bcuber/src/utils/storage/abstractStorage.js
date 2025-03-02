/**
 * @template T
 */
export class AbstractStorage {
    prefixKey = "V1";

    /**
     * @param {string} storageKey - The key to use in local storage.
     */
    constructor(storageKey) {
        this.storageKey = storageKey;
    }

    get key() {
        return this.prefixKey + this.storageKey;
    }

    /**
     * Loads the saved data from local storage.
     * @returns {T | null} The saved data.
     */
    loadData() {
        const savedData = localStorage.getItem(this.key);
        if (savedData) {
            try {
                return JSON.parse(savedData);
            } catch (e) {
                console.error("Error parsing saved data from local storage", e);
            }
        }
        return null;
    }
}