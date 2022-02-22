import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
  useMemo,
  CSSProperties,
  useCallback
} from 'react'
import { DirectionEnum, ScrollOptions, P } from './type'
import styles from './index.module.scss'

const defaultOptions: ScrollOptions = {
  // 0:无缝滚动(用于无点击事件) 1: 触底滚动(到达最后一个会返回顶部，用于点击事件滚动/轮播)
  scrollType: 0,
  // 滚动方向 up:向上滚动 down:向下 left:向左 right:向右
  direction: 'up',
  // 滚动速度 越大越快
  speed: 1,
  // 符合滚动条件后是否自动滚动
  autoPlay: true,
  // 鼠标悬停是否停止滚动
  hoverStop: true,
  // 单次滚动(轮播)距离
  step: 0,
  // 轮播停留间隔 0为自动滚动
  interval: 0,
  // 轮播图片是否显示左右控制器
  controls: false,
  // 自定义控制器时，两边控制器宽(左右滚动时)或高(上下滚动时)总和
  // 即为外层容器width/height需补充的padding
  controlsPadding: [0, 0],
  // 单次轮播动画时间,若为滚动此项需为0
  animateTime: 0.4,
  // 无内容时显示的图
  emptyImg: '',
  // 无内容时显示的文字
  emptyText: '暂无数据',
  // 无数据时图片显示大小
  emptyWidth: '30%',
  //  解决水平无缝时margin间隔问题
  marginBias: 0
}

