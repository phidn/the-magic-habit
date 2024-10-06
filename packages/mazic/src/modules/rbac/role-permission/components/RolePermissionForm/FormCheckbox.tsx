import { useCallback, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { Row } from '@tanstack/react-table'
import { cloneDeep, get, set } from 'lodash'

import { Checkbox } from '@mazic/ui'

interface CheckboxProps<T = any> {
  row: Row<T>
  role: {
    role_key: string
  }
}

export const FormCheckbox: React.FC<CheckboxProps> = ({ row, role }) => {
  const { getValues, setValue } = useFormContext()
  const values = getValues()
  const rowIds = row.id.split('.')

  const path = useMemo(
    () =>
      rowIds.reduce((acc: string, cur: string, index: number) => {
        if (index === rowIds.length - 1) {
          return `${acc}.${cur}.${role.role_key}.is_access`
        } else {
          return `${acc}.${cur}.children`
        }
      }, 'rolesPermissions'),
    [rowIds, role.role_key]
  )

  const { checked, childPaths } = useMemo(() => {
    let checked = get(values, path)

    const childPath = path.replace(/(.*)\.\w+\.\w+$/, '$1.children')
    const childPaths = get(values, childPath, []).map((_: any, idx: number) => {
      const _path = `${childPath}.${idx}.${role.role_key}.is_access`
      if (get(values, _path) === false) {
        checked = false
      }
      return _path
    })

    if (childPaths.length > 0) {
      checked = childPaths.every((_path: string) => get(values, _path) === true)
    }

    return { checked, childPaths }
  }, [values, path, role.role_key])

  const onCheckedChange = useCallback(() => {
    const newValues = cloneDeep(values)
    set(newValues, path, !checked)

    childPaths.forEach((_path: string) => {
      set(newValues, _path, !checked)
    })

    setValue('rolesPermissions', newValues.rolesPermissions)
  }, [values, path, checked, childPaths, setValue])

  return (
    <div className="h-4 text-center pr-4">
      <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}
