import Image, { ImageProps } from "next/image";
import { useState } from "react";

export type ProgressiveImageProps = Omit<ImageProps, "src"> & {
    srcs: (string | undefined)[];
    fallback?: JSX.Element;
};

const ProgressiveImage = (props: ProgressiveImageProps) => {
    let { srcs, alt, fallback, ...rest } = props;
    srcs = srcs.filter((src) => !!src); // filter falsy url
    const [imIndex, setImIndex] = useState(0);

    if (srcs.length <= 0) {
        console.warn(`no proper image source given: ${srcs}`);
    }

    const [loaded, setLoaded] = useState(false);
    return (
        <>
            {!loaded && fallback}
            <Image
                src={srcs[imIndex] || "#"}
                onLoadingComplete={() => {
                    setLoaded(true);
                    if (imIndex < srcs.length - 1) {
                        setImIndex(imIndex + 1);
                    }
                }}
                alt={alt}
                {...rest}
            />
        </>
    );
};

export default ProgressiveImage;
