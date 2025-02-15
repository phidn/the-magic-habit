import { FormInput, FormItem, FormSelect } from '@mazic/components/FormControl'
import { timesOptions } from '@mazic/config/forms'

export const TelegramForm = () => {
  return (
    <div className="mazic-row">
      <FormItem label="Daily time" col={4}>
        <FormSelect field="telegram_time" options={timesOptions} />
      </FormItem>
      <FormItem label="Bot Token" col={4}>
        <FormInput field="telegram_bot_token" />
      </FormItem>
      <FormItem label="Chat Id" col={4}>
        <FormInput field="telegram_chat_id" />
      </FormItem>
    </div>
  )
}
