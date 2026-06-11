# Prompts de imagen — Ejercicios sin foto

20 ejercicios del catálogo (todos *custom*) sin ninguna referencia visual. Para cada uno:
**descripción en español** (apta para el cliente) + **2 prompts** (frame inicial `0.jpg` y final `1.jpg`)
para la animación de la app.

## Cómo usarlo

1. El sistema anima alternando `0.jpg` (inicio) y `1.jpg` (fin). Genera **las dos imágenes** con el
   **mismo personaje, ángulo y encuadre** para que la animación sea coherente.
2. **Antepón el ESTILO BASE** a cada prompt de frame.
3. Sube las imágenes a `exercises/<Nombre>/0.jpg` y `1.jpg` (Storage) y rellena `thumbnail_url` con la `0.jpg`
   (la app deriva la `1.jpg` automáticamente). Puedo dejarte un script de carga cuando las tengas.

## ESTILO BASE (anteponer a todos los prompts)

```
Clean 3D anatomical fitness illustration of a single athletic person performing an exercise,
soft even studio lighting, plain light-gray seamless background, full body in frame, fitted
neutral sportswear (tank top and shorts), subtly defined muscles, realistic proportions,
3/4 side camera angle, centered composition, no text, no watermark, no logos. IMPORTANT:
keep the same character, outfit, camera angle and framing across both frames.
```

---

## Fuerza

### 1. Prensa inclinada 45°
**Descripción:** Sentada en la prensa inclinada a 45°, pies en la plataforma a la anchura de la cadera. Baja con control hasta unos 90° de rodilla y empuja sin bloquear de golpe la rodilla.
- **Frame 0 (inicio):** `...woman seated on a 45-degree incline leg press machine, both feet flat on the platform hip-width apart, legs almost fully extended at the top position, back and hips supported on the seat.`
- **Frame 1 (fin):** `...same woman on the 45-degree leg press, knees bent to about 90 degrees, platform lowered toward her, thighs close to torso, controlled bottom position.`

### 2. Prensa de pierna a una pierna
**Descripción:** En la prensa, coloca un solo pie centrado en la plataforma. Baja controlando hasta ~90° de rodilla y empuja sin bloquear. Repite con la otra pierna.
- **Frame 0 (inicio):** `...woman on a leg press machine using a single leg centered on the platform, that leg fully extended at the top, the other leg resting off the platform.`
- **Frame 1 (fin):** `...same woman, single working leg bent to about 90 degrees at the bottom of the press, the other leg off the platform, controlled.`

### 3. Remo en máquina agarre neutro
**Descripción:** Sentada en la máquina de remo con agarre neutro y el pecho apoyado en el soporte. Tira de las asas hacia el abdomen juntando los omóplatos y vuelve con control.
- **Frame 0 (inicio):** `...woman seated at a chest-supported row machine with a neutral (palms-facing) grip, arms fully extended forward holding the handles, shoulder blades protracted, start position.`
- **Frame 1 (fin):** `...same woman pulling the neutral-grip handles toward her abdomen, elbows driven back close to the torso, shoulder blades squeezed together, chest against the pad.`

### 4. Remo invertido bajo la mesa
**Descripción:** Tumbada bajo una mesa robusta, agárrala por el borde con los brazos extendidos y el cuerpo recto. Tira del pecho hacia la mesa juntando los omóplatos y baja con control.
- **Frame 0 (inicio):** `...woman lying on her back under a sturdy table, gripping the table edge with both hands, arms fully extended, body straight from head to heels, hanging start position.`
- **Frame 1 (fin):** `...same woman pulling her chest up toward the table edge, elbows bent and tucked, shoulder blades squeezed, body kept in a straight line.`

