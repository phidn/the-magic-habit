import React, { useCallback } from 'react'
import { StyleSheet } from 'react-native'
import {
  GestureHandlerRootView,
  PanGestureHandler,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient'
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { rgbaToHex } from '@/utils/theme'

interface IProps {
  colors?: string[]
  styles: any
  onColorChanging?: (color: string) => void
  onColorChanged?: (color: string) => void
  size?: number
}

const DEFAULT_PALETTE = [
  '#17203A',
  '#fd79a8',
  '#8e44ad',
  '#10ac84',
  '#8395a7',
  '#ecf0f1',
  '#ff9ff3',
  '#2e86de',
  '#fdcb6e',
  '#00cec9',
]

const ColorPicker = (props: IProps) => {
  const { colors, styles, size, onColorChanging, onColorChanged } = props
  // Defs
  const PICKER_SIZE = size || 25
  const INTERNAL_PICKER = PICKER_SIZE * 0.8
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const background = useSharedValue('')
  const active = useSharedValue(0)
  const colorPalette = colors || DEFAULT_PALETTE
  const didChange = useCallback(
    (val: string) => {
      const hex = rgbaToHex(val)
      onColorChanged?.(hex)
    },
    [onColorChanged],
  )
  const onChange = useCallback(
    (color: string) => {
      onColorChanging?.(color)
    },
    [onColorChanging],
  )
  const adjustTranslateX = useDerivedValue(() => {
    return Math.min(Math.max(translateX.value, 0), styles.width)
  }, [translateX])
  const onEnd = useCallback(() => {
    'worklet'
    translateY.value = withTiming(0)
    active.value = 0
    if (onColorChanged) {
      runOnJS(didChange)(background.value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const panGestureEevent = useAnimatedGestureHandler({
    onStart: (_, ctx: { translateX: number } & Record<string, unknown>) => {
      ctx.translateX = _.x
      translateY.value = withTiming(-PICKER_SIZE)
      active.value = withTiming(1)
    },
    onActive: (event, ctx: { translateX: number } & Record<string, unknown>) => {
      translateX.value = ctx.translateX + event.translationX
      active.value = withTiming(1)
    },
    onEnd,
  })
  const tapGestureEvent = useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
    onStart: (event) => {
      translateY.value = withTiming(-(styles.height / 2) - PICKER_SIZE)
      translateX.value = withTiming(event.x)
      active.value = withTiming(1)
    },
    onEnd,
  })
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: adjustTranslateX.value },
        {
          translateY: translateY.value,
        },
      ],
    }
  })
  const arrowStyle = useAnimatedStyle(() => {
    return {
      opacity: active.value,
    }
  })
  const rInternal = useAnimatedStyle(() => {
    const inputRange = colorPalette.map(
      (_, index) => ((index + 1) / colorPalette.length) * styles.width,
    )
    const backgroundColor = interpolateColor(translateX.value, inputRange, colorPalette)
    if (onColorChanging) {
      runOnJS(onChange)(backgroundColor)
    }
    if (onColorChanged) {
      background.value = backgroundColor
    }
    return {
      backgroundColor,
    }
  })
  const compStyles = StyleSheet.create({
    picker: {
      position: 'absolute',
      backgroundColor: '#fff',
      width: PICKER_SIZE,
      height: PICKER_SIZE,
      borderRadius: PICKER_SIZE / 2,
      justifyContent: 'center',
      alignItems: 'center',
      left: -PICKER_SIZE / 2,
    },
    internalPicker: {
      backgroundColor: 'red',
      width: INTERNAL_PICKER,
      height: INTERNAL_PICKER,
      borderRadius: INTERNAL_PICKER / 2,
    },
    arrow: {
      position: 'absolute',
      bottom: -INTERNAL_PICKER / 2,
      width: 0,
      height: 0,
      borderStyle: 'solid',
      borderLeftWidth: INTERNAL_PICKER / 2,
      borderRightWidth: INTERNAL_PICKER / 2,
      borderTopWidth: INTERNAL_PICKER / 2,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: '#FFF',
    },
  })
  return React.createElement(
    GestureHandlerRootView,
    null,
    React.createElement(
      TapGestureHandler,
      { onGestureEvent: tapGestureEvent },
      React.createElement(
        Animated.View,
        null,
        React.createElement(
          PanGestureHandler,
          { onGestureEvent: panGestureEevent, minDist: 0 },
          React.createElement(
            Animated.View,
            { style: { justifyContent: 'center' } },
            React.createElement(LinearGradient, {
              colors: colorPalette,
              start: { x: 0, y: 0 },
              end: { x: 1, y: 0 },
              style: styles,
            }),
            React.createElement(
              Animated.View,
              { style: [compStyles.picker, rStyle] },
              React.createElement(Animated.View, { style: [compStyles.internalPicker, rInternal] }),
              React.createElement(Animated.View, { style: [compStyles.arrow, arrowStyle] }),
            ),
          ),
        ),
      ),
    ),
  )
}

export default ColorPicker
