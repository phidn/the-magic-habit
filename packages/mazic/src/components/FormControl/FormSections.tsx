import { Card, CardContent, CardHeader, CardTitle, cn } from '@mazic/ui'
import { IFormSection } from '@mazic/types/form'

interface FormSectionsProps {
  sections: IFormSection[]
}

export const FormSections = ({ sections }: FormSectionsProps) => {
  return sections.map((section) => {
    return section?.enabled ? (
      <Card key={section.id} id={section.id} className={cn('mb-2', !section.title && 'pt-6')}>
        {section.title && (
          <CardHeader className={cn(section.hideTitle && 'p-3')}>
            <CardTitle>{section.hideTitle ? '' : section.title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>{section.elementRender()}</CardContent>
      </Card>
    ) : null
  })
}
