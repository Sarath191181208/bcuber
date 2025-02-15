
/**
 * Helper function to select an element by its ID.
 * @param {string} id
 * @returns {HTMLElement}
 */
export function selectElement(id) {
    const res = document.querySelector(id)
    if (!res) {
        console.warn(`No element found with id: ${id}`)
        throw new Error(`No element found with id: ${id}`)
    }
    // @ts-ignore
    return res
}