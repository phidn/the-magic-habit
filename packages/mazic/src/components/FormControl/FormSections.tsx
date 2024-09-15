import { Card, CardContent, CardHeader, CardTitle } from '@mazic-design-system'

import { FormControlProps } from './FormControl'
import { FormEditable } from './FormEditable'

interface FormSectionsProps {
  sections: FormControlProps['formSections'] | FormControlProps['formSections']
}

export const FormSections = ({ sections }: FormSectionsProps) => {
  return sections.map((section) => {
    return section?.enabled ? (
      <Card key={section.id} id={section.id} className="mb-2">
        <CardHeader>
          <CardTitle>{section.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <FormEditable>{section.elementRender()}</FormEditable>
        </CardContent>
      </Card>
    ) : null
  })
}
