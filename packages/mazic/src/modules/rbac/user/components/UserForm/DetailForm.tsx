import { Input } from '@mazic-design-system'

import { FormImage, FormInput, FormItem } from '@mazic/components/FormControl'
import { usePageDetails } from '@mazic/hooks'

export const DetailForm = () => {
  const { isAdd } = usePageDetails()

  return (
    <div className="mazic-row">
      <div className="mazic-col-3">
        <FormImage field="avatar" />
      </div>
      <div className="mazic-col-8">
        <div className="mazic-row">
          <FormItem label="First name" required col={6}>
            <FormInput field="first_name" placeholder="Enter first name..." />
          </FormItem>
          <FormItem label="Last name" col={6}>
            <FormInput field="last_name" placeholder="Enter last name..." />
          </FormItem>
          <FormItem label="Email" required col={6}>
            <FormInput field="email" placeholder="Enter email..." />
          </FormItem>
          <FormItem label="Password" required col={6}>
            {isAdd ? (
              <FormInput
                type="password"
                field="password"
                placeholder="Enter password..."
                autoComplete="new-password"
              />
            ) : (
              <Input type="password" disabled placeholder="********" />
            )}
          </FormItem>
        </div>
      </div>
    </div>
  )
}
