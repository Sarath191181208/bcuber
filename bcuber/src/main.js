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

// @ts-ignore HTMLElement vs Element
const cube = new RubiksCubeComponent(cubeRenderDiv)

// @ts-ignore HTMLElement vs Element
const qiyiHandler = new QiYiCubeController(QIYI_CONFIG, cube, cubeRenderDiv)

cube.toggleGizmos(true)

qiyiConnectButton.addEventListener('click', async () => {
  await qiyiHandler.connectCube()
})