// import { useRef, useState, useEffect } from 'react';
// import {
//   View,
//   Image,
//   Animated,
//   PanResponder,
//   Dimensions,
//   StyleSheet,
//   Pressable,
// } from 'react-native';

// // Inline useSpring hook - completely self-contained
// function useSpring(initialValue, settings = { stiffness: 0.066, damping: 0.25 }) {
//   const [value, setValue] = useState(initialValue);
//   const [targetValue, setTargetValue] = useState(initialValue);
//   const [velocity, setVelocity] = useState(
//     typeof initialValue === 'object' 
//       ? Object.keys(initialValue).reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
//       : 0
//   );
//   const settingsRef = useRef(settings);
//   const animationFrameRef = useRef(null);

//   useEffect(() => {
//     settingsRef.current = settings;
//   }, [settings]);

//   useEffect(() => {
//     const animate = () => {
//       const { stiffness, damping } = settingsRef.current;
      
//       if (typeof value === 'object') {
//         let hasChanged = false;
//         const newValue = {};
//         const newVelocity = {};
        
//         Object.keys(value).forEach(key => {
//           const diff = targetValue[key] - value[key];
//           if (Math.abs(diff) > 0.001 || Math.abs(velocity[key]) > 0.001) {
//             hasChanged = true;
//             newVelocity[key] = velocity[key] + diff * stiffness;
//             newVelocity[key] *= 1 - damping;
//             newValue[key] = value[key] + newVelocity[key];
//           } else {
//             newValue[key] = targetValue[key];
//             newVelocity[key] = 0;
//           }
//         });
        
//         if (hasChanged) {
//           setValue(newValue);
//           setVelocity(newVelocity);
//           animationFrameRef.current = requestAnimationFrame(animate);
//         }
//       } else {
//         const diff = targetValue - value;
//         if (Math.abs(diff) > 0.001 || Math.abs(velocity) > 0.001) {
//           const newVelocity = velocity + diff * stiffness;
//           const dampedVelocity = newVelocity * (1 - damping);
//           setValue(value + dampedVelocity);
//           setVelocity(dampedVelocity);
//           animationFrameRef.current = requestAnimationFrame(animate);
//         }
//       }
//     };

//     if (animationFrameRef.current) {
//       cancelAnimationFrame(animationFrameRef.current);
//     }
//     animationFrameRef.current = requestAnimationFrame(animate);

//     return () => {
//       if (animationFrameRef.current) {
//         cancelAnimationFrame(animationFrameRef.current);
//       }
//     };
//   }, [value, targetValue, velocity]);

//   const set = (newTargetValue, options = {}) => {
//     if (options.hard) {
//       setValue(newTargetValue);
//       setTargetValue(newTargetValue);
//       setVelocity(
//         typeof newTargetValue === 'object'
//           ? Object.keys(newTargetValue).reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
//           : 0
//       );
//     } else {
//       setTargetValue(newTargetValue);
//     }
//   };

//   return [value, set, settingsRef];
// }

// const imageUrl = 'https://images.unsplash.com/photo-1542779283-429940ce8336?w=500&h=700&fit=crop';
// const backImageUrl = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';

// export default function CustomCard({ img = imageUrl, backimg = backImageUrl }) {
//   const cardRef = useRef(null);
//   const [interact, setInteract] = useState(false);
//   const [active, setActive] = useState(false);
//   const [cardLayout, setCardLayout] = useState(null);
//   const fadeAnim = useRef(new Animated.Value(0)).current;
  
//   // Use backimg if provided, otherwise default to img
//   const backImage = backimg || img;
  
//   const [springRotate, setSpringRotate] = useSpring({ x: 0, y: 0 }, { stiffness: 0.066, damping: 0.25 });
//   const [springGlare, setSpringGlare] = useSpring({ x: 50, y: 50, o: 0 }, { stiffness: 0.033, damping: 0.11 });
//   const [springBackground, setSpringBackground] = useSpring({ x: 50, y: 50 }, { stiffness: 0.033, damping: 0.11 });
//   const [springScale, setSpringScale] = useSpring(1, { stiffness: 0.033, damping: 0.45 });
//   const [springTranslate, setSpringTranslate] = useSpring({ x: 0, y: 0 }, { stiffness: 0.033, damping: 0.45 });
//   const [springRotateDelta, setSpringRotateDelta] = useSpring({ x: 0, y: 0 }, { stiffness: 0.033, damping: 0.45 });

