/**
 * 
 * @param {string} facelets 
 * @param {HTMLElement | undefined} renderContainer
 */
export function drawFacelet(facelets, renderContainer) {

    if (renderContainer === undefined) {
        console.warn("No render container provided.");
        return;
    }

    console.log("[Drawing]: ", { facelets });

    const faceColors = {
        'U': 'white',
        'R': 'red',
        'F': 'green',
        'D': 'yellow',
        'L': 'orange',
        'B': 'blue'
    };

    renderContainer.innerHTML = ''; // Clear previous faces

    const faceNames = ['U', 'R', 'F', 'D', 'L', 'B'];
    faceNames.forEach(faceName => {
        const face = document.createElement('div');
        face.classList.add('cube-face');
        face.style.width = '60px';
        face.style.height = '60px';
        face.style.border = '1px solid black';
        face.style.display = 'grid';
        face.style.gridTemplateColumns = 'repeat(3, 1fr)';
        face.style.gridTemplateRows = 'repeat(3, 1fr)';

        const index = faceNames.indexOf(faceName);
        const faceletString = facelets.substring(index * 9, (index + 1) * 9);
        console.debug({ faceletString, index, faceName });

        for (let i = 0; i < 9; i++) {
            const sticker = document.createElement('div');
            sticker.style.backgroundColor = faceColors[faceletString[i]];
            sticker.style.border = '1px solid black';
            face.appendChild(sticker);
        }
        renderContainer.appendChild(face);
    });

    // Optional: Position faces in an "open box" layout.
    const faces = renderContainer.querySelectorAll('.cube-face');
    if (faces.length >= 6) {
        faces[0].style.position = 'absolute'; faces[0].style.top = '0px'; faces[0].style.left = '60px';    // U
        faces[1].style.position = 'absolute'; faces[1].style.top = '60px'; faces[1].style.left = '120px';  // R
        faces[2].style.position = 'absolute'; faces[2].style.top = '60px'; faces[2].style.left = '60px';   // F
        faces[3].style.position = 'absolute'; faces[3].style.top = '120px'; faces[3].style.left = '60px';  // D
        faces[4].style.position = 'absolute'; faces[4].style.top = '60px'; faces[4].style.left = '0px';    // L
        faces[5].style.position = 'absolute'; faces[5].style.top = '60px'; faces[5].style.left = '180px';  // B
    }
}
