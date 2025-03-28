import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import AppRoutes from './routes';
import Layout from './components/layout/Layout';
import ChatDrawer from './components/chat/ChatDrawer';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <AppRoutes />
        </Layout>
        <ChatDrawer />
      </Router>
    </Provider>
  );
}

export default App;