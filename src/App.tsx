import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import { Provider } from 'react-redux'
import { persistor, store } from '@/store'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { basename } from '@/utils/base'
import Layout from '@/layout'

const App: React.FC = (): JSX.Element => {
  return (
    <ConfigProvider locale={zhCN}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router basename={basename}>
            <Layout />
          </Router>
        </PersistGate>
      </Provider>
    </ConfigProvider>
  )
}

export default App
