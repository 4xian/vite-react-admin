import SvgIcon from './components/SvgIcon'
import './App.css'
import { Button } from 'antd'

function App() {
  return (
    <div className='App'>
      <Button type='primary'>测试按钮hhh</Button>
      <SvgIcon name='close' width={20} height={20} />
    </div>
  )
}

export default App