### 5. Zancada inversa goblet con kettlebell
**Descripción:** De pie sujetando una kettlebell en posición goblet (a la altura del pecho). Da un paso atrás bajando la rodilla trasera hacia el suelo y vuelve empujando con la pierna delantera.
- **Frame 0 (inicio):** `...woman standing tall holding a kettlebell at chest height in a goblet position with both hands, feet together, upright posture, start.`
- **Frame 1 (fin):** `...same woman in a reverse lunge, one leg stepped back with the rear knee lowered near the floor, both knees bent about 90 degrees, kettlebell still held at the chest.`

### 6. Apertura lateral de cadera (clam shell)
**Descripción:** Tumbada de lado, caderas y rodillas flexionadas con los pies juntos. Abre la rodilla de arriba como una almeja sin mover la pelvis, y baja con control.
- **Frame 0 (inicio):** `...woman lying on her side on a mat, hips and knees bent about 45 degrees, knees stacked together, feet together, top knee closed down, start.`
- **Frame 1 (fin):** `...same side-lying woman opening the top knee upward like a clam shell, feet kept together, pelvis stable and not rotating.`

### 7. Fire hydrant en cuadrupedia
**Descripción:** En cuadrupedia, mantén la rodilla flexionada y eleva la pierna lateralmente (como un perro en una boca de riego) sin rotar el tronco. Baja con control.
- **Frame 0 (inicio):** `...woman on all fours (quadruped) on a mat, back flat and neutral, one knee bent at 90 degrees resting down, start.`
- **Frame 1 (fin):** `...same quadruped woman lifting the bent leg out to the side up to hip height, knee kept bent at 90 degrees, torso stable and square.`

### 8. Rotación externa hombro con banda
**Descripción:** De pie con una banda anclada al costado, codo pegado al cuerpo y flexionado 90°. Rota el antebrazo hacia fuera manteniendo el codo fijo y vuelve controlando.
- **Frame 0 (inicio):** `...woman standing, holding an elastic band, elbow pinned to her side bent at 90 degrees, forearm across the front of her belly, start position with band slack.`
- **Frame 1 (fin):** `...same woman rotating the forearm outward away from the body against band tension, elbow still pinned to the side, wrist neutral.`

---

## Movilidad / Flexibilidad

### 9. Respiración diafragmática
**Descripción:** Tumbada boca arriba con las rodillas flexionadas, una mano en el pecho y otra en el abdomen. Inhala por la nariz hinchando la barriga (no el pecho) y exhala lento por la boca vaciando el abdomen.
- **Frame 0 (inhalación):** `...woman lying supine on a mat, knees bent, one hand on her chest and one on her abdomen, belly visibly expanded on the inhale, relaxed face.`
- **Frame 1 (exhalación):** `...same supine woman with the abdomen drawn flat on a slow exhale, chest still, hands in the same position.`

### 10. Rotaciones de hombro con brazo extendido
**Descripción:** De pie, brazos extendidos a los lados a la altura de los hombros. Realiza círculos amplios y controlados hacia delante y hacia atrás.
- **Frame 0 (inicio):** `...woman standing, arms extended straight out to the sides at shoulder height, hands beginning a forward circle (slightly raised), motion-arrow hint.`
- **Frame 1 (fin):** `...same woman with the extended arms rotated lower/back in the circle, showing the arm-circle range of motion at the shoulders.`

### 11. Estiramiento de cuádriceps de pie
**Descripción:** De pie, sujeta el tobillo llevando el talón hacia el glúteo, rodillas juntas. Mantén el estiramiento sin arquear la lumbar.
- **Frame 0 (inicio):** `...woman standing tall on one leg, reaching one hand back to grab the ankle of the other leg, just starting the stretch.`
- **Frame 1 (fin):** `...same woman holding her ankle with the heel pulled to the glute, knees together, torso upright, balanced quad stretch.`

### 12. Foam roller columna torácica
**Descripción:** Tumbada con el foam roller bajo la zona alta de la espalda y las manos tras la nuca. Extiende suavemente la columna sobre el rodillo y desplázate poco a poco.
- **Frame 0 (inicio):** `...woman lying supine with a foam roller placed across her upper back, hips lifted slightly, hands supporting the back of her head, neutral start.`
- **Frame 1 (fin):** `...same woman gently extending her upper back over the foam roller, mid-back arched over the roller, hips kept up, controlled thoracic extension.`

