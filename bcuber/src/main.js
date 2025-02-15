import './style.css'
import { RubiksCubeComponent } from './components/render-cube.js'
import { QiYiCubeController } from './components/qiyi/cubeController'
import { QIYI_CONFIG } from './components/qiyi/config'

const qiyiConnectButton = document.querySelector('#qiyi-connect-btn')
const cubeRenderDiv = document.querySelector('#cube')
const toggleGizmosButton = document.querySelector('#toggle-gizmos-btn')

if (!qiyiConnectButton) {
  console.warn('No connect button found.')
  throw new Error('No connect button found.')
}

if (!cubeRenderDiv) {
  console.warn('No render div found.')
  throw new Error('No render div found.')
}

if (!toggleGizmosButton) {
  console.warn('No toggle gizmos button found.')
  throw new Error('No toggle gizmos button found.')
}

// Create the cube and controller instances
// @ts-ignore
const cube = new RubiksCubeComponent(cubeRenderDiv)
// @ts-ignore
const qiyiHandler = new QiYiCubeController(QIYI_CONFIG, cube, cubeRenderDiv)

// Start with gizmos active
let gizmosActive = true
cube.toggleGizmos(gizmosActive)
toggleGizmosButton.classList.add('active')

// Connect QIYI Cube when the connect button is clicked
qiyiConnectButton.addEventListener('click', async () => {
  await qiyiHandler.connectCube()
})

// Toggle gizmos on/off and update the button's active class accordingly
toggleGizmosButton.addEventListener('click', () => {
  gizmosActive = !gizmosActive
  cube.toggleGizmos(gizmosActive)
  toggleGizmosButton.classList.toggle('active', gizmosActive)
})
