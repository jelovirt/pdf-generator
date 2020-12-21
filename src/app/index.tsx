import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

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
