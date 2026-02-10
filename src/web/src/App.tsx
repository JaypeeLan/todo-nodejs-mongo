import { DarkTheme } from './ux/theme';
import { AppContext, ApplicationState, getDefaultState } from './models/applicationState';
import appReducer from './reducers';
import { ProductContext } from './components/productContext';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { ThemeProvider } from '@fluentui/react';
import Telemetry from './components/telemetry';
import { useReducer, FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Layout from './layout/layout';
import './App.css';

initializeIcons(undefined, { disableWarnings: true });

const App: FC = () => {
  const defaultState: ApplicationState = getDefaultState();
  const [applicationState, dispatch] = useReducer(appReducer, defaultState);
  const initialContext: AppContext = { state: applicationState, dispatch: dispatch }

  return (
    <ThemeProvider applyTo="body" theme={DarkTheme}>
      <ProductContext.Provider value={initialContext}>
        <BrowserRouter>
          <Telemetry>
            <Layout />
          </Telemetry>
        </BrowserRouter>
      </ProductContext.Provider>
    </ThemeProvider>
  );
};

export default App;
