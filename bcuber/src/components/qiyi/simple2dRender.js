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

    const CUBE_SIZE_UI = 120;
    const faceNames = ['U', 'R', 'F', 'D', 'L', 'B'];
    faceNames.forEach(faceName => {
        const face = document.createElement('div');
        face.classList.add('cube-face');
        face.style.width = `${CUBE_SIZE_UI}px`;
        face.style.height = `${CUBE_SIZE_UI}px`;
        face.style.border = '1px solid black';
        face.style.display = 'grid';
        face.style.gap = "5px"
        face.style.gridTemplateColumns = 'repeat(3, 1fr)';
        face.style.gridTemplateRows = 'repeat(3, 1fr)';

        const index = faceNames.indexOf(faceName);
        const faceletString = facelets.substring(index * 9, (index + 1) * 9);
        console.debug({ faceletString, index, faceName });

        for (let i = 0; i < 9; i++) {
            const sticker = document.createElement('div');
            sticker.innerHTML = (index * 9 + i).toString();
            sticker.style.backgroundColor = faceColors[faceletString[i]];
            sticker.style.border = '1px solid black';
            face.appendChild(sticker);
        }
        renderContainer.appendChild(face);
    });

    // Optional: Position faces in an "open box" layout.
    const faces = renderContainer.querySelectorAll('.cube-face');
    if (faces.length >= 6) {
        // @ts-ignore
        faces[0].style.position = 'absolute'; faces[0].style.top = '0px'; faces[0].style.left = `${CUBE_SIZE_UI}px`

        // @ts-ignore
        faces[1].style.position = 'absolute'; faces[1].style.top = `${CUBE_SIZE_UI}px`; faces[1].style.left = `${2 * CUBE_SIZE_UI}px`

        // @ts-ignore
        faces[2].style.position = 'absolute'; faces[2].style.top = `${CUBE_SIZE_UI}px`; faces[2].style.left = `${CUBE_SIZE_UI}px`

        // @ts-ignore
        faces[3].style.position = 'absolute'; faces[3].style.top = `${2 * CUBE_SIZE_UI + 10}px`; faces[3].style.left = `${CUBE_SIZE_UI}px`

        // @ts-ignore
        faces[4].style.position = 'absolute'; faces[4].style.top = `${CUBE_SIZE_UI}px`; faces[4].style.left = '0px'

        // @ts-ignore
        faces[5].style.position = 'absolute'; faces[5].style.top = `${CUBE_SIZE_UI}px`; faces[5].style.left = `${3 * CUBE_SIZE_UI + 10}px`;
    }
}
