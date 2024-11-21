import { Appbar } from 'react-native-paper';
import { DropdownHeaderProps } from './types';
import { useMemo } from 'react';

function DropdownHeader(props: DropdownHeaderProps) {
  const { label, resetMenu, toggleMenu, value } = props;
  const isValueSelected = Array.isArray(value) ? value.length > 0 : !!value;
  const style = useMemo(
    () => ({ borderTopRightRadius: 4, borderTopLeftRadius: 4 }),
    []
  );

  return (
    <Appbar.Header statusBarHeight={0} style={style}>
      {isValueSelected && <Appbar.Action icon={'reload'} onPress={resetMenu} />}
      <Appbar.Content title={label} />
      <Appbar.Action
        icon={isValueSelected ? 'check' : 'close'}
        onPress={toggleMenu}
      />
    </Appbar.Header>
  );
}

export default DropdownHeader;
