import { Card, CardContent, CardHeader, CardTitle } from '@mazic-design-system'

import { IFormSection } from '@mazic/types/form'

interface FormSectionsProps {
  sections: IFormSection[]
}

export const FormSections = ({ sections }: FormSectionsProps) => {
  return sections.map((section) => {
    return section?.enabled ? (
      <Card key={section.id} id={section.id} className="mb-2">
        <CardHeader>
          <CardTitle>{section.title}</CardTitle>
        </CardHeader>
        <CardContent>{section.elementRender()}</CardContent>
      </Card>
    ) : null
  })
}
