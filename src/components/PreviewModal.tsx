import { forwardRef, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Transition } from 'react-transition-group'
import { formatDuration } from '../libs/utils'

export default forwardRef(function PreviewModal({ 
  showModal, enterPosition, setIsHoveringModal, item, fade, showDetailModal, setShowDetailModal
}: { 
  showModal: boolean
  enterPosition: DOMRect 
  setIsHoveringModal: (state: boolean) => void
  item: any
  fade?: boolean
  showDetailModal: boolean
  setShowDetailModal: (state: boolean) => void
}, ref: any) {
  const nodeRef = useRef<HTMLDivElement>(null)
  const [isInPlaylist, setIsInPlaylist] = useState(item.isInPlaylist)
  const [thumbsRating, setThumbsRating] = useState(item.thumbsRating)

  const defaultStyle = {
    transition: 'all .25s ease',
    top: enterPosition?.y + window.scrollY,
    width: enterPosition?.width * 1.5,
    translate: 0,
    boxShadow: 'none',
    transform: 'scale(0.66667)',
    willChange: 'transform',
    left: enterPosition?.x - (enterPosition?.width / 4),
    transformOrigin: '50% 0',
    ...fade && { opacity: 0 },
    ...enterPosition?.x < 100 && {
      left: enterPosition?.x,
      transformOrigin: '0 0',
    },
    ...enterPosition?.x > (window.innerWidth - enterPosition?.width - 100) && {
      left: enterPosition?.x - (enterPosition?.width / 2),
      transformOrigin: '100% 0',
    },
    ...showDetailModal && {
      transition: 'all .0s',
      opacity: 0,
    },
  }

  const transitionStyles: any = {
    entering: { 
      translate: '0 -30%',
      opacity: 1,
      boxShadow: 'rgba(0, 0, 0, 0.75) 0px 3px 10px',
      transform: 'none',
    },
    entered:  { 
      translate: '0 -30%',
      opacity: 1,
      boxShadow: 'rgba(0, 0, 0, 0.75) 0px 3px 10px',
      transform: 'none',
    },
  }

  function renderThumbs(thumbsRating: string) {
    if (thumbsRating == 'THUMBS_WAY_UP')
      return <svg width="24" height="24" viewBox="0 0 24 24" role="img" data-icon="ThumbsUpTwoFillStandard" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M17.313 2.50407L17.407 3.25579C17.4688 3.75001 17.4688 4.24999 17.407 4.74421L17.125 7H21.5C22.3284 7 23 7.67157 23 8.5C23 9.02174 22.7336 9.48127 22.3295 9.75H22.5C23.3284 9.75 24 10.4216 24 11.25C24 11.9804 23.478 12.5888 22.7867 12.7226C23.2148 12.9868 23.5 13.4601 23.5 14C23.5 14.8284 22.8284 15.5 22 15.5H21.6181C21.8556 15.7654 22 16.1158 22 16.5C22 17.3284 21.3284 18 20.5 18H20H17.9195C17.9722 17.7585 18 17.5075 18 17.25C18 16.2903 17.6138 15.4209 16.9883 14.7886C16.996 14.6934 17 14.5972 17 14.5C17 12.567 15.433 11 13.5 11H11.3906L11.3915 10.9923C11.4739 10.3333 11.4739 9.66668 11.3915 9.00772L11.2976 8.256L10.0645 8.41013L11.2976 8.256C11.2865 8.16745 11.2731 8.0797 11.2574 7.99281C11.519 7.83232 11.7422 7.61247 11.9074 7.34813L13.848 4.2432C13.9473 4.08427 14 3.90062 14 3.7132V0.47644C14 0.21331 14.2133 0 14.4764 0C15.9181 0 17.1342 1.07353 17.313 2.50407ZM9.31301 8.50407L9.40697 9.25579C9.46875 9.75001 9.46875 10.25 9.40697 10.7442L9.125 13H13.5C14.3284 13 15 13.6716 15 14.5C15 15.0217 14.7336 15.4813 14.3294 15.75H14.5C15.3284 15.75 16 16.4216 16 17.25C16 17.9804 15.478 18.5888 14.7867 18.7226C15.2147 18.9868 15.5 19.4601 15.5 20C15.5 20.8284 14.8284 21.5 14 21.5H13.6181C13.8556 21.7654 14 22.1158 14 22.5C14 23.3284 13.3284 24 12.5 24H12H9H8.01556C6.69475 24 5.39679 23.6553 4.25 23L4.07684 22.9011C3.04352 22.3106 1.874 22 0.683874 22C0.306181 22 0 21.6938 0 21.3161V15.7543C0 15.3078 0.295977 14.9154 0.725279 14.7928L2.76086 14.2112C3.23665 14.0752 3.64516 13.7677 3.90742 13.3481L5.848 10.2432C5.94733 10.0843 6 9.90062 6 9.7132V6.47644C6 6.21331 6.21331 6 6.47644 6C7.91812 6 9.13419 7.07353 9.31301 8.50407Z" fill="currentColor"></path></svg>
    else if (thumbsRating == 'THUMBS_UP')
      return <svg width="24" height="24" viewBox="0 0 24 24" role="img" data-icon="ThumbsUpFillStandard" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M13.407 6.25579L13.313 5.50407C13.1342 4.07353 11.9181 3 10.4764 3C10.2133 3 10 3.21331 10 3.47644V6.7132C10 6.90062 9.94733 7.08427 9.848 7.2432L7.90742 10.3481C7.64516 10.7677 7.23665 11.0752 6.76086 11.2112L4.72528 11.7928C4.29598 11.9154 4 12.3078 4 12.7543V18.3161C4 18.6938 4.30618 19 4.68387 19C5.874 19 7.04352 19.3106 8.07684 19.9011L8.25 20C9.39679 20.6553 10.6947 21 12.0156 21H13H16H16.5C17.3284 21 18 20.3284 18 19.5C18 19.1158 17.8556 18.7654 17.6181 18.5H18C18.8284 18.5 19.5 17.8284 19.5 17C19.5 16.4601 19.2147 15.9868 18.7867 15.7226C19.478 15.5888 20 14.9804 20 14.25C20 13.4216 19.3284 12.75 18.5 12.75H18.3294C18.7336 12.4813 19 12.0217 19 11.5C19 10.6716 18.3284 10 17.5 10H13.125L13.407 7.74421C13.4688 7.24999 13.4688 6.75001 13.407 6.25579Z" fill="currentColor"></path></svg>
    else if (thumbsRating == 'THUMBS_DOWN')
      return <svg width="24" height="24" viewBox="0 0 24 24" role="img" data-icon="ThumbsDownFillStandard" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M10.593 17.7442L10.687 18.4959C10.8658 19.9265 12.0819 21 13.5236 21C13.7867 21 14 20.7867 14 20.5236V17.2868C14 17.0994 14.0527 16.9157 14.152 16.7568L16.0926 13.6519C16.3548 13.2323 16.7633 12.9248 17.2391 12.7888L19.2747 12.2072C19.704 12.0846 20 11.6922 20 11.2457V5.68387C20 5.30618 19.6938 5 19.3161 5C18.126 5 16.9565 4.68942 15.9232 4.09895L15.75 4C14.6032 3.34469 13.3053 3 11.9844 3H11H8H7.5C6.67157 3 6 3.67157 6 4.5C6 4.88418 6.14443 5.23462 6.38195 5.5H6C5.17157 5.5 4.5 6.17157 4.5 7C4.5 7.53991 4.78525 8.0132 5.21328 8.27737C4.522 8.41118 4 9.01963 4 9.75C4 10.5784 4.67157 11.25 5.5 11.25H5.67055C5.26638 11.5187 5 11.9783 5 12.5C5 13.3284 5.67157 14 6.5 14H10.875L10.593 16.2558C10.5312 16.75 10.5312 17.25 10.593 17.7442Z" fill="currentColor"></path></svg>
    else
      return <svg width="24" height="24" viewBox="0 0 24 24" role="img" data-icon="ThumbsUpStandard" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M10.696 8.7732C10.8947 8.45534 11 8.08804 11 7.7132V4H11.8377C12.7152 4 13.4285 4.55292 13.6073 5.31126C13.8233 6.22758 14 7.22716 14 8C14 8.58478 13.8976 9.1919 13.7536 9.75039L13.4315 11H14.7219H17.5C18.3284 11 19 11.6716 19 12.5C19 12.5929 18.9917 12.6831 18.976 12.7699L18.8955 13.2149L19.1764 13.5692C19.3794 13.8252 19.5 14.1471 19.5 14.5C19.5 14.8529 19.3794 15.1748 19.1764 15.4308L18.8955 15.7851L18.976 16.2301C18.9917 16.317 19 16.4071 19 16.5C19 16.9901 18.766 17.4253 18.3994 17.7006L18 18.0006L18 18.5001C17.9999 19.3285 17.3284 20 16.5 20H14H13H12.6228C11.6554 20 10.6944 19.844 9.77673 19.5382L8.28366 19.0405C7.22457 18.6874 6.11617 18.5051 5 18.5001V13.7543L7.03558 13.1727C7.74927 12.9688 8.36203 12.5076 8.75542 11.8781L10.696 8.7732ZM10.5 2C9.67157 2 9 2.67157 9 3.5V7.7132L7.05942 10.8181C6.92829 11.0279 6.72404 11.1817 6.48614 11.2497L4.45056 11.8313C3.59195 12.0766 3 12.8613 3 13.7543V18.5468C3 19.6255 3.87447 20.5 4.95319 20.5C5.87021 20.5 6.78124 20.6478 7.65121 20.9378L9.14427 21.4355C10.2659 21.8094 11.4405 22 12.6228 22H13H14H16.5C18.2692 22 19.7319 20.6873 19.967 18.9827C20.6039 18.3496 21 17.4709 21 16.5C21 16.4369 20.9983 16.3742 20.995 16.3118C21.3153 15.783 21.5 15.1622 21.5 14.5C21.5 13.8378 21.3153 13.217 20.995 12.6883C20.9983 12.6258 21 12.5631 21 12.5C21 10.567 19.433 9 17.5 9H15.9338C15.9752 8.6755 16 8.33974 16 8C16 6.98865 15.7788 5.80611 15.5539 4.85235C15.1401 3.09702 13.5428 2 11.8377 2H10.5Z" fill="currentColor"></path></svg>
  }
  
  return createPortal(
    <Transition nodeRef={nodeRef} in={showModal} timeout={250} unmountOnExit>
      {state => (
        <div ref={nodeRef} className="modal"
          onMouseEnter={() => setIsHoveringModal(true)} 
          onMouseLeave={() => setIsHoveringModal(false)}
          style={{
            ...defaultStyle,
            ...transitionStyles[state],
          }}
        >
          <img className="modal__img modal__img--placeholder" src={item.boxart?.url} />
          <img className="modal__img" src={item.boxartHighRes?.url} ref={ref} />
          <div className="modal-info" style={{
            opacity: 0,
            transition: 'opacity .15s ease',
            ...state == 'entering' && { opacity: 1 },
            ...state == 'entered' && { opacity: 1 },
            ...state == 'exiting' && { transition: 'opacity .15s ease .1s' },
          }}>
            <div className="modal-info__clickable" onClick={() => setShowDetailModal(true)}></div>
            <div className="modal-info__controls">
              <button className="modal-info__btn modal-info__btn--primary">
                <svg width="24" height="24" viewBox="0 0 24 24" role="img" data-icon="PlayStandard" aria-hidden="true"><path d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z" fill="currentColor"></path></svg>
              </button>
              {isInPlaylist ?
                <button className="modal-info__btn" onClick={() => setIsInPlaylist(false)} key={0}>
                  <svg width="24" height="24" viewBox="0 0 24 24" role="img" data-icon="CheckmarkStandard" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M21.2928 4.29285L22.7071 5.70706L8.70706 19.7071C8.51952 19.8946 8.26517 20 7.99995 20C7.73474 20 7.48038 19.8946 7.29285 19.7071L0.292847 12.7071L1.70706 11.2928L7.99995 17.5857L21.2928 4.29285Z" fill="currentColor"></path></svg>
                  <span className="tooltip">Remove from My List</span>
                </button>
                :
                <button className="modal-info__btn" onClick={() => setIsInPlaylist(true)} key={1}>
                  <svg width="24" height="24" viewBox="0 0 24 24" role="img" data-icon="PlusStandard" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M11 11V2H13V11H22V13H13V22H11V13H2V11H11Z" fill="currentColor"></path></svg>
                  <span className="tooltip">Add to My List</span>
                </button>
              }
              <div className="modal-info__btn">
                {renderThumbs(thumbsRating)}
                <div className="popover-menu">
                  <button className="popover-menu__btn popover-menu__btn--outlined" onClick={() => setThumbsRating('THUMBS_DOWN')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" role="img" data-icon="ThumbsDownFillStandard" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M10.593 17.7442L10.687 18.4959C10.8658 19.9265 12.0819 21 13.5236 21C13.7867 21 14 20.7867 14 20.5236V17.2868C14 17.0994 14.0527 16.9157 14.152 16.7568L16.0926 13.6519C16.3548 13.2323 16.7633 12.9248 17.2391 12.7888L19.2747 12.2072C19.704 12.0846 20 11.6922 20 11.2457V5.68387C20 5.30618 19.6938 5 19.3161 5C18.126 5 16.9565 4.68942 15.9232 4.09895L15.75 4C14.6032 3.34469 13.3053 3 11.9844 3H11H8H7.5C6.67157 3 6 3.67157 6 4.5C6 4.88418 6.14443 5.23462 6.38195 5.5H6C5.17157 5.5 4.5 6.17157 4.5 7C4.5 7.53991 4.78525 8.0132 5.21328 8.27737C4.522 8.41118 4 9.01963 4 9.75C4 10.5784 4.67157 11.25 5.5 11.25H5.67055C5.26638 11.5187 5 11.9783 5 12.5C5 13.3284 5.67157 14 6.5 14H10.875L10.593 16.2558C10.5312 16.75 10.5312 17.25 10.593 17.7442Z" fill="currentColor"></path></svg>
                    <span className="tooltip">Not for me</span>
                  </button>
                  <button className="popover-menu__btn" onClick={() => setThumbsRating('THUMBS_UP')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" role="img" data-icon="ThumbsUpFillStandard" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M13.407 6.25579L13.313 5.50407C13.1342 4.07353 11.9181 3 10.4764 3C10.2133 3 10 3.21331 10 3.47644V6.7132C10 6.90062 9.94733 7.08427 9.848 7.2432L7.90742 10.3481C7.64516 10.7677 7.23665 11.0752 6.76086 11.2112L4.72528 11.7928C4.29598 11.9154 4 12.3078 4 12.7543V18.3161C4 18.6938 4.30618 19 4.68387 19C5.874 19 7.04352 19.3106 8.07684 19.9011L8.25 20C9.39679 20.6553 10.6947 21 12.0156 21H13H16H16.5C17.3284 21 18 20.3284 18 19.5C18 19.1158 17.8556 18.7654 17.6181 18.5H18C18.8284 18.5 19.5 17.8284 19.5 17C19.5 16.4601 19.2147 15.9868 18.7867 15.7226C19.478 15.5888 20 14.9804 20 14.25C20 13.4216 19.3284 12.75 18.5 12.75H18.3294C18.7336 12.4813 19 12.0217 19 11.5C19 10.6716 18.3284 10 17.5 10H13.125L13.407 7.74421C13.4688 7.24999 13.4688 6.75001 13.407 6.25579Z" fill="currentColor"></path></svg>
                    <span className="tooltip">I like this</span>
                  </button>
                  <button className="popover-menu__btn" onClick={() => setThumbsRating('THUMBS_WAY_UP')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" role="img" data-icon="ThumbsUpTwoFillStandard" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M17.313 2.50407L17.407 3.25579C17.4688 3.75001 17.4688 4.24999 17.407 4.74421L17.125 7H21.5C22.3284 7 23 7.67157 23 8.5C23 9.02174 22.7336 9.48127 22.3295 9.75H22.5C23.3284 9.75 24 10.4216 24 11.25C24 11.9804 23.478 12.5888 22.7867 12.7226C23.2148 12.9868 23.5 13.4601 23.5 14C23.5 14.8284 22.8284 15.5 22 15.5H21.6181C21.8556 15.7654 22 16.1158 22 16.5C22 17.3284 21.3284 18 20.5 18H20H17.9195C17.9722 17.7585 18 17.5075 18 17.25C18 16.2903 17.6138 15.4209 16.9883 14.7886C16.996 14.6934 17 14.5972 17 14.5C17 12.567 15.433 11 13.5 11H11.3906L11.3915 10.9923C11.4739 10.3333 11.4739 9.66668 11.3915 9.00772L11.2976 8.256L10.0645 8.41013L11.2976 8.256C11.2865 8.16745 11.2731 8.0797 11.2574 7.99281C11.519 7.83232 11.7422 7.61247 11.9074 7.34813L13.848 4.2432C13.9473 4.08427 14 3.90062 14 3.7132V0.47644C14 0.21331 14.2133 0 14.4764 0C15.9181 0 17.1342 1.07353 17.313 2.50407ZM9.31301 8.50407L9.40697 9.25579C9.46875 9.75001 9.46875 10.25 9.40697 10.7442L9.125 13H13.5C14.3284 13 15 13.6716 15 14.5C15 15.0217 14.7336 15.4813 14.3294 15.75H14.5C15.3284 15.75 16 16.4216 16 17.25C16 17.9804 15.478 18.5888 14.7867 18.7226C15.2147 18.9868 15.5 19.4601 15.5 20C15.5 20.8284 14.8284 21.5 14 21.5H13.6181C13.8556 21.7654 14 22.1158 14 22.5C14 23.3284 13.3284 24 12.5 24H12H9H8.01556C6.69475 24 5.39679 23.6553 4.25 23L4.07684 22.9011C3.04352 22.3106 1.874 22 0.683874 22C0.306181 22 0 21.6938 0 21.3161V15.7543C0 15.3078 0.295977 14.9154 0.725279 14.7928L2.76086 14.2112C3.23665 14.0752 3.64516 13.7677 3.90742 13.3481L5.848 10.2432C5.94733 10.0843 6 9.90062 6 9.7132V6.47644C6 6.21331 6.21331 6 6.47644 6C7.91812 6 9.13419 7.07353 9.31301 8.50407Z" fill="currentColor"></path></svg>
                    <span className="tooltip">Love this!</span>
                  </button>
                </div>
              </div>
              <button className="modal-info__btn modal-info__btn--expand" onClick={() => setShowDetailModal(true)}>
                <svg width="24" height="24" viewBox="0 0 24 24" role="img" data-icon="ChevronDownStandard" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M12 15.5859L19.2928 8.29297L20.7071 9.70718L12.7071 17.7072C12.5195 17.8947 12.2652 18.0001 12 18.0001C11.7347 18.0001 11.4804 17.8947 11.2928 17.7072L3.29285 9.70718L4.70706 8.29297L12 15.5859Z" fill="currentColor"></path></svg>
                <span className="tooltip">Episodes & info</span>
              </button>
            </div>
            <div className="modal-info__metadata">
              {item.matchScore?.matchPercent && <span className="modal-info__match">{item.matchScore?.matchPercent}% Match</span>}
              <span className="modal-info__maturity">{item.contentAdvisory?.certificationValue}</span>
              <span className="modal-info__duration">{formatDuration(item.displayRuntimeSec) ?? item.numSeasonsLabel}</span>
              {item.playbackBadges.includes('VIDEO_HD') && <span className="modal-info__playback">HD</span>}
            </div>
            <div className="modal-info__tags">
              {item.textEvidence?.at(0)?.text.split(', ').slice(0, 3).map((el: string) => (
                <span key={el}>{el}</span>
              ))}
            </div>
          </div>
        </div>

      )}
    </Transition>,
    document.querySelector('.body') ?? document.body,
  )
})
