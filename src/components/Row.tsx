// @ts-ignore
import { Splide, SplideTrack } from '@splidejs/react-splide'
import RowItem from './RowItem'

export default function Row({ list }: { list: any }) {
  return (
    <div className="row" key={list.name}>
      <div className="row-header">
        <span className="row-header__title">{list.name}</span>
        {list.type != 'top10' &&
          <div className="row-header__flex">
            <span className="row-header__more">Explore All</span>
            <svg className="row-header__svg" width="24" height="24" viewBox="0 0 24 24"><path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        }
      </div>
      <div className="row-container">
        <Splide hasTrack={false} options={{
          perPage: 6,
          padding: { left: '4%', right: '4%' },
          gap: '.4vw',
          lazyLoad: 'nearby',
          preloadPages: 2,
          speed: 750,
          easing: 'ease',
          drag: false,
          omitEnd: true,
          waitForTransition: true,
          breakpoints: {
            499: { perPage: 2 },
            799: { perPage: 3 },
            1099: { perPage: 4 },
            1399: { perPage: 5 },
          },
        }}>
          <SplideTrack>
            {list.items.map((item: any, index: number) => {
              return <RowItem item={item} number={list.type == 'top10' ? index + 1 : undefined} key={item.videoId} />
            })}
          </SplideTrack>
        </Splide>
      </div>
    </div>
  )
}
