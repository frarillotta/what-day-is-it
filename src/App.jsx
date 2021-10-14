import * as THREE from 'three';
import styled, { keyframes } from 'styled-components';
import { Canvas, useFrame,  useThree } from "@react-three/fiber"
import { Suspense, useRef, useState } from 'react';
import { useGLTF, Environment } from '@react-three/drei'
import { EffectComposer, DepthOfField} from '@react-three/postprocessing';
import ItsWednesdayText from '../public/itswednesday.svg?component';
import MyDudesText from '../public/mydudes.svg?component';


function ItsWednesday({z, initialY}) {
	const ref  = useRef();
	const {viewport, camera} = useThree();
	const { nodes, materials } = useGLTF('/wednesday.glb')
	const {width, height} = viewport.getCurrentViewport(camera, [0, 0, z])

	const [isBigger, setIsBigger] = useState(false);

	if (isBigger) {
		setTimeout(() => {
			setIsBigger(false);
		}, 2000)
	}

	const [data] = useState({
		x: THREE.MathUtils.randFloatSpread(2),
		y: THREE.MathUtils.randFloatSpread(viewport.height) + initialY,
		rX: Math.random() * Math.PI,
		rY: Math.random() * Math.PI,
		rZ: Math.random() * Math.PI
	});
	
	useFrame((state) => {
		ref.current.rotation.set((data.rX += 0.012), (data.rY += 0.014), (data.rZ += 0.001));
		ref.current.position.set(data.x * width, (data.y += 0.03), z);
		ref.current.scale.set(
			THREE.MathUtils.lerp(ref.current.scale.x, (isBigger ? 2 : 1), .3), 
			THREE.MathUtils.lerp(ref.current.scale.y, (isBigger ? 2 : 1), .3),
			THREE.MathUtils.lerp(ref.current.scale.x, (isBigger ? 2 : 1), .3),
		);
		if (data.y > height / 1.5) {
			data.x = THREE.MathUtils.randFloatSpread(2);
			data.y = -height / 1.5;
		}
	})
	return <mesh
		onClick={() => setIsBigger(!isBigger) }
		ref={ref} 
		geometry={nodes.Group15803_0.geometry} 
		material={materials['Material.004']} 
		position={[0.05, 0.68, 0.57]} 
	/>
}

export default function App({count = 100, depth = 80}) {

	
	return <>
		<CanvasWrapper>
			<Canvas gl={{alpha: false}} camera={{ near: 0.01, far: 110, fov: 30 }}>
				<color attach="background" args={["#ffbf40"]}/>
				<ambientLight intensity={0.2}/>
				<spotLight position={[10, 10, 10]} intensity={1}/>
				<Suspense fallback={null}>
					<Environment preset="sunset"/>
					{Array.from({length: count}).map((_, i) => {
						return <ItsWednesday key={i} z={-(i / count) * depth - 30} initialY={THREE.MathUtils.randFloatSpread(i)}/>
					})}
					<EffectComposer>
						<DepthOfField target={[0, 0, depth / 2]} focalLength={0.7} bokehScale={10} height={700}/>
					</EffectComposer>
				</Suspense>
			</Canvas>
		</CanvasWrapper>
		<TextContainer>
			<ItsWednesdayTextWrapper>
				<ItsWednesdayText/>
			</ItsWednesdayTextWrapper>
			<MyDudesTextWrapper>
				<MyDudesText/>
			</MyDudesTextWrapper>
		</TextContainer>
	</>
}

const TextContainer = styled.div`
    position: absolute;
    top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	pointer-events: none;
    display: flex;
    flex-direction: column;
    align-items: center;
	justify-content: center;
`

const CanvasWrapper = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
`

const fade = keyframes`
	from { opacity: 0; }
	to { opacity: 1; }
`

const ItsWednesdayTextWrapper = styled.p`
	opacity: 0;
	height: 100px;
	width: calc(30vw + 100px);
	animation: ${fade} 2s normal forwards ease-in-out;
	animation-delay: 4s;
`;

const MyDudesTextWrapper = styled(ItsWednesdayTextWrapper)`
  	animation-delay: 6s;
`;