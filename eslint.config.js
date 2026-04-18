import js from '@eslint/js';
import globals from 'globals';

export default [
    {
        ignores: ['node_modules/', 'template/', 'example/']
    },
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.node
            }
        },
        rules: {
            // correctness
            'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
            'no-undef': 'error',
            'no-constant-condition': 'error',
            'no-duplicate-case': 'error',
            'no-unreachable': 'error',
            'valid-typeof': 'error',
            'eqeqeq': ['error', 'always'],
            'no-eval': 'error',
            'no-implied-eval': 'error',
            'no-new-func': 'error',
            'no-extend-native': 'error',

            // style
            'semi': ['error', 'always'],
            'quotes': ['error', 'single', { avoidEscape: true }],
            'indent': ['error', 4],
            'no-trailing-spaces': 'error',
            'eol-last': 'error',
            'no-multiple-empty-lines': ['error', { max: 2 }],
            'comma-dangle': ['error', 'never'],
            'camelcase': ['error', { properties: 'never' }],

            // best practice
            'no-console': 'warn',
            'no-debugger': 'error',
            'curly': ['error', 'all'],
            'no-throw-literal': 'error',
            'prefer-const': 'error'
        }
    },
    {
        files: ['test/**/*.js'],
        rules: {
            'no-unused-vars': 'off'
        }
    }
];
