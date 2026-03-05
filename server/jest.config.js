export default {
	preset: "ts-jest/presets/default-esm",
	testEnvironment: "node",
	extensionsToTreatAsEsm: [".ts"],
	transform: {
		"^.+\\.ts$": [
			"ts-jest",
			{
				useESM: true,
			},
		],
	},
	testMatch: ["**/__tests__/**/*.test.ts", "**/?(*.)+(spec|test).ts"],
	testPathIgnorePatterns: ["/integration/"],
	setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
	moduleFileExtensions: ["ts", "js", "json"],
};
