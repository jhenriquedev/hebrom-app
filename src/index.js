import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
//import * as serviceWorker from './serviceWorker';

//Mantém o servidor ativo
const OiServidor = () => {
  console.log('Chamando servidor...');
  setTimeout(OiServidor, 3000);
};
OiServidor();

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
