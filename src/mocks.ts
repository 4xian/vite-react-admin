import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'
import mockModule from './mocks/index'

export const initMockServer = () => {
  createProdMockServer([...mockModule])
}
