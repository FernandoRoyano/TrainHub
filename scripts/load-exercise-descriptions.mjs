/**
 * Carga las descripciones (español) de los 20 ejercicios sin imagen en la BD.
 * Escribe description_es y description (fallback). Verifica name_es por id antes
 * de actualizar para no escribir en el ejercicio equivocado.
 * DRY-RUN por defecto; --apply para escribir.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const get = (k) => env.match(new RegExp(`^${k}=(.*)$`, "m"))?.[1]?.trim();
const supa = createClient(get("NEXT_PUBLIC_SUPABASE_URL"), get("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } });
const APPLY = process.argv.includes("--apply");

const ITEMS = [
  { id: "f3000001-0000-0000-0000-000000000001", name: "Prensa inclinada 45°", desc: "Sentada en la prensa inclinada a 45°, pies en la plataforma a la anchura de la cadera. Baja con control hasta unos 90° de rodilla y empuja sin bloquear de golpe la rodilla." },
  { id: "e6bf28d6-11f1-4b81-ac85-34228c93b617", name: "Prensa de pierna a una pierna", desc: "En la prensa, coloca un solo pie centrado en la plataforma. Baja controlando hasta ~90° de rodilla y empuja sin bloquear. Repite con la otra pierna." },
  { id: "f3000001-0000-0000-0000-000000000002", name: "Remo en máquina agarre neutro", desc: "Sentada en la máquina de remo con agarre neutro y el pecho apoyado en el soporte. Tira de las asas hacia el abdomen juntando los omóplatos y vuelve con control." },
  { id: "a0000001-0000-0000-0000-000000000027", name: "Remo invertido bajo la mesa", desc: "Tumbada bajo una mesa robusta, agárrala por el borde con los brazos extendidos y el cuerpo recto. Tira del pecho hacia la mesa juntando los omóplatos y baja con control." },
  { id: "f3000001-0000-0000-0000-000000000003", name: "Zancada inversa goblet con kettlebell", desc: "De pie sujetando una kettlebell en posición goblet (a la altura del pecho). Da un paso atrás bajando la rodilla trasera hacia el suelo y vuelve empujando con la pierna delantera." },
  { id: "f1000001-0000-0000-0000-000000000004", name: "Apertura lateral de cadera (clam shell)", desc: "Tumbada de lado, caderas y rodillas flexionadas con los pies juntos. Abre la rodilla de arriba como una almeja sin mover la pelvis, y baja con control." },
  { id: "f1000001-0000-0000-0000-000000000005", name: "Fire hydrant en cuadrupedia", desc: "En cuadrupedia, mantén la rodilla flexionada y eleva la pierna lateralmente (como un perro en una boca de riego) sin rotar el tronco. Baja con control." },
  { id: "f3000001-0000-0000-0000-000000000004", name: "Rotación externa hombro con banda", desc: "De pie con una banda anclada al costado, codo pegado al cuerpo y flexionado 90°. Rota el antebrazo hacia fuera manteniendo el codo fijo y vuelve controlando." },
  { id: "8a3f6324-5ba5-44d1-86c5-464ff22bc09e", name: "Respiración diafragmática", desc: "Tumbada boca arriba con las rodillas flexionadas, una mano en el pecho y otra en el abdomen. Inhala por la nariz hinchando la barriga (no el pecho) y exhala lento por la boca vaciando el abdomen." },
  { id: "a0000001-0000-0000-0000-000000000012", name: "Rotaciones de hombro con brazo extendido", desc: "De pie, brazos extendidos a los lados a la altura de los hombros. Realiza círculos amplios y controlados hacia delante y hacia atrás." },
  { id: "a0000001-0000-0000-0000-000000000030", name: "Estiramiento de cuádriceps de pie", desc: "De pie, sujeta el tobillo llevando el talón hacia el glúteo, rodillas juntas. Mantén el estiramiento sin arquear la lumbar." },
  { id: "f1000001-0000-0000-0000-000000000001", name: "Foam roller columna torácica", desc: "Tumbada con el foam roller bajo la zona alta de la espalda y las manos tras la nuca. Extiende suavemente la columna sobre el rodillo y desplázate poco a poco." },
  { id: "f1000001-0000-0000-0000-000000000002", name: "Rotación torácica en cuadrupedia", desc: "En cuadrupedia, lleva una mano a la nuca y rota el codo hacia el techo abriendo el pecho; vuelve llevando el codo bajo el cuerpo." },
  { id: "f1000001-0000-0000-0000-000000000003", name: "Rotación de hombro con banda (pendulum)", desc: "De pie con banda anclada, codo pegado al costado y flexionado 90°. Abre el antebrazo hacia fuera contra la banda de forma pendular y vuelve controlando." },
  { id: "f1000001-0000-0000-0000-000000000006", name: "Estiramiento pectoral en marco/polea", desc: "De pie junto a un marco o poste, antebrazo apoyado con el codo a la altura del hombro. Gira el cuerpo hacia el lado contrario hasta notar el estiramiento del pecho." },
  { id: "a0000001-0000-0000-0000-000000000001", name: "Marcha en el sitio con rodillas altas", desc: "De pie, marcha en el sitio elevando alternativamente las rodillas a la altura de la cadera, con los brazos acompañando el movimiento." },
  { id: "a0000001-0000-0000-0000-000000000022", name: "Sentada en fitball con rebotes suaves", desc: "Sentada sobre el fitball con la espalda recta y los pies apoyados. Realiza rebotes suaves manteniendo el control del core." },
  { id: "3b7fc9ae-83e8-408f-a847-ba14dd8daede", name: "Cinta Inclinada (Cardio)", desc: "Camina en cinta con inclinación alta (≈15%), velocidad 4-5 km/h y postura erguida, sin agarrarte a las barras. 20-30 minutos." },
  { id: "297460e4-71c8-4cf6-811a-ffe45aae6f30", name: "Caminata inclinada en cinta", desc: "Camina en cinta con inclinación, postura erguida y sin agarrarte; ritmo conversacional (Zona 2)." },
  { id: "0a474e47-9a37-4e67-a7da-46e5b7be5311", name: "Caminata o actividad ligera", desc: "Caminata a paso ligero o actividad suave de recuperación, a un ritmo cómodo y sostenible." },
];

let ok = 0, skip = 0;
for (const it of ITEMS) {
  const { data: row, error } = await supa.from("exercises").select("id, name, name_es, description_es").eq("id", it.id).maybeSingle();
  if (error || !row) { console.error(`✗ no encontrado: ${it.name} (${it.id})`); skip++; continue; }
  const current = row.name_es || row.name;
  if (current !== it.name) {
    console.error(`✗ NOMBRE NO COINCIDE para ${it.id}: BD="${current}" esperado="${it.name}" — SALTO por seguridad`);
    skip++; continue;
  }
  if (!APPLY) {
    console.log(`• ${it.name}  ${row.description_es ? "(ya tenía desc, se sobrescribe)" : ""}`);
    ok++; continue;
  }
  const { error: uErr } = await supa.from("exercises").update({ description_es: it.desc, description: it.desc }).eq("id", it.id);
  if (uErr) { console.error(`✗ update ${it.name}:`, uErr.message); skip++; continue; }
  console.log(`✓ ${it.name}`);
  ok++;
}
console.log(`\n${APPLY ? "Aplicado" : "DRY-RUN"}: ${ok} ok | ${skip} saltados`);
if (!APPLY) console.log("Ejecuta con --apply para escribir.");
process.exit(0);
