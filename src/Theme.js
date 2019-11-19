import { createMuiTheme } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

const defaultTheme = {
    palette: {
        primary: {
            light: '#69696a',
            main: '#5DAC13',
            dark: '#1e1e1f',
        },
        secondary: {
            light: '#fff5f8',
            main: '#526c91',
            dark: '#33475b',
        },
        warning: {
            main: '#ffc071',
            dark: '#ffb25e',
        },
        error: {
            xLight: '#FF2100',
            main: '#C60013',
            dark: '#8E0013',
        },
        success: {
            xLight: '#4CBF1F',
            dark: '#179c7e',
        },
    },
    typography: {
        fontFamily: "'Segoe UI', sans-serif",
        fontSize: 12,
        fontWeightLight: 300, // Work Sans
        fontWeightRegular: 400, // Work Sans
        fontWeightMedium: 700, // Roboto Condensed
        fontFamilySecondary: "'Roboto Condensed', sans-serif",
    },
};

const theme = (theme = defaultTheme) => {
    const rawTheme = createMuiTheme(theme);
    const fontHeader = {
        color: rawTheme.palette.text.primary,
        fontWeight: rawTheme.typography.fontWeightMedium,
        fontFamily: rawTheme.typography.fontFamilySecondary,
        textTransform: 'uppercase',
    };
    return {
        ...rawTheme,
        palette: {
            ...rawTheme.palette,
            background: {
                ...rawTheme.palette.background,
                default: rawTheme.palette.common.white,
                placeholder: grey[200],
            },
        },
        typography: {
            ...rawTheme.typography,
            fontHeader,
            h1: {
                ...rawTheme.typography.h1,
                ...fontHeader,
                letterSpacing: 0,
                fontSize: 60,
            },
            h2: {
                ...rawTheme.typography.h2,
                ...fontHeader,
                fontSize: 48,
            },
            h3: {
                ...rawTheme.typography.h3,
                ...fontHeader,
                fontSize: 42,
            },
            h4: {
                ...rawTheme.typography.h4,
                ...fontHeader,
                fontSize: 36,
            },
            h5: {
                ...rawTheme.typography.h5,
                fontSize: 20,
                fontWeight: rawTheme.typography.fontWeightLight,
            },
            h6: {
                ...rawTheme.typography.h6,
                ...fontHeader,
                fontSize: 18,
            },
            subtitle1: {
                ...rawTheme.typography.subtitle1,
                fontSize: 18,
            },
            body1: {
                ...rawTheme.typography.body2,
                fontWeight: rawTheme.typography.fontWeightRegular,
                fontSize: 16,
            },
            body2: {
                ...rawTheme.typography.body1,
                fontSize: 14,
            },
        },
    };
};

export default theme;
