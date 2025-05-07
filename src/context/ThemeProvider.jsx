import React, { createContext, useContext, useState } from 'react';
   import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
   import { CssBaseline } from '@mui/material';

   const ThemeContext = createContext();

   export const useTheme = () => useContext(ThemeContext);

   const ThemeProvider = ({ children }) => {
     const [mode, setMode] = useState('light');

     const theme = createTheme({
       palette: {
         mode,
         ...(mode === 'light'
           ? {
               primary: { main: '#1976d2' },
               background: { default: '#fff', paper: '#fff' },
             }
           : {
               primary: { main: '#90caf9' },
               background: { default: '#121212', paper: '#424242' },
             }),
       },
     });

     const toggleTheme = () => {
       setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
     };

     return (
       <ThemeContext.Provider value={{ toggleTheme, mode }}>
         <MuiThemeProvider theme={theme}>
           <CssBaseline />
           {children}
         </MuiThemeProvider>
       </ThemeContext.Provider>
     );
   };

   export default ThemeProvider;