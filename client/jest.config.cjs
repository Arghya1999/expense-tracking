module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    moduleNameMapper: {
        '^react$': '<rootDir>/node_modules/react',
        '^react-dom$': '<rootDir>/node_modules/react-dom',
        '^.+\.css$': 'identity-obj-proxy',
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(@material-tailwind|@heroicons)/)'
    ],
};