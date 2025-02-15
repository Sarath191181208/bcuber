import './style.css'
import { RubiksCubeComponent } from './components/render-cube.js'
import { QiYiCubeController } from './components/qiyi/cubeController'
import { QIYI_CONFIG } from './components/qiyi/config'

const qiyiConnectButton = document.querySelector('#qiyi-connect-btn')

const cubeRenderDiv = document.querySelector('#cube')
const cube = new RubiksCubeComponent(cubeRenderDiv)
const qiyiHandler = new QiYiCubeController(QIYI_CONFIG, cube)

cube.toggleGizmos(true)

qiyiConnectButton.addEventListener('click', async () => {
  await qiyiHandler.connectCube()
})