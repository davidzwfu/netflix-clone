import '../stylesheets/Home.css'
import '@splidejs/splide/css/core'
import lists from '../data/lists.json'
import featured from '../data/featured.json'
import Billboard from '../components/Billboard'
import Row from '../components/Row'

export default function Home() {
  return <>
    <Billboard featuredItem={featured[0]} />
    {lists.map(list => {
      return <Row list={list} key={list.name} />
    })}
  </>
}
