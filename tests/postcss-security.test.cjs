const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { createRequire } = require('node:module')
const { test } = require('node:test')

// Exercise the parser Next actually resolves, including nested dependencies.
const nextRequire = createRequire(require.resolve('next/package.json'))
const postcss = nextRequire('postcss')

test('CSS annotations cannot load source maps outside the CSS directory', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'postcss-security-'))
  try {
    const cssDir = path.join(root, 'styles')
    fs.mkdirSync(cssDir)
    const secret = 'private-source-sentinel'
    fs.writeFileSync(path.join(root, 'private.map'), JSON.stringify({
      version: 3, sources: ['private.txt'], sourcesContent: [secret],
      names: [], mappings: 'AAAA'
    }))
    const css = 'a{color:red}/*# sourceMappingURL=../private.map */'
    const parsed = postcss.parse(css, { from: path.join(cssDir, 'input.css') })
    assert.equal(parsed.source.input.map?.text, undefined)
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})

test('CSS with no source path cannot read an absolute source map', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'postcss-security-'))
  try {
    const mapPath = path.join(root, 'private.map')
    fs.writeFileSync(mapPath, JSON.stringify({
      version: 3, sources: ['private.txt'], sourcesContent: ['private-source-sentinel'],
      names: [], mappings: 'AAAA'
    }))
    const parsed = postcss.parse(`a{color:red}/*# sourceMappingURL=${mapPath} */`)
    assert.equal(parsed.source.input.map?.text, undefined)
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})
