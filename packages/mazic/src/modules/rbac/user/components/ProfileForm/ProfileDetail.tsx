import { Input } from '@mazic/ui'
import { FormImage, FormInput, FormItem, FormTextarea } from '@mazic/components/FormControl'

export const ProfileDetail = () => {
  return (
    <div className="mazic-row items-center">
      <div className="mazic-col-3">
        <FormImage field="avatar" className="mt-2" />
      </div>
      <div className="mazic-col-8">
        <div className="mazic-row">
          <FormItem label="First name" required col={6}>
            <FormInput field="first_name" placeholder="Enter first name..." />
          </FormItem>
          <FormItem label="Last name" col={6}>
            <FormInput field="last_name" placeholder="Enter last name..." />
          </FormItem>
          <FormItem label="Bio" col={12}>
            <FormTextarea field="bio" placeholder="Tell us a little about yourself..." />
          </FormItem>
          <FormItem label="Timezone" col={12}>
            <Input disabled value={Intl.DateTimeFormat().resolvedOptions().timeZone} />
          </FormItem>
        </div>
      </div>
    </div>
  )
}
