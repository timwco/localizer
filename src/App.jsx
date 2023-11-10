import * as React from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import Process from './components/Process';
import store from './store';

const reduxStore = createStore(
  combineReducers({ store: store.reducer }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

function App() {
  return (
    <Provider store={reduxStore}>
      <Process />
    </Provider>
  );
}

export default App;
