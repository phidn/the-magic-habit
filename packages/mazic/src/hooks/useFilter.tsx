import { useNavigate, useSearchParams } from 'react-router-dom'
import isEqual from 'lodash/isEqual'
import map from 'lodash/map'

import { CONFIG } from '@mazic/config/config'
import { IParams } from '@mazic/types'
import { DataTableFilterField } from '@mazic/types/dataTable'
import { createQueryString } from '@mazic/utils/utils'

interface ISearchSchema {
  filterSchema?: Record<string, any>
  filterFields?: DataTableFilterField[]
  enableCommon?: boolean
}

export const useFilter = ({ filterSchema, filterFields }: ISearchSchema) => {
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()
  const rawParams = Object.fromEntries(searchParams)
  const params: IParams = filterSchema?.parse?.(rawParams)

  const defaultParams = filterSchema?.parse?.({})
  const isFiltered = !isEqual(params, defaultParams)

  const onChangeSearch = (value: string) => {
    const newSearchParams = createQueryString({
      ...params,
      search: value,
    })
    navigate(`?${newSearchParams}`)
  }

  const onReset = () => {
    const newSearchParams = createQueryString({ ...defaultParams })
    navigate(`?${newSearchParams}`)
  }

  const filterList = map(filterFields, (filterItem) => {
    const _value = params?.[filterItem.filterKey]
    const _selectedValue = map(_value ? _value?.split(CONFIG.stringItemsSeparator) : [], (_val) => {
      if (filterItem?.typeValue === 'BOOLEAN') {
        if (_val === 'true') return true
        if (_val === 'false') return false
        return null
      }
      return _val
    })
    return {
      ...filterItem,
      selectedValue: _selectedValue,
      onChange: (value: string[]) => {
        const newSearchParams = createQueryString({
          ...params,
          [filterItem.filterKey]: value.join(CONFIG.stringItemsSeparator),
        })
        navigate(`?${newSearchParams}`)
      },
    }
  })

  return {
    searchParams,
    params,
    isFiltered,
    onReset,
    search: {
      value: params?.search || '',
      onChange: onChangeSearch,
    },
    filterList,
  }
}
