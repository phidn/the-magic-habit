import { Form } from '@/components/FormControl'
import { IFormProps } from '@/types/types'

import { checkInOpts } from '../utils'

export const HabitForm = (props: IFormProps) => {
  return (
    <Form.Container initialValues={{}}>
      <Form.Section title="Detail" icon="information-variant">
        <Form.Select field="check_in_type" options={checkInOpts} placeholder="Check-in type" />
        <Form.Input label="Color" field="color" />
        <Form.Input label="Title" field="title" />
        <Form.Input label="Metric (km/hour/min)" field="metric" />
      </Form.Section>
      <Form.Section title="Privacy" icon="security">
        <Form.Input label="Private" field="is_private" />
      </Form.Section>
    </Form.Container>
  )
}
