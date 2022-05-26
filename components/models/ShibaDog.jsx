/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: zixisun02 (https://sketchfab.com/zixisun51)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/shiba-faef9fe5ace445e7b2989d1c1ece361c
title: Shiba
*/

import React, { useRef, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { Vector3 } from 'three'
import { Object3D } from 'three'
import { interpolateAs } from 'next/dist/shared/lib/router/router'
import next from 'next'
import { useHover } from '../utils/hooks'
import { setCursorPointerOnHover } from '../utils/utils'
import { easings, useSpring } from '@react-spring/three'
import { animated } from '@react-spring/three'

const modelDir = '/models/shiba2/scene-transformed.glb'

export default function ShibaDog({ ...props }) {
  const group = useRef()
  const { nodes, materials } = useGLTF(modelDir)

  const [hover, overHander, outHandler] = useHover()
  setCursorPointerOnHover(hover)

  const scales = Array.from({ length: 4 }, (_, i) => i + 2)
  const [currIndex, setIndex] = useState(0)
  const nextScale = () => {
    setIndex(currIndex + 1)
    return scales[currIndex % scales.length]
  }
  // const [currScale, setScale] = useState(scales[currIndex])
  // const nextScale = () => {
  //   let nextIndex = currIndex + 1
  //   const dir = nextIndex / scales.length
  //   let index = nextIndex % scales.length
  //   if (Math.floor(dir) % 2 == 1) {
  //     index = scales.length - index - 1
  //   }
  //   if (index == 0 || index == scales.length - 1) {
  //     nextIndex += 1  // skip repeat
  //   }
  //   setScale(scales[index])
  //   setIndex(nextIndex)
  // }

  const [oddClick, setOddClick] = useState(false)

  const { scale } = useSpring({
    scale: oddClick ? 3 : 2,
    config: {
      duration: 500,
      easing: easings.easeOutElastic
    }
  })

  return (
    <animated.group ref={group} {...props}
      dispose={null}
      scale={scale}
      onClick={() => setOddClick(!oddClick)}
      onPointerOver={overHander}
      onPointerOut={outHandler}
      rotation={[0, -Math.PI / 8, 0]}
      position={[-5, 0, -2]}
      
    >
      <animated.group rotation={[-Math.PI / 2, 0, 0]} position={[0, 1, 0]}>
        <animated.group rotation={[Math.PI / 2, 0, 0]}>
          <animated.group rotation={[-Math.PI / 2, 0, 0]}>
            <animated.mesh castShadow receiveShadow geometry={nodes.Group18985_default_0.geometry} material={materials['default']} />
          </animated.group>
          <animated.group rotation={[-Math.PI / 2, 0, 0]}>
            <animated.mesh castShadow receiveShadow geometry={nodes.Box002_default_0.geometry} material={materials['default']} />
          </animated.group>
          <animated.group rotation={[-Math.PI / 2, 0, 0]}>
            <animated.mesh castShadow receiveShadow geometry={nodes.Object001_default_0.geometry} material={materials['default']} />
          </animated.group>
        </animated.group>
      </animated.group>
    </animated.group>
  )
}

useGLTF.preload(modelDir)