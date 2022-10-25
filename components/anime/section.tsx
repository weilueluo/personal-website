
import { useEffect, useMemo, useState } from 'react';
import { FavAnimeMedia } from '.';
import styles from './anime.module.sass';
import AnimeCard from './card';


function Header(props: {
    title: string,
    loadMoreButton: JSX.Element
    toggleButton: JSX.Element
}) {
    return (
        <div className={styles['section-header']}>
            <div className={styles['header-left']}>
                <span className={styles['section-title']}>{props.title}</span>
            </div>
            <div className={styles['header-right']}>
                {props.loadMoreButton}
                {props.toggleButton}
            </div>
        </div>
    )
}

function useSortedAnimeDataList(animeDataList: FavAnimeMedia[]) {
    const [sortedAnimeDataList, setSortedAnimeDataList] = useState([]);

    // set anime cards according to data                                                  
    useEffect(() => {

        if (!animeDataList) {
            return;
        }
        const newSortedAnimeDataList = animeDataList.slice().sort((a, b) => {
            const aDate = a.startDate || { year: 0, month: 0, day: 0 };
            const bDate = b.startDate || { year: 0, month: 0, day: 0 };

            // sort by date decending order
            if (aDate.year > bDate.year) {
                return -1;
            } else if (aDate.year < bDate.year) {
                return 1;
            }

            // same year
            if (aDate.month > bDate.month) {
                return -1;
            } else if (aDate.month < bDate.month) {
                return 1;
            }

            // same month
            if (aDate.day > bDate.day) {
                return -1;
            } else if (aDate.day < bDate.day) {
                return 1;
            }

            // same day
            return 0;
        });
        setSortedAnimeDataList(newSortedAnimeDataList);
    }, [animeDataList])

    return sortedAnimeDataList;
}

function AnimeCards(props: { animeDataList: FavAnimeMedia[], expand: boolean, loaded: boolean }) {
    if (!props.loaded) {
        return <span>loading ...</span>
    }

    return (
        <ul className={`${styles['anime-list']} ${props.expand ? '' : styles['collapse']}`}>
            {props.animeDataList.map(animeData => <AnimeCard key={animeData.id} animeData={animeData} />)}
        </ul>
    )
}

function useToggleAmount(initAmount: number, increment: number, decrement: number, min?: number, max?: number): [number, () => void, () => void] {

    const [displayAmount, setDisplayAmount] = useState(initAmount);
    const incrementFunction = () => {
        let newAmount = displayAmount + increment;
        if (max) {
            newAmount = Math.min(newAmount, max);
        }
        setDisplayAmount(newAmount);
    };
    const decrementFunction = () => {
        let newAmount = displayAmount - decrement;
        if (min) {
            newAmount = Math.max(newAmount, min);
        }
        setDisplayAmount(newAmount);
    };

    return [displayAmount, incrementFunction, decrementFunction]
}

function LoadMoreButton(props: any) {

    const { displayAmount, totalAmount, ...rest } = props;

    const [allLoaded, setAllLoaded] = useState(false);
    useEffect(() => {
        setAllLoaded(displayAmount >= totalAmount)
    }, [displayAmount, totalAmount]);

    if (allLoaded) {
        return <button className={`${styles['section-load-more']} ${styles['all-loaded']}`} {...rest}>all loaded</button>
    } else {
        return <button className={styles['section-load-more']} {...rest}>load more</button>
    }
}

function ToggleExpandButton(props: {
    expand: boolean,
    toggleFunc: () => any
}) {
    const [toggleText, setToggleText] = useState('collapse');
    useEffect(() => {
        setToggleText(props.expand ? 'collapse' : 'expand');
    }, [props.expand]);

    return <button className={styles['section-toggle']} onClick={props.toggleFunc}>{toggleText}</button>
}

function Footer(props: {
    loadMoreButton: JSX.Element,
    toggleButton: JSX.Element,
    expand: boolean
}) {

    return (
        <div className={styles['section-footer']}>
            {props.expand ? props.loadMoreButton : <></>}
            {props.expand ? props.toggleButton : <></>}
        </div>
    )
}

function useDisplayAnimeDataList(sortedAnimeDataList: FavAnimeMedia[], displayAmount: number) {

    const [displayAnimeDataList, setDisplayAnimeDataList] = useState([]);
    useEffect(() => {
        setDisplayAnimeDataList(sortedAnimeDataList.slice(0, displayAmount));
    }, [displayAmount, sortedAnimeDataList]);

    return displayAnimeDataList
}

const INIT_DISPLAY_AMOUNT = 15;
const INCREMENT_AMOUNT = 20;

export default function Section(props: {
    fetchData: () => Promise<FavAnimeMedia[]>,
    title: string
}) {

    const [animeDataList, setAnimeDataList] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const fetchData = props.fetchData;

    // load data into database once
    useMemo(() => {
        const animeDatabase = new Map();
        fetchData()
            .then(datas => {
                setLoaded(true);
                datas.forEach(data => animeDatabase[data.id] = data);
                setAnimeDataList(Object.values(animeDatabase));
            });
    }, [fetchData])

    // sort anime data once loaded
    const sortedAnimeDataList = useSortedAnimeDataList(animeDataList);

    // set display anime data according to display amount
    const [displayAmount, toggleIncrease, _toggleDecrease] = useToggleAmount(INIT_DISPLAY_AMOUNT, INCREMENT_AMOUNT, 0)
    const displayAnimeDataList = useDisplayAnimeDataList(sortedAnimeDataList, displayAmount);
    // set display amount when user want to load more
    const loadMoreButton = <LoadMoreButton displayAmount={displayAmount} totalAmount={sortedAnimeDataList.length} onClick={toggleIncrease} />

    // expand ui button
    const [expand, setExpand] = useState(false);
    const toggleExpandButton = <ToggleExpandButton toggleFunc={() => setExpand(!expand)} expand={expand} />

    return (
        <div className={styles['section-container']}>
            <Header title={props.title} loadMoreButton={loadMoreButton} toggleButton={toggleExpandButton} />

            <AnimeCards animeDataList={displayAnimeDataList} expand={expand} loaded={loaded} />

            <Footer expand={expand} loadMoreButton={loadMoreButton} toggleButton={toggleExpandButton} />
        </div>
    )

}