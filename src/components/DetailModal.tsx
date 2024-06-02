import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Transition } from 'react-transition-group'
import { useSetAtom } from 'jotai'
import { formatDuration } from '../libs/utils'
import { lockScrollingAtom, scrollPositionAtom } from '../libs/atoms'

export default function DetailModal({ 
  showModal, setShowModal, item, fade, enterPosition, exitPosition
}: { 
  showModal: boolean
  setShowModal: (state: boolean) => void
  item: any
  fade?: boolean
  enterPosition?: DOMRect 
  exitPosition?: DOMRect 
}) {
  const nodeRef = useRef<HTMLDivElement>(null)
  const [isInPlaylist, setIsInPlaylist] = useState(item.isInPlaylist)
  const [thumbsRating, setThumbsRating] = useState(item.thumbsRating)
  const setLockScrolling = useSetAtom(lockScrollingAtom)
  const setScrollPosition = useSetAtom(scrollPositionAtom)

  const defaultStyle = {
    transition: 'all .45s ease',
    top: '2em',
    width: '920px',
    translate: 0,
    transform: 'scale(0.8)',
    willChange: 'transform',
    left: 'auto',
    transformOrigin: '50% 25%',
    boxShadow: 'none',
    ...!enterPosition && { opacity: 0 },
    ...enterPosition && { 
      transform: `scale(${enterPosition.width / 920})`,
      translate: `${enterPosition.x - (window.innerWidth / 2) + (enterPosition.width / 2)}px calc(${enterPosition.y}px - 2em)`,
    },
    ...exitPosition && { transformOrigin: '50% 0%' },
  }

  const transitionStyles: any = {
    entering: {
      boxShadow: 'rgba(0, 0, 0, 0.75) 0px 3px 10px',
      transform: 'scale(1)',
      translate: '0 0',
      ...!enterPosition && { opacity: 1 },
    },
    entered:  {
      boxShadow: 'rgba(0, 0, 0, 0.75) 0px 3px 10px',
      transform: 'scale(1)',
      translate: '0 0',
      ...!enterPosition && { opacity: 1 },
    },
    exiting: {
      ...!exitPosition && {
        transition: 'all .25s ease-in',
        opacity: 0,
      },
      ...exitPosition && {
        opacity: 1,
        transformOrigin: '50% 0%',
        transform: `scale(${exitPosition.width / 920})`,
        translate: `${exitPosition.x - (document.body.clientWidth / 2) + (exitPosition.width / 2)}px calc(${exitPosition.y}px - 2em)`,
      },
      ...fade && { opacity: 0 },
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

  function lockScrolling() {
    setScrollPosition(window.scrollY)
    setLockScrolling(true)
  }
  
  return createPortal(
    <Transition nodeRef={nodeRef} in={showModal} timeout={450} unmountOnExit
      onEnter={() => lockScrolling()}
      onExited={() => setLockScrolling(false)}
    >
      {state => (
        <div ref={nodeRef} className="modal-container">
          <div className="modal-backdrop" style={{
            opacity: 0,
            transition: 'opacity .45s ease',
            ...state == 'entering' && { opacity: 1 },
            ...state == 'entered' && { opacity: 1 },
            ...state == 'exiting' && { transition: 'opacity .25s ease' },
          }} onClick={() => setShowModal(false)}></div>
          <div className="modal"
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}
          >
            <button className="modal__close" title="close" onClick={() => setShowModal(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" role="img" data-icon="XStandard" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M10.5858 12L2.29291 3.70706L3.70712 2.29285L12 10.5857L20.2929 2.29285L21.7071 3.70706L13.4142 12L21.7071 20.2928L20.2929 21.7071L12 13.4142L3.70712 21.7071L2.29291 20.2928L10.5858 12Z" fill="currentColor"></path></svg>
            </button>
            <div className="modal-main">
              <img className="modal__img modal__img--placeholder" src={item.billboard?.url ?? item.boxart?.url} />
              <div className="modal-main__gradient" style={{
                ...(exitPosition && state == 'exiting') && { 
                  opacity: 0,
                  transition: 'opacity .25s ease',
                }
              }}>
                <img className="modal__img" src={item.storyArt?.url} />
              </div>
              <div className="modal-main__info" style={{
                ...(exitPosition && state == 'exiting') && { 
                  opacity: 0,
                  transition: 'opacity .25s ease',
                }
              }}>
                <img className="modal-main__logo" src={item.logoArtwork.url} alt={item.title} />
                <div className="modal-info__controls">
                  <button className="billboard-info__btn billboard-info__btn--primary">
                    <svg width="24" height="24" viewBox="0 0 24 24" role="img" data-icon="PlayStandard" aria-hidden="true"><path d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z" fill="currentColor"></path></svg>
                    Play
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
                </div>
              </div>
            </div>
            <div className="modal-body" style={{
              opacity: 1,
              transition: 'opacity .15s ease',
              ...state == 'exiting' && { opacity: 0 },
            }}>
              <div className="modal-details">
                <div className="modal-details__left">
                  <div className="modal-info__metadata">
                    {item.matchScore?.matchPercent && <span className="modal-info__match">{item.matchScore?.matchPercent}% Match</span>}
                    <span className="modal-info__duration">{item.latestYear}</span>
                    <span className="modal-info__duration">{formatDuration(item.displayRuntimeSec) ?? item.numSeasonsLabel}</span>
                    <div className="modal-badges">
                      {item.playbackBadges?.includes('VIDEO_HD') && <span className="modal-info__playback">HD</span>}
                      {item.playbackBadges?.includes('AUDIO_ASSISTIVE') && 
                        <svg width="32" height="32" viewBox="0 0 24 24" role="img" data-icon="AudioDescriptionStandard" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M21.9782 7.52002H22.2621C23.37 8.81831 24.0001 10.4801 24.0001 12.2077C24.0001 13.7414 23.505 15.2301 22.6221 16.4453H22.3348H21.8501H21.5662C22.5598 15.2613 23.1207 13.7691 23.1207 12.2077C23.1207 10.449 22.404 8.75599 21.1611 7.52002H21.445H21.9782ZM6.91381 16.4796H8.87336V7.52661H6.42566L0 16.4796H2.87701L3.63174 15.2956H6.91381V16.4796ZM4.8625 13.4299H6.92592V10.224L4.8625 13.4299ZM12.3019 9.62283C13.621 9.62283 14.6839 10.6926 14.6839 12.0048C14.6839 13.3203 13.621 14.3901 12.3019 14.3901H11.6787V9.62283H12.3019ZM12.5443 16.4743C15.0128 16.4743 17.0208 14.4698 17.0208 12.0048C17.0208 9.52935 15.0335 7.52826 12.565 7.52826H12.5373H9.79883V16.4778H12.5443V16.4743ZM20.0103 7.52002H19.7264H19.1932H18.9093C20.1522 8.75599 20.8689 10.449 20.8689 12.2077C20.8689 13.7691 20.308 15.2613 19.3144 16.4453H19.5983H20.083H20.3634C21.2531 15.2301 21.7482 13.7414 21.7482 12.2077C21.7482 10.4801 21.1181 8.81831 20.0103 7.52002ZM17.4745 7.52002H17.7584C18.8663 8.81831 19.4895 10.4801 19.4895 12.2077C19.4895 13.7414 19.0013 15.2301 18.1116 16.4453H17.8277H17.3464H17.0625C18.0492 15.2613 18.6101 13.7691 18.6101 12.2077C18.6101 10.449 17.9004 8.75599 16.6575 7.52002H16.9344H17.4745Z" fill="currentColor"></path></svg>
                      }
                      {item.playbackBadges?.includes('TEXT_CLOSED_CAPTIONS') && 
                        <svg width="16" height="16" viewBox="0 0 16 16" role="img" data-icon="SubtitlesSmall" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M0 1.75C0 1.33579 0.335786 1 0.75 1H15.25C15.6642 1 16 1.33579 16 1.75V12.25C16 12.6642 15.6642 13 15.25 13H12.75V15C12.75 15.2652 12.61 15.5106 12.3817 15.6456C12.1535 15.7806 11.8709 15.785 11.6386 15.6572L6.80736 13H0.75C0.335786 13 0 12.6642 0 12.25V1.75ZM1.5 2.5V11.5H7H7.19264L7.36144 11.5928L11.25 13.7315V12.25V11.5H12H14.5V2.5H1.5ZM6 6.5L3 6.5V5L6 5V6.5ZM13 7.5H10V9H13V7.5ZM3 9V7.5L9 7.5V9L3 9ZM13 5H7V6.5H13V5Z" fill="currentColor"></path></svg>
                      }
                    </div>
                  </div>
                  <div className="modal-rating">
                    <span className="modal-rating__age">{item.contentAdvisory?.certificationValue}</span>
                    <span className="modal-rating__content">{item.contentAdvisory?.i18nReasonsText}</span>
                  </div>
                  <p className="modal-details__description">{item.contextualSynopsis?.text ?? '...'}</p>
                </div>
                <div className="modal-details__right">
                  <div className="modal-tags">
                    <span className="modal-tags__label">Cast: </span>
                    {item.cast?.edges.slice(0, 3).map((el: any) => el.node?.name).join(', ') ?? '...'}
                  </div>
                  <div className="modal-tags">
                    <span className="modal-tags__label">Genres: </span>
                    {item.genreTags?.edges.slice(0, 3).map((el: any) => el.node?.name).join(', ') ?? '...'}
                  </div>
                  <div className="modal-tags">
                    <span className="modal-tags__label">This show is: </span>
                    {item.moodTags && item.moodTags?.slice(0, 3).map((el: any) => el.displayName).join(', ')}
                    {item.textEvidence && item.textEvidence?.at(0)?.text.split(', ').slice(0, 3).join(', ')}
                  </div>
                </div>
              </div>

              <div className="modal-episodes">
                <div className="modal-episodes__heading">Episodes</div>
                <div className="modal-episodes__subheading">
                  <span className="modal-episodes__label">Season 1: </span>
                  <span className="modal-rating__age">{item.contentAdvisory?.certificationValue}</span>
                  <span className="modal-rating__content">{item.contentAdvisory?.i18nReasonsText}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Transition>,
    document.body,
  )
}
