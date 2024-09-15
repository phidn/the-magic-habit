import { useTranslation } from 'react-i18next'

import { FormInput, FormItem, FormSelect } from '@mazic/components/FormControl'
import { closeReasonTypeOptions } from '@mazic/config/forms'

export const DetailForm = () => {
  const { t } = useTranslation()

  return (
    <div className="mazic_row">
      <FormItem label={t('crm.closeReason.type')} required>
        <FormSelect
          field="type"
          options={closeReasonTypeOptions}
          placeholder="Select close reason type..."
        />
      </FormItem>
      <FormItem label={t('crm.closeReason.text')} col={8} required>
        <FormInput field="value" placeholder="Enter close reason value..." />
      </FormItem>
    </div>
  )
}
