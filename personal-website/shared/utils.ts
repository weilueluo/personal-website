import { MutableRefObject } from "react";
import { twMerge } from "tailwind-merge";

export const jsonFetcher = <T>(input: RequestInfo | URL, init: RequestInit | undefined = undefined) => {
    return fetch(input, init).then((res) => res.json());
};

export function cookieToObj(cookie: string | undefined): Record<string, string> {
    if (cookie) {
        return cookie.split("; ").reduce((obj: Record<string, string>, pair) => {
            const [k, v] = pair.split("=");
            obj[k] = v;
            return obj;
        }, {});
    }

    return {};
}

export function objToCookie(obj: Record<string, string>) {
    return Object.entries(obj)
        .map(([k, v]) => k + "=" + v)
        .join("; ");
}

export const tm = (...classNames: (string | undefined | false | null | 0)[]): string => {
    return twMerge(...classNames);
};

// set utils
function union<T>(setA: Set<T>, setB: Set<T>) {
    const _union = new Set(setA);
    setB.forEach((elem) => _union.add(elem));
    return _union;
}

function intersection<T>(setA: Set<T>, setB: Set<T>) {
    const _intersection = new Set<T>();
    setB.forEach((elem) => {
        if (setA.has(elem)) {
            _intersection.add(elem);
        }
    });
    return _intersection;
}

export function timeSinceSeconds(seconds: number) {
    let interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}

export function timeSince(from: Date, date: Date) {
    const seconds = Math.floor((from.getTime() - date.getTime()) / 1000);

    return timeSinceSeconds(seconds);
}

export function isDevEnv() {
    return process && process.env.NODE_ENV === "development";
}

// https://stackoverflow.com/questions/6268508/restart-animation-in-css3-any-better-way-than-removing-the-element
export const restartAnimations = (element: Element): void => {
    for (const animation of document.getAnimations()) {
        if (element.contains((animation.effect as KeyframeEffect).target)) {
            // console.log(animation);
            animation.cancel();
            animation.play();
        }
    }
};

export function reTriggerAnimateFunction(element: MutableRefObject<any>, className: string) {
    return function (e: MouseEvent) {
        e.preventDefault;
        // -> removing the class
        element.current.classList.remove(className);

        // -> triggering reflow /* The actual magic */
        // without this it wouldn't work. Try uncommenting the line and the transition won't be retriggered.
        // This was, from the original tutorial, will no work in strict mode. Thanks Felis Phasma! The next uncommented line is the fix.
        // element.offsetWidth = element.offsetWidth;

        void element.current.offsetWidth;

        // -> and re-adding the class
        element.current.classList.add(className);
    };
}

// https://stackoverflow.com/a/52171480
export const stringHash = (str: string, seed = 42) => {
    let h1 = 0xdeadbeef ^ seed,
        h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};
