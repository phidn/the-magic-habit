import { activeOptions, verifiedOptions } from './forms'

export const FILTER_COMMON = {
  status: {
    title: 'Status',
    label: 'Status',
    filterKey: 'is_active',
    options: activeOptions,
    multiSelect: false,
    typeValue: 'BOOLEAN',
  },
  verified: {
    title: 'Verified',
    label: 'Verified',
    filterKey: 'verified',
    options: verifiedOptions,
    multiSelect: false,
    typeValue: 'BOOLEAN',
  },
}
