
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
            const lastMove = newMovesStack[newMovesStack.length - 2]
            if (lastMove === getInverse(currentMove)) {
                newMovesStack.pop()
                newMovesStack.pop()
            }
        }

        // check if the stack has two moves already added 
        if (newMovesStack.length >= 3) {
            const firstMove = newMovesStack[newMovesStack.length - 3]
            const secondMove = newMovesStack[newMovesStack.length - 2]
            const thirdMove = newMovesStack[newMovesStack.length - 1]
            if (firstMove == secondMove && secondMove == thirdMove) {
                newMovesStack.pop()
                newMovesStack.pop()
                newMovesStack.pop()
                newMovesStack.push(getInverse(secondMove))
            }
        }
    }

    return newMovesStack.join(" ")
}
