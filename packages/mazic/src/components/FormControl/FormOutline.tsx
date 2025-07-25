import { Card, CardContent, CardHeader, CardTitle } from '@mazic/ui'

import { CheckBoxLabel } from './CheckboxLabel'
import { FormControlProps } from './FormControl'

interface FormOutlineProps {
  formTitle: string
  formSections: FormControlProps['formSections'] | FormControlProps['formSections']
}

export const FormOutline = ({ formSections, formTitle }: FormOutlineProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{formTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        {formSections.map((section, index) =>
          section?.enabled ? (
            <CheckBoxLabel
              key={index}
              id={section.id || index}
              title={section.title || ''}
              checked={Boolean(section?.isValid)}
            />
          ) : null
        )}
      </CardContent>
    </Card>
  )
}
