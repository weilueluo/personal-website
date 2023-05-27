"use client";

import { UnResolvedTheme, useTheme } from "@/shared/themes";
import { tm } from "@/shared/utils";
import React, { ReactNode, useState } from "react";
import { BsFillMoonStarsFill, BsGearWideConnected } from "react-icons/bs";
import { ImSun } from "react-icons/im";
import { useMountedState } from "react-use";
import styles from "./ThemeButton_v1.module.scss";

const DARK_THEME = "dark";
const LIGHT_THEME = "light";
const SYSTEM_THEME = "system";

const THEMES: UnResolvedTheme[] = [DARK_THEME, LIGHT_THEME, SYSTEM_THEME];

const themeToIconMap: { [theme: string]: ReactNode } = {
    [DARK_THEME]: <BsFillMoonStarsFill className="icon-md" />,
    [LIGHT_THEME]: <ImSun className="icon-md" />,
    [SYSTEM_THEME]: <BsGearWideConnected className="icon-md" />,
};

const ThemeButton = React.forwardRef<React.ElementRef<"button">, React.ComponentPropsWithoutRef<"button">>(
    // eslint-disable-next-line react/prop-types
    ({ className, ...otherProps }, ref) => {
        const { unResolvedTheme, setTheme } = useTheme();

        const getNextTheme = (currTheme: UnResolvedTheme) => THEMES[(THEMES.indexOf(currTheme) + 1) % THEMES.length];

        const [leftActive, setLeftActive] = useState(false);
        const [nextTheme, setNextTheme] = useState<UnResolvedTheme>(getNextTheme(unResolvedTheme));
        const [leftTheme, setLeftTheme] = useState(nextTheme);
        const [rightTheme, setRightTheme] = useState(unResolvedTheme);
        const [leftIcon, setLeftIcon] = useState<ReactNode>(themeToIconMap[leftTheme]);
        const [rightIcon, setRightIcon] = useState<ReactNode>(themeToIconMap[rightTheme]);

        const switchTheme = (theme: UnResolvedTheme) => {
            // set the hidden item to have the next theme text first before showing the ui
            if (leftActive) {
                setRightTheme(theme);
                setLeftActive(false);
                setRightIcon(themeToIconMap[theme]);
            } else {
                setLeftTheme(theme);
                setLeftActive(true);
                setLeftIcon(themeToIconMap[theme]);
            }

            // invoke animation to show the hidden item
            // console.log(`ThemeButton: switchTheme(${theme})`);

            setTheme(theme);
        };

        const onClick = () => {
            switchTheme(nextTheme);
            setNextTheme(getNextTheme(nextTheme));
        };

        if (!useMountedState()) {
            return null; // avoid hydration errors because theme is undefined at server
        }

        return (
            <button
                ref={ref}
                onClick={onClick}
                {...otherProps}
                className={tm("flex h-fit w-fit flex-row items-center justify-around rounded-md", className)}>
                <span className={styles.text} data-active={leftActive}>
                    {leftTheme}
                </span>

                <div className={tm(styles.iconContainer, leftActive ? styles.leftActive : styles.rightActive)}>
                    <div>{leftIcon}</div>
                    <div>{rightIcon}</div>
                </div>

                <span className={styles.text} data-active={!leftActive}>
                    {rightTheme}
                </span>
            </button>
        );
    }
);

ThemeButton.displayName = "ThemeButton";

export default ThemeButton;