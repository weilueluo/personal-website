import { useEffect, useState } from 'react';
import { fetchImageAsLocalUrl } from '../anime/data/common';
import { LOADING_IMAGE_PATH } from './constants';


export function useSequentiallyLoadedImageURL(urls: string[]): [string, number] {
    urls = (urls && urls.filter(url => url && url.trim() != '')) || [];

    const [imageURL, setImageURL] = useState(LOADING_IMAGE_PATH);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index >= urls.length) {
            return;
        }
        fetchImageAsLocalUrl(urls[index])
            .then(localUrl => setImageURL(localUrl))
            .then(() => setIndex(index + 1))
            .catch(error => `failed to load image: ${urls[index]}, error=${error}`)
    }, [index, urls])

    return [imageURL, index];
}


