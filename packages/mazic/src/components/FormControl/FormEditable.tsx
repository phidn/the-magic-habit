import React from 'react'

import { usePageDetails } from '@mazic/hooks/usePageDetails'

interface FormEditableProps {
  children: React.ReactElement
}

const EDITABLE_COMPONENTS = ['FormInput', 'FormSelect', 'FormTextarea'] as const

const FormEditable: React.FC<FormEditableProps> = ({ children }) => {
  const { isView } = usePageDetails()
  return React.Children.map(children, (child) => {
    if (EDITABLE_COMPONENTS.includes((child.type as any)?.displayName)) {
      return React.cloneElement(child, { disabled: isView })
    }
    if (child.props?.children) {
      return React.cloneElement(child, {
        children: <FormEditable children={child.props.children} />,
      })
    }
    return child
  })
}

FormEditable.displayName = 'FormEditable'

export { FormEditable }
