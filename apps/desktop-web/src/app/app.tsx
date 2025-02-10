import { Layout } from 'antd';
import { Route, Switch } from 'react-router-dom';
import {
  PatientOverviewPage,
  PatientOverviewUrl,
  PatientPage,
  PatientUrl,
} from './pages';

export function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Content className="site-layout" style={{ padding: '50px 100px' }}>
        <div
          style={{
            padding: 24,
            background: 'white',
            maxWidth: '1200px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <Switch>
            <Route
              path={PatientUrl}
              exact
              render={(props) => <PatientPage {...props} />}
            />
            <Route path={PatientOverviewUrl} exact>
              <PatientOverviewPage />
            </Route>
            <Route path="*">
              <p>404 not found</p>
            </Route>
          </Switch>
        </div>
      </Layout.Content>
    </Layout>
  );
}

export default App;
