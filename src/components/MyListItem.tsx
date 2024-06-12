import { useEffect, useRef, useState } from 'react'
import PreviewModal from './PreviewModal'
import DetailModal from './DetailModal'

export default function MyListItem({ item }: { item: any }) {
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
    <div className="row-item">
      <div className="row-item__container" ref={elementRef}
        onMouseEnter={() => setIsHovering(true)} 
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => setShowDetailModal(true)}
      >
        <div className="row-item__boxart">
          <img className="row-item__img" loading="lazy" src={item.boxart?.url} />
          <div className="fallback__container">
            <p className="fallback__text">{item.title}</p>
          </div>
        </div>
      </div>
    </div>
    <PreviewModal
      showModal={showModal} 
      enterPosition={elementRef.current?.getBoundingClientRect()} 
      setIsHoveringModal={setIsHoveringModal} 
      item={item}
      showDetailModal={showDetailModal}
      setShowDetailModal={setShowDetailModal} 
      ref={modalRef}
    />
    <DetailModal
      showModal={showDetailModal} 
      setShowModal={setShowDetailModal} 
      item={item}
      enterPosition={(modalRef.current ?? elementRef.current)?.getBoundingClientRect()} 
      exitPosition={elementRef.current?.getBoundingClientRect()} 
    />
  </>
}