//   const round = (num, fix = 3) => parseFloat(num.toFixed(fix));

//   // Fade in backdrop when active
//   useEffect(() => {
//     if (active) {
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     } else {
//       Animated.timing(fadeAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     }
//   }, [active, fadeAnim]);

//   const handleTouchMove = (x, y) => {
//     if (!interact || !cardLayout) return;

//     const absolute = {
//       x: x - cardLayout.x,
//       y: y - cardLayout.y,
//     };
//     const percent = {
//       x: round((100 / cardLayout.width) * absolute.x),
//       y: round((100 / cardLayout.height) * absolute.y),
//     };
//     const center = {
//       x: percent.x - 50,
//       y: percent.y - 50,
//     };

//     setSpringBackground({
//       x: percent.x,
//       y: percent.y,
//     });
    
//     setSpringRotate({
//       x: round(-(center.x / 3.5)),
//       y: round(center.y / 2),
//     });
    
//     setSpringGlare({
//       x: percent.x,
//       y: percent.y,
//       o: 1,
//     });
//   };

//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: () => true,
//       onPanResponderGrant: (evt) => {
//         setInteract(true);
//         const { pageX, pageY } = evt.nativeEvent;
//         handleTouchMove(pageX, pageY);
//       },
//       onPanResponderMove: (evt) => {
//         const { pageX, pageY } = evt.nativeEvent;
//         handleTouchMove(pageX, pageY);
//       },
//       onPanResponderRelease: () => {
//         setInteract(false);
//         if (!active) {
//           setSpringRotate({ x: 0, y: 0 });
//           setSpringGlare({ x: 50, y: 50, o: 0 });
//           setSpringBackground({ x: 50, y: 50 });
//         }
//       },
//     })
//   ).current;

//   const handlePress = () => {
//     if (!active && cardLayout) {
//       // Activate: enlarge and center the card with flip
//       setActive(true);
//       const { width, height } = Dimensions.get('window');
      
//       const deltaX = round(width / 2 - cardLayout.x - cardLayout.width / 2);
//       const deltaY = round(height / 2 - cardLayout.y - cardLayout.height / 2);
      
//       setSpringTranslate({ x: deltaX, y: deltaY });
      
//       const scaleW = (width / cardLayout.width) * 0.9;
//       const scaleH = (height / cardLayout.height) * 0.9;
//       const scaleF = 1.75;
//       setSpringScale(Math.min(scaleW, scaleH, scaleF));
      
//       // Always flip 360 degrees on activation
//       setSpringRotateDelta({ x: 360, y: 0 });
//     } else {
//       // Deactivate: zoom out without flipping (4x faster)
//       setActive(false);
      
//       // Instantly reset rotation delta to prevent flip animation
//       setSpringRotateDelta({ x: 0, y: 0 }, { hard: true });
      
//       // Use 8x faster spring settings for zoom out
//       setSpringScale(1, { stiffness: 0.132, damping: 0.45 });
//       setSpringTranslate({ x: 0, y: 0 }, { stiffness: 0.132, damping: 0.45 });
      
//       setSpringRotate({ x: 0, y: 0 });
//       setSpringGlare({ x: 50, y: 50, o: 0 });
//       setSpringBackground({ x: 50, y: 50 });
//     }
//   };

//   const handleLayout = (event) => {
//     cardRef.current?.measure((x, y, width, height, pageX, pageY) => {
//       setCardLayout({ x: pageX, y: pageY, width, height });
//     });
//   };

//   // Calculate rotation transform
//   const rotateYDeg = `${springRotate.x + springRotateDelta.x}deg`;
//   const rotateXDeg = `${springRotate.y + springRotateDelta.y}deg`;

//   // Calculate glare gradient position
//   const glareX = springGlare.x;
//   const glareY = springGlare.y;

//   return (
//     <>
//       {/* Backdrop - click to close */}
//       {active && (
//         <Animated.View
//           style={[
//             styles.backdrop,
//             {
//               opacity: fadeAnim,
//             },
//           ]}
//         >
//           <Pressable
//             style={styles.backdropPressable}
//             onPress={handlePress}
//           />
//         </Animated.View>
//       )}
      
//       <View
//         ref={cardRef}
//         onLayout={handleLayout}
//         style={[
//           styles.cardContainer,
//           {
//             zIndex: active ? 120 : (interact ? 120 : 1),
//           },
//         ]}
//         {...panResponder.panHandlers}
//       >
//         <Pressable onPress={handlePress} style={styles.pressableContainer}>
//           <View
//             style={[
//               styles.transformContainer,
//               {
//                 transform: [
//                   { translateX: springTranslate.x },
//                   { translateY: springTranslate.y },
//                   { scale: springScale },
//                 ],
//               },
//             ]}
//           >
//             <View
//               style={[
//                 styles.rotateContainer,
//                 {
//                   transform: [
//                     { perspective: 600 },
//                     { rotateY: rotateYDeg },
//                     { rotateX: rotateXDeg },
//                   ],
//                   shadowColor: '#000',
//                   shadowOffset: { width: 0, height: 10 },
//                   shadowOpacity: active || interact ? 0.8 : 0.4,
//                   shadowRadius: active || interact ? 20 : 10,
//                   elevation: active || interact ? 20 : 5,
//                 },
//               ]}
//             >
//               <View style={styles.cardInner}>
//                 {/* Back of card - same image, flipped */}
//                 <View
//                   style={[
//                     styles.cardFace,
//                     styles.cardBack,
//                     {
//                       transform: [{ rotateY: '180deg' }],
//                     },
//                   ]}
//                 >
//                   <Image
//                     source={{ uri: backImage }}
//                     style={styles.cardImage}
//                     resizeMode="cover"
//                   />
//                   <View style={styles.backOverlay} />
//                 </View>
                
//                 {/* Front of card with effects */}
//                 <View
//                   style={[
//                     styles.cardFace,
//                     styles.cardFront,
//                   ]}
//                 >
//                   <Image
//                     source={{ uri: img }}
//                     style={styles.cardImage}
//                     resizeMode="cover"
//                   />
                  
//                   {/* Shine effect */}
//                   <View
//                     style={[
//                       styles.shineEffect,
//                       {
//                         opacity: springGlare.o * 0.5, // Reduced for mobile
//                       },
//                     ]}
//                   />
                  
//                   {/* Glare spotlight */}
//                   <View
//                     style={[
//                       styles.glareEffect,
//                       {
//                         opacity: springGlare.o * 0.7, // Reduced for mobile
//                       },
//                     ]}
//                   >
//                     {/* Radial gradient effect simulated with overlapping views */}
//                     <View
//                       style={[
//                         styles.glareGradient,
//                         {
//                           left: `${glareX}%`,
//                           top: `${glareY}%`,
//                         },
//                       ]}
//                     >
//                       <View style={[styles.glareCircle, styles.glareCircle1]} />
//                       <View style={[styles.glareCircle, styles.glareCircle2]} />
//                       <View style={[styles.glareCircle, styles.glareCircle3]} />
//                     </View>
//                   </View>
//                 </View>
//               </View>
//             </View>
//           </View>
//         </Pressable>
//       </View>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   backdrop: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     zIndex: 100,
//   },
//   backdropPressable: {
//     width: '100%',
//     height: '100%',
//   },
//   cardContainer: {
//     width: '100%',
//     aspectRatio: 0.718,
//     position: 'relative',
//   },
//   pressableContainer: {
//     width: '100%',
//     height: '100%',
//   },
//   transformContainer: {
//     width: '100%',
//     height: '100%',
//     position: 'relative',
//   },
//   rotateContainer: {
//     width: '100%',
//     height: '100%',
//     aspectRatio: 0.718,
//     borderRadius: 15,
//     overflow: 'hidden',
//   },
//   cardInner: {
//     width: '100%',
//     height: '100%',
//     position: 'relative',
//   },
//   cardFace: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//     borderRadius: 15,
//     overflow: 'hidden',
//     backfaceVisibility: 'hidden',
//   },
//   cardBack: {
//     backgroundColor: '#1a1a1a',
//   },
//   cardFront: {
//     backgroundColor: '#fff',
//   },
//   cardImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 15,
//   },
//   backOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.85)',
//   },
//   shineEffect: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//   },
//   glareEffect: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     overflow: 'hidden',
//   },
//   glareGradient: {
//     position: 'absolute',
//     width: 200,
//     height: 200,
//     marginLeft: -100,
//     marginTop: -100,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   glareCircle: {
//     position: 'absolute',
//     borderRadius: 9999,
//     backgroundColor: 'rgba(255, 255, 255, 0.3)',
//   },
//   glareCircle1: {
//     width: 100,
//     height: 100,
//   },
//   glareCircle2: {
//     width: 150,
//     height: 150,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//   },
//   glareCircle3: {
//     width: 200,
//     height: 200,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//   },
// });