const MainFunc = forwardRef((props: P, ref) => {
  const {
    width = 100,
    height = 200,
    options,
    data = [],
    children,
    activeIndex,
    leftSlot,
    rightSlot,
    upSlot,
    downSlot
  } = props
  const [mergeOptions] = useState<ScrollOptions>({ ...defaultOptions, ...options })
  const {
    emptyImg,
    autoPlay,
    speed,
    interval,
    step,
    hoverStop,
    emptyText,
    emptyWidth,
    direction,
    animateTime,
    marginBias,
    scrollType,
    controls,
    controlsPadding
  } = mergeOptions
  useImperativeHandle(ref, () => ({
    init
  }))
  const scrollWrap: React.MutableRefObject<any> = useRef(null)
  const scrollContent: React.MutableRefObject<any> = useRef(null)
  const scrollItem: React.MutableRefObject<any> = useRef(null)
  // 可视区域ref
  const visualArea: React.MutableRefObject<any> = useRef(null)
  const [copyScrollHtml, setCopyScrollHtml] = useState('')

  // 位置偏移量X，Y
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  // 实际内容宽高
  const [realW, setRealW] = useState(0)
  const [realH, setRealH] = useState(0)

  // 实际可视区域 宽高
  const [realVisualW, setRealVisualW] = useState(0)
  const [realVisualH, setRealVisualH] = useState(0)

  const [transitionTime, setTransitionTime] = useState(0)

  // 滚动定时器
  const animateTimer = useRef<NodeJS.Timeout | number | null>(null)
  // 滚动间隔定时器
  const timer = useRef<NodeJS.Timeout | number | null>(null)

  const wrapStyle = useMemo((): CSSProperties => {
    return {
      width: `${width}px`,
      height: `${height}px`,
      padding: `${controlsPadding[0]}px ${controlsPadding[1]}px`
    }
  }, [width, height, controlsPadding])

  const contentStyle = useMemo((): CSSProperties => {
    return {
      height: '100%',
      overflow: 'hidden'
    }
  }, [])
  const posStyle = useMemo((): CSSProperties => {
    return {
      transform: `translate(${-x}px,${-y}px)`,
      transition: `all ${transitionTime}s ease-in`
    }
  }, [x, y, transitionTime])

  const isVertical = useMemo((): boolean => {
    return direction === DirectionEnum.UP || direction === DirectionEnum.DOWN
  }, [direction])

  const slotStyle = useMemo((): CSSProperties => {
    return isVertical ? { overflow: 'hidden', height: 'max-content' } : { display: 'flex', width: 'max-content' }
  }, [isVertical])

  // 是否满足垂直/水平滚动条件
  const vScroll = useCallback((): boolean => {
    const wrap: any = scrollWrap.current
    const content: any = scrollItem.current
    return content?.offsetHeight > wrap?.offsetHeight && content.offsetWidth <= wrap.offsetWidth
  }, [scrollWrap.current, scrollItem.current])
  const hScroll = useCallback((): boolean => {
    const wrap: any = scrollWrap.current
    const content: any = scrollItem.current
    return content?.offsetHeight <= wrap?.offsetHeight && content.scrollWidth > wrap.offsetWidth + marginBias
  }, [scrollWrap.current, scrollItem.current])
  // 是否符合滚动条件
  const isScroll = useMemo((): boolean => {
    return vScroll() || hScroll()
  }, [vScroll(), hScroll()])

  // 是否符合无缝条件(滚动,轮播)
  const isGapless = useMemo((): boolean => {
    return scrollType === 0 && isScroll
  }, [scrollType, isScroll])

  // 是否显示操作指示器
  const showControls = useMemo((): boolean | number => {
    return controls && interval && data.length
  }, [controls, interval, data])

  // 取消滚动
  const cancelScroll = () => {
    if (animateTimer.current) cancelAnimationFrame(Number(animateTimer.current))
    if (timer.current) clearTimeout(Number(timer.current))
  }
  // 重置变量
  const reset = () => {
    cancelScroll()
    setX(0)
    setY(0)
  }

  // 处理滚动间隔
  const handleStepScroll = (v: number) => {
    if (interval) {
      if (v % step === 0) {
        if (timer.current) clearTimeout(Number(timer.current))
        activeIndex && activeIndex(v / step)
        timer.current = setTimeout(() => {
          startScroll()
        }, interval)
      } else {
        startScroll()
      }
    } else {
      startScroll()
    }
  }

  // 开始滚动
  const startScroll = () => {
    if (animateTimer.current) cancelAnimationFrame(Number(animateTimer.current))
    animateTimer.current = requestAnimationFrame(() => {
      setTransitionTime(0)
      // 垂直滚动
      if (vScroll()) {
        // 向上
        if (direction === DirectionEnum.UP) {
          if (scrollType === 1) {
            setY((y) => {
              let z = y + speed
              if (z > realH - realVisualH) z = 0
              handleStepScroll(z)
              return z
            })
          } else {
            setY((y) => {
              let z = y + speed
              if (z >= realH) z = 0
              handleStepScroll(z)
              return z
            })
          }
        } else if (direction === DirectionEnum.DOWN) {
          //   向下
          if (scrollType === 1) {
            setY((y) => {
              let z = y - speed
              if (z < 0) z = realH - realVisualH
              handleStepScroll(z)
              return z
            })
          } else {
            setY((y) => {
              let z = y - speed
              if (y <= realH - realVisualH) z = realH * 2 - realVisualH
              handleStepScroll(z)
              return z
            })
          }
        }
      } else if (hScroll()) {
        // 水平滚动
        // 向左
        if (direction === DirectionEnum.LEFT) {
          if (scrollType === 1) {
            setX((x) => {
              let z = x + speed
              if (z > realW - realVisualW) z = 0
              handleStepScroll(z)
              return z
            })
          } else {
            setX((x) => {
              let z = x + speed
              if (z >= realW) z = 0
              handleStepScroll(z)
              return z
            })
          }
        } else if (direction === DirectionEnum.RIGHT) {
          // 向右
          if (scrollType === 1) {
            setX((x) => {
              let z = x - speed
              if (z < 0) z = realW - realVisualW
              handleStepScroll(z)
              return z
            })
          } else {
            setX((x) => {
              let z = x - speed
              if (z <= realW - realVisualW) z = realW * 2 - realVisualW
              handleStepScroll(z)
              return z
            })
          }
        }
      }
    })
  }

  const mouseEnter = () => {
    if (hoverStop && autoPlay && isScroll) {
      cancelScroll()
    }
  }
  const mouseLeave = () => {
    if (hoverStop && autoPlay && isScroll) {
      startScroll()
    }
  }

  /* 间隔轮播点击事件 上下左右 */
  const handleLeftClick = () => {
    if (x <= 0) {
      setTransitionTime(0)
      setX(realW - realVisualW)
      activeIndex && activeIndex((realW - realVisualW) / step)
    } else {
      setTransitionTime(animateTime)
      setX((x) => {
        activeIndex && activeIndex((x - step) / step)
        return x - step
      })
    }
  }
  const handleRightClick = () => {
    if (x >= realW - realVisualW) {
      setTransitionTime(0)
      setX(0)
      activeIndex && activeIndex(0)
    } else {
      setTransitionTime(animateTime)
      setX((x) => {
        activeIndex && activeIndex((x + step) / step)
        return x + step
      })
    }
  }

  const handleUpClick = () => {
    if (y <= 0) {
      setTransitionTime(0)
      setY(realH - realVisualH)
      activeIndex && activeIndex((realH - realVisualH) / step)
    } else {
      setTransitionTime(animateTime)
      setY((y) => {
        activeIndex && activeIndex((y - step) / step)
        return y - step
      })
    }
  }
  const handleDownClick = () => {
    /* setTransitionTime(() => {
            if (y >= realH - realVisualH) return 0
            return animateTime
        })
        setY(y => {
            let z = y
            if (z >= realH - realVisualH) z = 0
            else z = y + step
            activeIndex && activeIndex(z / step)
            return z
        }) */
    if (y >= realH - realVisualH) {
      setTransitionTime(0)
      setY(0)
      activeIndex && activeIndex(0)
    } else {
      setTransitionTime(animateTime)
      setY((y) => {
        activeIndex && activeIndex((y + step) / step)
        return y + step
      })
    }
  }

  const init = () => {
    reset()
    setRealH(scrollContent.current?.offsetHeight || 0)
    setRealW(scrollContent.current?.scrollWidth || 0)
    setRealVisualW(scrollContent.current?.offsetWidth || 0)
    setRealVisualH(visualArea.current?.offsetHeight || 0)
    if (autoPlay && isScroll) {
      if (isGapless) setCopyScrollHtml(scrollItem.current?.innerHTML)
      startScroll()
    }
  }

  useEffect(() => {
    init()
    return () => cancelScroll()
  }, [props.data, isScroll])

  /* 水平指示器插槽 */
  const HSlotEle = (): JSX.Element => {
    return (
      <>
        <div className={`${styles.scrollControls} ${styles.leftControls}`} onClick={handleLeftClick}>
          {leftSlot && leftSlot()}
        </div>
        <div className={`${styles.scrollControls} ${styles.rightControls}`} onClick={handleRightClick}>
          {rightSlot && rightSlot()}
        </div>
      </>
    )
  }
  /* 垂直指示器插槽 */
  const VSlotEle = (): JSX.Element => {
    return (
      <>
        <div className={[styles.scrollControls, styles.upControls].join(' ')} onClick={handleUpClick}>
          {upSlot && upSlot()}
        </div>
        <div className={`${styles.scrollControls} ${styles.downControls}`} onClick={handleDownClick}>
          {downSlot && downSlot()}
        </div>
      </>
    )
  }
  return (
    <div ref={scrollWrap} className={styles.minGaplessWrap} style={wrapStyle}>
      {showControls && (direction === 'left' || direction === 'right') ? HSlotEle() : null}
      {showControls && (direction === 'up' || direction === 'down') ? VSlotEle() : null}
      {data.length ? (
        <div ref={visualArea} style={contentStyle}>
          <div
            ref={scrollContent}
            className={isVertical ? '' : styles.gaplessScrollContent}
            style={posStyle}
            onMouseEnter={mouseEnter}
            onMouseLeave={mouseLeave}
          >
            <div ref={scrollItem} style={slotStyle}>
              {children}
            </div>
            {isGapless && <div style={slotStyle} dangerouslySetInnerHTML={{ __html: copyScrollHtml }}></div>}
          </div>
        </div>
      ) : (
        <div className={`${styles.scrollEmpty} ${styles.flexCenter}`}>
          {emptyImg && <img src={emptyImg} style={{ width: emptyWidth }} />}
          <p>{emptyText}</p>
        </div>
      )}
    </div>
  )
})
export default MainFunc
