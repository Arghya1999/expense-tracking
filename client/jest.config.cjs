module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    moduleNameMapper: {
        '^react
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(@material-tailwind|@heroicons)/)'
    ],
    // Add this globals section
    globals: {
        'import.meta.env': {
            VITE_API_BASE_URL: 'http://localhost:8080' // Provide a default value for testing
        }
    }
};: '<rootDir>/node_modules/react',
        '^react-dom
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(@material-tailwind|@heroicons)/)'
    ],
    // Add this globals section
    globals: {
        'import.meta.env': {
            VITE_API_BASE_URL: 'http://localhost:8080' // Provide a default value for testing
        }
    }
};: '<rootDir>/node_modules/react-dom',
        '^.+\.css
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(@material-tailwind|@heroicons)/)'
    ],
    // Add this globals section
    globals: {
        'import.meta.env': {
            VITE_API_BASE_URL: 'http://localhost:8080' // Provide a default value for testing
        }
    }
};: 'identity-obj-proxy',
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(@material-tailwind|@heroicons)/)'
    ],
    // Add this globals section
    globals: {
        'import.meta.env': {
            VITE_API_BASE_URL: 'http://localhost:8080' // Provide a default value for testing
        }
    }
};