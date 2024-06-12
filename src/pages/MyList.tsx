import '../stylesheets/MyList.css'
import { useAtomValue } from 'jotai'
import { myListAtom } from '../libs/atoms'
import MyListItem from '../components/MyListItem'

export default function MyList() {
  const myList = useAtomValue(myListAtom)

  return <>
    <div className="my-list">
      {myList.map(item => {
        return <MyListItem item={item} key={item.videoId} />
      })}
    </div>
  </>
}