### 13. Rotación torácica en cuadrupedia
**Descripción:** En cuadrupedia, lleva una mano a la nuca y rota el codo hacia el techo abriendo el pecho; vuelve llevando el codo bajo el cuerpo.
- **Frame 0 (inicio):** `...woman on all fours with one hand behind her head, that elbow pointing down and tucked under the torso, spine neutral, start (closed).`
- **Frame 1 (fin):** `...same quadruped woman rotating the torso open, elbow pointing up toward the ceiling, chest opened to the side.`

### 14. Rotación de hombro con banda (pendulum)
**Descripción:** De pie con banda anclada, codo pegado al costado y flexionado 90°. Abre el antebrazo hacia fuera contra la banda de forma pendular y vuelve controlando.
- **Frame 0 (inicio):** `...woman standing holding an elastic band, elbow at her side bent 90 degrees, forearm swung inward across the body, start.`
- **Frame 1 (fin):** `...same woman swinging the forearm outward in a controlled pendulum against the band, elbow fixed at the side.`

### 15. Estiramiento pectoral en marco/polea
**Descripción:** De pie junto a un marco o poste, antebrazo apoyado con el codo a la altura del hombro. Gira el cuerpo hacia el lado contrario hasta notar el estiramiento del pecho.
- **Frame 0 (inicio):** `...woman standing beside a door frame, one forearm resting against the frame with the elbow at shoulder height, body square, start.`
- **Frame 1 (fin):** `...same woman rotating her torso away from the planted arm, opening the chest into a pectoral stretch.`

---

## Cardio

### 16. Marcha en el sitio con rodillas altas
**Descripción:** De pie, marcha en el sitio elevando alternativamente las rodillas a la altura de la cadera, con los brazos acompañando el movimiento.
- **Frame 0:** `...woman marching in place, left knee raised to hip height, opposite (right) arm forward, upright energetic posture.`
- **Frame 1:** `...same woman on the other side, right knee raised to hip height, left arm forward, mid-march.`

### 17. Sentada en fitball con rebotes suaves
**Descripción:** Sentada sobre el fitball con la espalda recta y los pies apoyados. Realiza rebotes suaves manteniendo el control del core.
- **Frame 0:** `...woman seated upright on a stability/fitball, feet flat on the floor, spine tall, top of a gentle bounce.`
- **Frame 1:** `...same woman slightly lower in the bounce, ball lightly compressed, core engaged, posture controlled.`

### 18. Cinta Inclinada (Cardio)
**Descripción:** Camina en cinta con inclinación alta (≈15%), velocidad 4-5 km/h y postura erguida, sin agarrarte a las barras. 20-30 minutos.
- **Frame 0:** `...woman walking on a treadmill set to a steep incline, left foot forward in mid-stride, upright posture, hands not gripping the rails.`
- **Frame 1:** `...same woman on the inclined treadmill, right foot forward in the opposite stride, posture tall.`

### 19. Caminata inclinada en cinta
**Descripción:** Camina en cinta con inclinación, postura erguida y sin agarrarte; ritmo conversacional (Zona 2).
- **Frame 0:** `...woman walking on an inclined treadmill at an easy conversational pace, one foot forward mid-stride, relaxed upright posture.`
- **Frame 1:** `...same woman, opposite stride on the inclined treadmill, steady relaxed walk.`

### 20. Caminata o actividad ligera
**Descripción:** Caminata a paso ligero o actividad suave de recuperación, a un ritmo cómodo y sostenible.
- **Frame 0:** `...woman walking at a light, comfortable pace on a plain background, one foot forward mid-stride, relaxed arms and posture.`
- **Frame 1:** `...same woman, opposite stride, calm steady light walk.`
