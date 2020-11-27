// import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
// import rootReducer from './rootReducer';
// import store from './store';

window.addEventListener('DOMContentLoaded', (event) => {
  // const store = configureStore({
  //   reducer: rootReducer,
  // });

  ReactDOM.render(
    // <Provider store={store}>
    <App />,
    // </Provider>,
    document.getElementById('content')
  );
});
