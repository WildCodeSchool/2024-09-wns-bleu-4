import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: "http://backend:4000",
    documents: ["src/**/*.tsx"],
    generates: {
      "./src/__generated__/": {
        preset: "client",
        presetConfig: {
          gqlTagName: "gql",
        },
      },
    },
    ignoreNoDocuments: true,
  };

export default config;