export default function({ variants }) {
  return function({ addUtilities }) {
    addUtilities(
      {
        '.bg-repeat': { 'background-repeat': 'repeat' },
        '.bg-no-repeat': { 'background-repeat': 'no-repeat' },
        '.bg-repeat-x': { 'background-repeat': 'repeat-x' },
        '.bg-repeat-y': { 'background-repeat': 'repeat-y' },
      },
      variants
    )
  }
}
