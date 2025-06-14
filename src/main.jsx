// src/main.jsx
import React from 'react'; 
import ReactDOM from 'react-dom/client';
//import './index.css';
import App from './App.jsx';
import { ChakraProvider , extendTheme} from '@chakra-ui/react'; // CORRECT IMPORT


// Optional: Extend the theme for custom colors, fonts, etc.
const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
    green: '#00B87B', // A green similar to your button
  },
}

const theme = extendTheme({ colors })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}> {/* Use your custom theme if you have one */}
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)