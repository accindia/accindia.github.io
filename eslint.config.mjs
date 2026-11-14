import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';

export default [
  {
    ignores: ['dist/**/*', 'docs/**/*', 'node_modules/**/*', 'src/**/*', '*.ts', '*.js', '*.mjs'],
  },
  firebaseRulesPlugin.configs['flat/recommended'],
];
