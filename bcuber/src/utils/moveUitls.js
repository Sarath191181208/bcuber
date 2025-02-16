
/**
 * Normalize a move string.
 * @param {string} move
 * @returns {string} normalized move
 */
export function normalizeMove(move) {
    move = move.trim()
    if (move.endsWith("2")) {
        const singleMove = move.slice(0, -1)
        return `${singleMove} ${singleMove}`
    }
    return move
}

/**
 * Get the inverse of a move.
 * For example: U -> U', U' -> U, U2 -> U2.
 * @param {string} move
 * @returns {string} inverse move.
 */
export function getInverse(move) {
    if (move.endsWith("2")) {
        return move // 180° turns are self-inverse
    }
    if (move.endsWith("'")) {
        return move.slice(0, -1)
    }
    return move + "'"
}


/**
 * @param {string} scramble
 */
export function simplify(scramble) {
    // find repetation of three moves and switch them with their inverses 
    const moves = scramble.trim().toUpperCase().toString().split(/\s+/)
    const newMovesStack = [moves[0]]
    for (let i = 1; i < moves.length; i++) {
        const currentMove = moves[i]
        newMovesStack.push(currentMove)

        if (newMovesStack.length >= 2) {
            const m1 = newMovesStack[newMovesStack.length - 2]
            const m2 = newMovesStack[newMovesStack.length - 1]
            const betterMove = getBetterMove(m1, m2)
            if (betterMove != null) {
                newMovesStack.pop()
                newMovesStack.pop()
                newMovesStack.push(betterMove)
            }
        }
    }

    // the replace is done to remove any extra spaces which can arise if we join empty string
    return newMovesStack.join(" ").replace(/\s+/g, " ")
}

/**
 * @param {string} m1
 * @param {string} m2
 */
function getBetterMove(m1, m2) {
    m1 = m1.trim().toUpperCase()
    m2 = m2.trim().toUpperCase()

    const getBase = (move) => move.replace(/[2']/g, "");

    const m1Base = getBase(m1)
    const m2Base = getBase(m2)
    if (m1Base !== m2Base) return null

    if (m1 === getInverse(m2)) return ""

    const ARE_BOTH_DOUBLE = m1.endsWith("2") && m2.endsWith("2");
    if (ARE_BOTH_DOUBLE) {
        return null
    }

    const IS_ANY_DOUBLE = m1.endsWith("2") || m2.endsWith("2");
    if (IS_ANY_DOUBLE) {
        const doubleMove = m1.endsWith("2") ? m1 : m2
        const singleMove = m1.endsWith("2") ? m2 : m1

        if (doubleMove.replace("2", "") === singleMove) return getInverse(singleMove)
        if (getBase(doubleMove) === getInverse(singleMove)) return getBase(doubleMove)

        return null;
    }


    if (m1 === m2) return `${m1}2`.replace(/\s+/g, " ").replace("2 2", "2").replace("'", "")

    return null
}
