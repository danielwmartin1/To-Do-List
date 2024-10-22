import jestConfig from './jest.config';

// Frontend/jest.config.test.js

describe('Jest Configuration', () => {
    test('should have the correct transform settings', () => {
        expect(jestConfig.transform).toEqual({
            "^.+\\.jsx?$": "babel-jest"
        });
    });

    // Add more tests for other configurations if needed
});