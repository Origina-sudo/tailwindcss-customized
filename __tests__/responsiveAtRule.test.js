import postcss from 'postcss'
import plugin from '../src/lib/substituteResponsiveAtRules'
import config from '../defaultConfig.stub.js'

function run(input, opts = config) {
  return postcss([plugin(opts)]).process(input, { from: undefined })
}

test('it can generate responsive variants for nested at rules', () => {
  const input = `
    @responsive {
      .banana { color: yellow; }
      .chocolate { color: brown; }

      @supports(display: grid) {
        .grid\\:banana { color: blue; }
        .grid\\:chocolate { color: green; }
      }
    }
  `

  const output = `
    .banana {
      color: yellow;
    }

    .chocolate {
      color: brown;
    }

    @supports(display: grid) {
      .grid\\:banana {
        color: blue;
      }

      .grid\\:chocolate {
        color: green;
      }
    }

    @media (min-width: 500px) {
      .sm\\:banana {
        color: yellow;
      }

      .sm\\:chocolate {
        color: brown;
      }

      @supports(display: grid) {
        .sm\\:grid\\:banana {
          color: blue;
        }

        .sm\\:grid\\:chocolate {
          color: green;
        }
      }
    }

    @media (min-width: 750px) {
      .md\\:banana {
        color: yellow;
      }

      .md\\:chocolate {
        color: brown;
      }

      @supports(display: grid) {
        .md\\:grid\\:banana {
          color: blue;
        }

        .md\\:grid\\:chocolate {
          color: green;
        }
      }
    }

    @media (min-width: 1000px) {
      .lg\\:banana {
        color: yellow;
      }

      .lg\\:chocolate {
        color: brown;
      }

      @supports(display: grid) {
        .lg\\:grid\\:banana {
          color: blue;
        }

        .lg\\:grid\\:chocolate {
          color: green;
        }
      }
    }
  `

  return run(input, {
    screens: {
      sm: '500px',
      md: '750px',
      lg: '1000px',
    },
    options: {
      separator: ':',
    },
  }).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('it can generate responsive variants', () => {
  const input = `
    @responsive {
      .banana { color: yellow; }
      .chocolate { color: brown; }
    }
  `

  const output = `
      .banana { color: yellow; }
      .chocolate { color: brown; }
      @media (min-width: 500px) {
        .sm\\:banana { color: yellow; }
        .sm\\:chocolate { color: brown; }
      }
      @media (min-width: 750px) {
        .md\\:banana { color: yellow; }
        .md\\:chocolate { color: brown; }
      }
      @media (min-width: 1000px) {
        .lg\\:banana { color: yellow; }
        .lg\\:chocolate { color: brown; }
      }
  `

  return run(input, {
    screens: {
      sm: '500px',
      md: '750px',
      lg: '1000px',
    },
    options: {
      separator: ':',
    },
  }).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('it can generate responsive variants with a custom separator', () => {
  const input = `
    @responsive {
      .banana { color: yellow; }
      .chocolate { color: brown; }
    }
  `

  const output = `
      .banana { color: yellow; }
      .chocolate { color: brown; }
      @media (min-width: 500px) {
        .sm__banana { color: yellow; }
        .sm__chocolate { color: brown; }
      }
      @media (min-width: 750px) {
        .md__banana { color: yellow; }
        .md__chocolate { color: brown; }
      }
      @media (min-width: 1000px) {
        .lg__banana { color: yellow; }
        .lg__chocolate { color: brown; }
      }
  `

  return run(input, {
    screens: {
      sm: '500px',
      md: '750px',
      lg: '1000px',
    },
    options: {
      separator: '__',
    },
  }).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('it can generate responsive variants when classes have non-standard characters', () => {
  const input = `
    @responsive {
      .hover\\:banana { color: yellow; }
      .chocolate-2\\.5 { color: brown; }
    }
  `

  const output = `
      .hover\\:banana { color: yellow; }
      .chocolate-2\\.5 { color: brown; }
      @media (min-width: 500px) {
        .sm\\:hover\\:banana { color: yellow; }
        .sm\\:chocolate-2\\.5 { color: brown; }
      }
      @media (min-width: 750px) {
        .md\\:hover\\:banana { color: yellow; }
        .md\\:chocolate-2\\.5 { color: brown; }
      }
      @media (min-width: 1000px) {
        .lg\\:hover\\:banana { color: yellow; }
        .lg\\:chocolate-2\\.5 { color: brown; }
      }
  `

  return run(input, {
    screens: {
      sm: '500px',
      md: '750px',
      lg: '1000px',
    },
    options: {
      separator: ':',
    },
  }).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('responsive variants are grouped', () => {
  const input = `
    @responsive {
      .banana { color: yellow; }
    }

    .apple { color: red; }

    @responsive {
      .chocolate { color: brown; }
    }
  `

  const output = `
      .banana { color: yellow; }
      .apple { color: red; }
      .chocolate { color: brown; }
      @media (min-width: 500px) {
        .sm\\:banana { color: yellow; }
        .sm\\:chocolate { color: brown; }
      }
      @media (min-width: 750px) {
        .md\\:banana { color: yellow; }
        .md\\:chocolate { color: brown; }
      }
      @media (min-width: 1000px) {
        .lg\\:banana { color: yellow; }
        .lg\\:chocolate { color: brown; }
      }
  `

  return run(input, {
    screens: {
      sm: '500px',
      md: '750px',
      lg: '1000px',
    },
    options: {
      separator: ':',
    },
  }).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('screen prefix is only applied to the last class in a selector', () => {
  const input = `
    @responsive {
      .banana li * .sandwich #foo > div { color: yellow; }
    }
  `

  const output = `
      .banana li * .sandwich #foo > div { color: yellow; }
      @media (min-width: 500px) {
        .banana li * .sm\\:sandwich #foo > div { color: yellow; }
      }
      @media (min-width: 750px) {
        .banana li * .md\\:sandwich #foo > div { color: yellow; }
      }
      @media (min-width: 1000px) {
        .banana li * .lg\\:sandwich #foo > div { color: yellow; }
      }
  `

  return run(input, {
    screens: {
      sm: '500px',
      md: '750px',
      lg: '1000px',
    },
    options: {
      separator: ':',
    },
  }).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('responsive variants are generated for all selectors in a rule', () => {
  const input = `
    @responsive {
      .foo, .bar { color: yellow; }
    }
  `

  const output = `
      .foo, .bar { color: yellow; }
      @media (min-width: 500px) {
        .sm\\:foo, .sm\\:bar { color: yellow; }
      }
      @media (min-width: 750px) {
        .md\\:foo, .md\\:bar { color: yellow; }
      }
      @media (min-width: 1000px) {
        .lg\\:foo, .lg\\:bar { color: yellow; }
      }
  `

  return run(input, {
    screens: {
      sm: '500px',
      md: '750px',
      lg: '1000px',
    },
    options: {
      separator: ':',
    },
  }).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('selectors with no classes cannot be made responsive', () => {
  const input = `
    @responsive {
      div { color: yellow; }
    }
  `
  expect.assertions(1)
  return run(input, {
    screens: {
      sm: '500px',
      md: '750px',
      lg: '1000px',
    },
    options: {
      separator: ':',
    },
  }).catch(e => {
    expect(e).toMatchObject({ name: 'CssSyntaxError' })
  })
})

test('all selectors in a rule must contain classes', () => {
  const input = `
    @responsive {
      .foo, div { color: yellow; }
    }
  `
  expect.assertions(1)
  return run(input, {
    screens: {
      sm: '500px',
      md: '750px',
      lg: '1000px',
    },
    options: {
      separator: ':',
    },
  }).catch(e => {
    expect(e).toMatchObject({ name: 'CssSyntaxError' })
  })
})
