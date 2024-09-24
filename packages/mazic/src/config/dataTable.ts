import { activeOptions, verifiedOptions } from './forms'

export const FILTER_COMMON = {
  status: {
    title: 'Status',
    filterKey: 'is_active',
    options: activeOptions,
    multiSelect: false,
    typeValue: 'BOOLEAN',
  },
  verified: {
    title: 'Verified',
    filterKey: 'verified',
    options: verifiedOptions,
    multiSelect: false,
    typeValue: 'BOOLEAN',
  },
}
