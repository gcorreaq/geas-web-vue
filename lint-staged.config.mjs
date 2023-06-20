export default {
  '**/*.{js,ts,vue}': ['npm run lint', 'npm run format:check'],
  '**/*.ts?(x)': () => 'npm run type-check',
  '**/*.{json,yaml,yml}': ['npm run format:check'],
};
