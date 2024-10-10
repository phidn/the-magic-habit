import { IconProps } from '../types'

export const CoffeeIcon = (props: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}>
      <defs>
        <mask id="lineMdBuyMeACoffeeTwotone0">
          <path
            fill="#fff"
            d="M5 6C5 4 7 6 11.5 6C16 6 19 4 19 6L19 7C19 8.5 17 9 12.5 9C8 9 5 9 5 7L5 6Z"
          />
        </mask>
        <mask id="lineMdBuyMeACoffeeTwotone1">
          <path
            fill="#fff"
            d="M10.125 18.15C10.04 17.29 9.4 11.98 9.4 11.98C9.4 11.98 11.34 12.31 12.5 11.73C13.66 11.16 14.98 11 14.98 11C14.98 11 14.4 17.96 14.35 18.46C14.3 18.96 13.45 19.3 12.95 19.3L11.23 19.3C10.73 19.3 10.21 19 10.125 18.15Z"
          />
        </mask>
      </defs>
      <g
        fill="none"
        stroke="hsl(var(--background)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.05"
      >
        <path
          strokeDasharray={32}
          strokeDashoffset={32}
          d="M7.5 10.5c0 0 0.83 6.93 1 8.5c0.17 1.57 1.5 2 2.5 2l2 0c1.5 0 2.88 -1.14 3 -2c0.13 -0.86 1 -12 1 -12"
        >
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="32;0" />
        </path>
        <path
          strokeDasharray={12}
          strokeDashoffset={12}
          d="M8 4c1.1 -0.57 2 -1 4 -1c2 0 4.5 0.5 4.5 3"
        >
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.8s"
            dur="0.2s"
            values="12;0"
          />
        </path>
      </g>
      <rect
        width={16}
        height={5}
        x={20}
        y={4}
        fill="hsl(var(--background)"
        mask="url(#lineMdBuyMeACoffeeTwotone0)"
      >
        <animate fill="freeze" attributeName="x" begin="0.4s" dur="0.4s" values="20;4" />
      </rect>
      <rect
        width={8}
        height={10}
        x={8}
        y={20}
        fill="hsl(var(--background)"
        fillOpacity="0.3"
        mask="url(#lineMdBuyMeACoffeeTwotone1)"
      >
        <animate fill="freeze" attributeName="y" begin="1s" dur="0.4s" values="20;10" />
      </rect>
    </svg>
  )
}
