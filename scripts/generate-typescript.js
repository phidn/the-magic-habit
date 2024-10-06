import fs from 'fs'
import _ from 'lodash'
import path from 'path'
import prettier from 'prettier'
import { InputData, jsonInputForTargetLanguage, quicktype } from 'quicktype-core'

const quickType = async ({ json, language, schemaName = 'Root' }) => {
  const jsonData = json

  const jsonInput = jsonInputForTargetLanguage('typescript')
  const jsonSource = {
    name: schemaName || 'Root',
    samples: [JSON.stringify(jsonData)],
  }
  await jsonInput.addSource(jsonSource)

  const inputData = new InputData()
  inputData.addInput(jsonInput)

  const outputLang = language || 'typescript'

  return await quicktype({
    inputData,
    lang: outputLang,
    rendererOptions: { 'just-types': 'true' },
  })
}

const main = async () => {
  const paths = ['./packages/shared/src/config/permissions/permissions.json']
  for (let idx = 0; idx < paths.length; idx++) {
    const _path = paths[idx]
    const fileName = path.basename(_path).split('.')[0]
    const schemaName = fileName.charAt(0).toUpperCase() + fileName.slice(1)
    const jsonPermission = fs.readFileSync(_path, 'utf8')

    // Generate typescript schema
    const tsResult = await quickType({
      json: JSON.parse(jsonPermission),
      language: 'typescript',
      schemaName: schemaName,
    })
    const tsDestPath = `${path.dirname(_path)}/${fileName}.d.ts`
    const tsFormatted = await prettier.format(tsResult.lines.join('\n'), {
      parser: 'typescript',
      semi: false,
    })
    fs.writeFileSync(tsDestPath, tsFormatted)

    // Generate golang schema
    const goResult = await quickType({
      json: JSON.parse(jsonPermission),
      language: 'golang',
      schemaName: schemaName,
    })
    const goDestPath = `${path.dirname(_path)}/${fileName}.schema.go`
    fs.mkdirSync(path.dirname(goDestPath), { recursive: true })
    const goFormatted = `package ${_.snakeCase(fileName)}_schema\n\n${goResult.lines.join('\n')}`
    fs.writeFileSync(goDestPath, goFormatted)
  }
}

main()
