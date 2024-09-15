import { i18n } from '@mazic/utils/i18n'

export const statusOptions = [
  { label: 'Enabled', value: 'enabled' },
  { label: 'Disabled', value: 'disabled' },
]

export const methodOptions = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' },
]

export const closeReasonTypeOptions = [
  { label: i18n.t('crm.closeReason.CLOSE_LOST'), value: 'CLOSE_LOST' },
  { label: i18n.t('crm.closeReason.CLOSE_WON'), value: 'CLOSE_WON' },
]

export const activeOptions = [
  { label: i18n.t('form.active'), value: true },
  { label: i18n.t('form.inActive'), value: false },
]
