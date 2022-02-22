// 滚动方向
export enum DirectionEnum {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right'
}

export type DirectionType = 'up' | 'down' | 'left' | 'right'

// 滚动初始化选项
export interface ScrollOptions {
  scrollType: number
  direction: string
  speed: number
  step: number
  autoPlay: boolean
  hoverStop: boolean
  interval: number
  controls: boolean
  controlsPadding: number[]
  animateTime: number
  emptyImg: string
  emptyText: string
  emptyWidth: string
  marginBias: number
}

// props
export interface P extends React.HTMLAttributes<HTMLDivElement> {
  width?: number
  height?: number
  data: unknown[]
  options?: Partial<ScrollOptions>
  activeIndex?: (e: number) => void
  leftSlot?: () => JSX.Element
  rightSlot?: () => JSX.Element
  upSlot?: () => JSX.Element
  downSlot?: () => JSX.Element
}
