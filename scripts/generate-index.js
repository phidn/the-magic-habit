const fs = require('fs')
const path = require('path')

const paths = [
  path.resolve(__dirname, '../packages/mazic-ui/src/icons'),
  path.resolve(__dirname, '../packages/mazic-ui/src/ui'),
  path.resolve(__dirname, '../packages/mazic-ui/src/aceui'),
  path.resolve(__dirname, '../packages/mazic/src/hooks'),
  path.resolve(__dirname, '../packages/mazic/src/components/FormControl'),
  path.resolve(__dirname, '../packages/mazic/src/components/Commons'),
  path.resolve(__dirname, '../packages/mazic/src/components/DataTable'),
  path.resolve(__dirname, '../packages/mazic/src/components/Columns'),
  path.resolve(__dirname, '../packages/mazic/src/components/Toolbar'),
]

paths.forEach((dir) => {
  const files = fs.readdirSync(dir)
  let content = '// This file is generated automatically.\n'

  files.forEach((file) => {
    const baseName = path.basename(file, path.extname(file))
    if (baseName === 'index') {
      return
    }
    content += `export * from './${baseName}'\n`
  })

  // sort the content
  content = content.split('\n').sort().join('\n').trim() + '\n'
  fs.writeFileSync(path.resolve(dir, './index.ts'), content)
})
