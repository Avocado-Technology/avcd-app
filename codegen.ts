import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: "http://localhost:8000/graphql",
  documents: ["lib/graphql/**/*.ts", "app/**/*.tsx"],
  ignoreNoDocuments: true,
  generates: {
    "./lib/__generated__/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: false, // Apollo has native data masking
      },
      config: {
        avoidOptionals: {
          field: true,      // Make fields non-optional
          inputValue: false // Keep input values optional
        },
        nonOptionalTypename: true,
        skipTypeNameForRoot: true,
        defaultScalarType: "unknown",
        scalars: {
          DateTime: "string",
          UUID: "string",
          JSON: "Record<string, any>",
        },
      },
    },
  },
};

export default config;
