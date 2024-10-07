import * as ReactDOM from 'react-dom/client'

import './utils/i18n'

import { AppLayout } from './layouts/AppLayout/AppLayout'

import './styles/mazic.scss'
import './styles/tailwind.css'
import './styles/theme.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

// TODO: Add page lazy loading
root.render(<AppLayout />)
