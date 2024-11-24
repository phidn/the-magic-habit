import { habitSchema } from '@mazic/shared'

import { HabitForm } from '../components/HabitForm'

export const HabitUpdateScreen = () => {
  return <HabitForm schema={habitSchema} onSubmitForm={() => {}} />
}
