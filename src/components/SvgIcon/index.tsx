interface SvgPropType {
  name: string
  prefix?: string
  color?: string
  width?: number
  height?: number
  [k: string]: any
}

export default function SvgIcon({
  name,
  prefix = 'svg',
  color = '#333',
  width = 20,
  height = 20,
  ...props
}: SvgPropType) {
  const symbolId = `#${prefix}-${name}`

  return (
    <svg {...props} aria-hidden='true' width={width} height={height}>
      <use href={symbolId} fill={color} />
    </svg>
  )
}
