import '../stylesheets/MyList.css'
import { useAtomValue, useSetAtom } from 'jotai'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { createRef, useEffect } from 'react'
import { lockScrollingAtom, myListAtom } from '../libs/atoms'
import MyListItem from '../components/MyListItem'

export default function MyList() {
  const myList = useAtomValue(myListAtom)
  const setLockScrolling = useSetAtom(lockScrollingAtom)

  useEffect(() => {
    setLockScrolling(false)
  }, [myList])

  return <>
    <TransitionGroup className="my-list">
      {myList.map(item => {
        const nodeRef = createRef<HTMLDivElement>()
        return (
          <CSSTransition classNames="row-item" timeout={450} nodeRef={nodeRef} key={item.videoId}>
            <MyListItem item={item} ref={nodeRef} />
          </CSSTransition>
        )
      })}
    </TransitionGroup>
  </>
}
