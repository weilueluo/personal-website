
import styles from './anime.module.sass';
import { fetchFavouriteAnimeData } from './data';
import Section from "./section";


export default function Anime() {

  return (
    <>
      <div className={styles['all-container']}>
        <Section title='Favourites' fetchData={fetchFavouriteAnimeData}/>
      </div>
    </>
  )

}