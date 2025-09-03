module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    testMatch: ['<rootDir>/src/tests/**/*.test.jsx'],
    modulePaths: ['<rootDir>/src'],
    moduleNameMapper: {
        '^react$': '<rootDir>/node_modules/react',
        '^react-dom$': '<rootDir>/node_modules/react-dom',
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
        '^../../services/(.*)$': '<rootDir>/src/services/$1'
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(@material-tailwind|@heroicons)/)'
    ]
};