// index.web.js
import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('NexusApp', () => App);
AppRegistry.runApplication('NexusApp', {
  initialProps: {},
  rootTag: document.getElementById('root'),
});
