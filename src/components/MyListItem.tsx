import { forwardRef, useEffect, useRef, useState } from 'react'
import { useAtomValue } from 'jotai'
import { myListAtom } from '../libs/atoms'
import PreviewModal from './PreviewModal'
import DetailModal from './DetailModal'

export default forwardRef(function MyListItem({ item }: { item: any }, ref: any) {
  const [isHovering, setIsHovering] = useState<boolean>(false)
  const [isHoveringModal, setIsHoveringModal] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const elementRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const myList = useAtomValue(myListAtom)

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
    <div className="row-item" ref={ref}>
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
    
    {myList.some(x => x.videoId == item.videoId) &&
      <>
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
  </>
})
