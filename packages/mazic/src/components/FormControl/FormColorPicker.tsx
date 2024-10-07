import { baseColors } from '@mazic/config/baseColors'
import { useStore } from '@mazic/store/useStore'
import { IOption } from '@mazic/types/form'

import { FormSelect } from './FormSelect'

interface FormColorPickerProps {
  field: string
}

const FormColorPicker = ({ field }: FormColorPickerProps) => {
  const mode = useStore((state) => state.theme.mode)

  const options: IOption[] = baseColors.map((theme) => {
    return {
      value: theme?.name,
      renderLabel: () => (
        <div className="flex items-center">
          <div
            className="w-4 h-4 rounded-full mr-2"
            style={{
              backgroundColor: `hsl(${theme?.activeColor[mode === 'dark' ? 'dark' : 'light']})`,
            }}
          ></div>
          {theme.label}
        </div>
      ),
    }
  })
  return <FormSelect field={field} options={options} />
}

FormColorPicker.displayName = 'FormColorPicker'

export { FormColorPicker }
