import React, { createContext, useState, useMemo } from 'react'; 
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
      try {
          const storedMode = localStorage.getItem("themeMode");
          return storedMode || 'light';
      } catch (error) {
          return 'light';
      }
  });

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
            const newMode = prevMode === 'light' ? 'dark' : 'light';
            localStorage.setItem("themeMode", newMode);
            return newMode;
        });
      },
      mode,
    }),
    [mode],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#912f56',
          },
          background: {
             default: mode === 'dark' ? '#0b0b0b' : '#eaf2ef',
             paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
          },
          text: {
             primary: mode === 'dark' ? '#ffffff' : '#000000',
             secondary: mode === 'dark' ? '#a0a0a0' : '#555555',
          }
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        scrollbarColor: mode === 'dark' ? "#6b6b6b #2b2b2b" : "#959595 #f5f5f5",
                        "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                            backgroundColor: mode === 'dark' ? "#2b2b2b" : "#f5f5f5",
                        },
                        "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                            borderRadius: 8,
                            backgroundColor: mode === 'dark' ? "#6b6b6b" : "#959595",
                            minHeight: 24,
                        },
                    },
                },
            },
        },
      }),
    [mode],
  );
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};