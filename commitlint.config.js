module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'subject-starts-with-lowercase': ({ subject }) => {
          if (!subject) {
            return [true]
          }

          const firstLetter = subject.match(/\p{L}/u)?.[0]

          if (!firstLetter) {
            return [true]
          }

          return [
            firstLetter === firstLetter.toLocaleLowerCase(),
            'subject must start with a lowercase letter',
          ]
        },
      },
    },
  ],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-case': [0],
    'subject-starts-with-lowercase': [2, 'always'],
    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [2, 'always'],
  },
}
