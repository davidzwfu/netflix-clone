import { useEffect, useRef, useState } from 'react'
// @ts-ignore
import { SplideSlide } from '@splidejs/react-splide'
import PreviewModal from './PreviewModal'
import NumberSvg from './NumberSvg'
import DetailModal from './DetailModal'

export default function RowItem({ item, number }: { item: any, number?: number }) {
  const [isHovering, setIsHovering] = useState<boolean>(false)
  const [isHoveringModal, setIsHoveringModal] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const elementRef = useRef<any>()
  const modalRef = useRef<any>()
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    let timeout: number
    if (isHovering) {
      timeout = setTimeout(() => {
        setShowModal(true)
      }, 400)
    }
    if (!isHoveringModal)
      setShowModal(false)

    return () => clearTimeout(timeout)
  }, [isHovering, isHoveringModal])

  return <>
    <SplideSlide className={`row-item ${number ? 'row-item--top10' : ''}`}>
      <div className="row-item__container" ref={elementRef}
        onMouseEnter={() => setIsHovering(true)} 
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => setShowDetailModal(true)}
      >
        {number && <NumberSvg number={number} />}
        <div className="row-item__boxart">
          <img className="row-item__img" data-splide-lazy={number ? item.boxartVertical.url : item.boxart?.url} />
          <div className="fallback__container">
            <p className="fallback__text">{item.title}</p>
          </div>
        </div>
      </div>
    </SplideSlide>
    <PreviewModal
      showModal={showModal} 
      enterPosition={elementRef.current?.getBoundingClientRect()} 
      setIsHoveringModal={setIsHoveringModal} 
      item={item}
      fade={!!number}
      showDetailModal={showDetailModal}
      setShowDetailModal={setShowDetailModal} 
      ref={modalRef}
    />
    <DetailModal
      showModal={showDetailModal} 
      setShowModal={setShowDetailModal} 
      item={item}
      fade={!!number}
      enterPosition={modalRef.current?.getBoundingClientRect()} 
      exitPosition={elementRef.current?.getBoundingClientRect()} 
    />
  </>
}
