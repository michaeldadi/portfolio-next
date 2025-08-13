import type { Config } from 'prettier';

const prettierConfig: Config = {
  plugins: ['prettier-plugin-tailwindcss'],
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 100,
  endOfLine: 'auto',
  bracketSpacing: true,
  arrowParens: 'avoid',
  jsxSingleQuote: true,
  bracketSameLine: false,
};

export default prettierConfig;
