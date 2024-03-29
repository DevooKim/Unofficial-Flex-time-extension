/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        colors: {
            white: '#fff',
            black: '#000',
            gray: {
                50: '#f7f7fa',
                100: '#f0f0f5',
                200: '#e8e8ee',
                300: '#e1e1e8',
                400: '#cdced6',
                500: '#a9abb8',
                600: '#858899',
                700: '#525463',
                800: '#3e404c',
                900: '#2b2d36',
            },
            blue: {
                50: '#f0f6ff',
                100: '#dceafe',
                200: '#bad5fd',
                300: '#97bffc',
                400: '#74aafb',
                500: '#5094fa',
                600: '#317ef2',
                700: '#1d6ce0',
                800: '#1959b8',
                900: '#1a4b93',
            },
            red: {
                50: '#fef1f1',
                100: '#fdd8db',
                200: '#fbb7bb',
                300: '#f9959c',
                400: '#f7737c',
                500: '#f5535e',
                600: '#ec323e',
                700: '#d91c29',
                800: '#ae1e27',
                900: '#8f1e26',
            },
            orange: {
                50: '#fff7f0',
                100: '#fee9d7',
                200: '#fbc08d',
                300: '#faa55c',
                400: '#f99239',
                500: '#f57d14',
                600: '#dc6b09',
                700: '#b35809',
                800: '#984a06',
                900: '#7a3c05',
            },
            primary: '#5094fa',
            secondary: '#1d6ce0',
            success: '#00a881',
            info: '#a9abb8',
            warning: '#f57d14',
            danger: '#f5535e',
            light: '#fff',
            dark: '#2b2d36',
            alternative: '#525463',
            hint: '#858899',
            link: '#858899',
        },

        extend: {
            fontSize: {
                h1: [
                    '2.375rem',
                    {
                        lineHeight: '3.5625rem',
                        fontWeight: '700',
                    },
                ],
                h2: [
                    '2rem',
                    {
                        lineHeight: '3rem',
                        fontWeight: '700',
                    },
                ],
                h3: [
                    '1.5rem',
                    {
                        lineHeight: '2.25rem',
                        fontWeight: '700',
                    },
                ],
                h4: [
                    '1.25rem',
                    {
                        lineHeight: '1.25rem',
                        fontWeight: '700',
                    },
                ],
                h5: [
                    '1.125rem',
                    {
                        lineHeight: '1.6875rem',
                        fontWeight: '700',
                    },
                ],
                h6: [
                    '1rem',
                    {
                        lineHeight: '1.5rem',
                        fontWeight: '500',
                    },
                ],
                subtitle1: [
                    '0.875rem',
                    {
                        lineHeight: '1.3125rem',
                        fontWeight: '500',
                    },
                ],
                subtitle2: [
                    '0.75rem',
                    {
                        lineHeight: '1.125rem',
                        fontWeight: '500',
                    },
                ],
                body1: [
                    '1rem',
                    {
                        lineHeight: '1.5rem',
                        fontWeight: '400',
                    },
                ],
                body2: [
                    '0.875rem',
                    {
                        lineHeight: '1.3125rem',
                        fontWeight: '400',
                    },
                ],
                body3: [
                    '0.875rem',
                    {
                        lineHeight: '1.125rem',
                        fontWeight: '400',
                    },
                ],
                caption: [
                    '0.75rem',
                    {
                        lineHeight: '1.125rem',
                        fontWeight: '400',
                    },
                ],
                'paragraph-sm': [
                    '0.75rem',
                    {
                        fontWeight: '400',
                        letterSpacing: '-0.006rem',
                        lineHeight: '1.125rem',
                    },
                ],
                paragraph: [
                    '0.875rem',
                    {
                        fontWeight: '400',
                        letterSpacing: '-0.006rem',
                        lineHeight: '1.375rem',
                    },
                ],
                'paragraph-lg': [
                    '1rem',
                    {
                        fontWeight: '400',
                        letterSpacing: '-0.006rem',
                        lineHeight: '1.5rem',
                    },
                ],
            },
        },
    },
    plugins: [],
}
