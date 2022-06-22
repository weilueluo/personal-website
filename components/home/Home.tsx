import { OrbitControls, Stats } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { EffectComposer, SMAA } from '@react-three/postprocessing';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ACESFilmicToneMapping, sRGBEncoding } from 'three';
import Ball from '../scene/Ball';
import CV from '../scene/CV';
import { getNScrollPages, getMainBallRadius } from '../scene/global';
import GradientBackground from '../scene/GradientBackground';
import Lines from '../scene/Lines';
import LoaderProgress from '../scene/LoaderProgress';
import Stars from '../scene/Stars';
import styles from '../styles/StatsPanel.module.sass';
import SurroundingText from '../Text/SurroundingText';
import { getDeviceDependent, initMobileScroll } from '../utils/hooks';


function Content() {
    const enableOrbitControl = getDeviceDependent(false, true); // disable vertical scroll on mobile
    const textRadius = getMainBallRadius() + 0.1;

    useEffect(() => {
        initMobileScroll();
    });

    return (
        <>
            <Ball />
            <CV />
            <Lines />
            <Stars />
            <SurroundingText
                text={"Weilue's Place"}
                radius={textRadius}
                rotationZ={0}
                initOffset={Math.PI}
            />
            <SurroundingText
                text={"Weilue's Place"}
                radius={textRadius}
                rotationZ={Math.PI / 4}
                initOffset={Math.PI / 2}
            />
            <SurroundingText
                text={"Weilue's Place"}
                radius={textRadius}
                rotationZ={-Math.PI / 4}
                initOffset={-Math.PI / 2}
            />
            <GradientBackground />
            <Lights />

            <OrbitControls
                enabled={true}
                enablePan={false}
                enableZoom={false}
                enableRotate={enableOrbitControl}
                autoRotate={!enableOrbitControl}
                autoRotateSpeed={1.0}
                // minPolarAngle={polarAngle}
                // maxPolarAngle={maxPolarAngle}
            />

            <EffectComposer multisampling={8}>
                {/* https://docs.pmnd.rs/react-postprocessing */}
                <SMAA />
            </EffectComposer>

            <Stats showPanel={0} className={styles.panel1} />
            <Stats showPanel={1} className={styles.panel2} />
            <Stats showPanel={2} className={styles.panel3} />
        </>
    );
}

function Lights() {
    const lightRef = useRef();

    const mapSize = getDeviceDependent(128, 512);

    return (
        <>
            <directionalLight
                ref={lightRef}
                position={[100, 100, 0]}
                color={0xffffff}
                intensity={5}
                castShadow
                shadow-mapSize-height={mapSize}
                shadow-mapSize-width={mapSize}
                shadow-camera-near={0.1}
                shadow-camera-far={20}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />

            <ambientLight color={0xffffff} intensity={0.3} />
        </>
    );
}


export default function Home() {
    const [pages, setPages] = useState(1)

    useEffect(() => {
        setPages(getNScrollPages())
    })

    return (
        <>
            <MyCanvas>
                <Content />
            </MyCanvas>
            <LoaderProgress />
            <div>
                <div style={{ height: `${pages * 100}vh`, width: `100vw` }} />
            </div>
        </>
    );
}

function MyCanvas(props) {
    const onCreated = useMemo(
        () => (state) => {
            state.setDpr(window.devicePixelRatio);
        },
        []
    );

    const { children, ...otherProps } = props;

    return (
        <Canvas
            style={{
                height: '100vh',
                width: '100vw',
                position: 'fixed',
                top: 0,
                left: 0,
                overflowY: 'scroll',
            }}
            // https://docs.pmnd.rs/react-three-fiber/api/canvas#render-props
            camera={{
                position: [0, 20, 20],
                fov: 50,
                near: 0.1,
                far: 100,
            }}
            gl={{
                antialias: true,
                outputEncoding: sRGBEncoding,
                toneMapping: ACESFilmicToneMapping,
                physicallyCorrectLights: true,
            }}
            raycaster={{}}
            shadowMap={true}
            shadows={true}
            onCreated={onCreated}
            {...otherProps}
        >
            {children}
        </Canvas>
    );
}
