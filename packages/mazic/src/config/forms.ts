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

export const verifiedOptions = [
  { label: i18n.t('form.verified'), value: true },
  { label: i18n.t('form.notVerified'), value: false },
]

export const timesOptions = [
  { label: '12:00 AM', value: '00:00' },
  { label: '1:00 AM', value: '01:00' },
  { label: '2:00 AM', value: '02:00' },
  { label: '3:00 AM', value: '03:00' },
  { label: '4:00 AM', value: '04:00' },
  { label: '5:00 AM', value: '05:00' },
  { label: '6:00 AM', value: '06:00' },
  { label: '7:00 AM', value: '07:00' },
  { label: '8:00 AM', value: '08:00' },
  { label: '9:00 AM', value: '09:00' },
  { label: '10:00 AM', value: '10:00' },
  { label: '11:00 AM', value: '11:00' },
  { label: '12:00 PM', value: '12:00' },
  { label: '1:00 PM', value: '13:00' },
  { label: '2:00 PM', value: '14:00' },
  { label: '3:00 PM', value: '15:00' },
  { label: '4:00 PM', value: '16:00' },
  { label: '5:00 PM', value: '17:00' },
  { label: '6:00 PM', value: '18:00' },
  { label: '7:00 PM', value: '19:00' },
  { label: '8:00 PM', value: '20:00' },
  { label: '9:00 PM', value: '21:00' },
  { label: '10:00 PM', value: '22:00' },
  { label: '11:00 PM', value: '23:00' },
]
