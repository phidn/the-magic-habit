import { useEffect, useState } from 'react'

import { Input } from '@mazic/design-system'

interface ToolbarSearchProps {
  search: string
  onChangeSearch: (value: string) => void
}

export const ToolbarSearch = ({ search, onChangeSearch }: ToolbarSearchProps) => {
  const [inputSearch, setInputSearch] = useState('')
  useEffect(() => {
    setInputSearch(search)
  }, [search])

  return (
    <Input
      placeholder="Search all..."
      value={inputSearch}
      onChange={(e) => {
        setInputSearch(e.target.value)
      }}
      onKeyDown={(e) => e.key === 'Enter' && onChangeSearch(inputSearch)}
      className="h-8 w-[150px] lg:w-[250px]"
    />
  )
}
