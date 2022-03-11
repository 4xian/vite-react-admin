import GaplessScroll from '@/components/GaplessScroll'
import type { ScrollOptions } from '@/components/GaplessScroll/type'
import styles from './index.module.scss'
import { UpOutlined, DownOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons'

const Main = () => {
  const handleVActive = (e: number) => {
    console.log(e)
  }

  const handleHActive = (e: number) => {
    console.log(e)
  }

  /* 滚动配置 */
  const vScrollOptions: Partial<ScrollOptions> = {
    autoPlay: false,
    interval: 2500,
    step: 30,
    scrollType: 0,
    direction: 'up',
    hoverStop: false,
    controls: true,
    controlsPadding: [40, 0]
  }

  const hScrollOptions: Partial<ScrollOptions> = {
    autoPlay: false,
    scrollType: 1,
    direction: 'left',
    interval: 2500,
    step: 60,
    controls: true,
    controlsPadding: [0, 40]
  }

  /* 自定义指示器 */
  const UpSlot = (): JSX.Element => {
    return <UpOutlined style={{ fontSize: 20 }} />
  }
  const DownSlot = (): JSX.Element => {
    return <DownOutlined style={{ fontSize: 20 }} />
  }
  const LeftSlot = (): JSX.Element => {
    return <LeftOutlined style={{ fontSize: 20 }} />
  }
  const RightSlot = (): JSX.Element => {
    return <RightOutlined style={{ fontSize: 20 }} />
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      {/* 上下滚动demo */}
      <GaplessScroll
        data={[1, 2, 3]}
        height={230}
        options={vScrollOptions}
        upSlot={UpSlot}
        downSlot={DownSlot}
        activeIndex={handleVActive}
      >
        <div>
          {[11, 22, 33, 44, 55, 66, 77, 88, 99].map((v) => {
            return (
              <span className={styles.testScroll} key={v}>
                {v}
              </span>
            )
          })}
        </div>
      </GaplessScroll>

      {/* 左右滚动demo */}
      <GaplessScroll
        data={[1, 2, 3]}
        width={380}
        options={hScrollOptions}
        leftSlot={LeftSlot}
        rightSlot={RightSlot}
        activeIndex={handleHActive}
      >
        <div className={styles.hScroll}>
          {[11, 22, 33, 44, 55, 66, 77, 88, 99].map((v) => {
            return (
              <div className={styles.hScrollItem} key={v}>
                {v}
              </div>
            )
          })}
        </div>
      </GaplessScroll>
    </div>
  )
}

export default Main
