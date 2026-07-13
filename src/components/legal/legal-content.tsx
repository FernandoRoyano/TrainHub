import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";

// ⚠️ REVISIÓN LEGAL PENDIENTE: este contenido es una estructura completa
// conforme a RGPD/LSSI pensada para ser revisada por un profesional antes
// del lanzamiento comercial. Sustituir los campos de OWNER por los datos
// reales del titular.
const OWNER = {
  name: "[Nombre y apellidos o razón social del titular]",
  nif: "[NIF/CIF]",
  address: "[Dirección postal completa]",
  email: "trainhubapp86@gmail.com",
};

const LAST_UPDATED = { es: "13 de julio de 2026", en: "July 13, 2026" };

type Locale = "es" | "en";
export type LegalDoc = "privacy" | "terms" | "legal";

interface Section {
  h: string;
  p: string[];
  list?: string[];
}

interface DocContent {
  title: string;
  intro: string;
  sections: Section[];
}

const content: Record<LegalDoc, Record<Locale, DocContent>> = {
  // ═══════════════ POLÍTICA DE PRIVACIDAD ═══════════════
  privacy: {
    es: {
      title: "Política de privacidad",
      intro:
        "En TrainHub nos tomamos muy en serio la protección de tus datos personales. Esta política explica qué datos tratamos, con qué finalidad, con qué base legal y qué derechos te asisten, conforme al Reglamento (UE) 2016/679 (RGPD) y la LO 3/2018 (LOPDGDD).",
      sections: [
        {
          h: "1. Responsable del tratamiento",
          p: [
            `Titular: ${OWNER.name}, NIF ${OWNER.nif}, con domicilio en ${OWNER.address}. Contacto para protección de datos: ${OWNER.email}.`,
            "Respecto a los datos que los entrenadores introducen sobre sus clientes (rutinas, medidas, notas de sesión), el entrenador actúa como responsable del tratamiento y TrainHub como encargado del tratamiento, en los términos del art. 28 RGPD.",
          ],
        },
        {
          h: "2. Datos que tratamos",
          p: ["Según el uso que hagas de la plataforma, tratamos las siguientes categorías de datos:"],
          list: [
            "Datos de cuenta: nombre, email, contraseña (cifrada), rol e idioma.",
            "Datos de uso del servicio: rutinas, planes nutricionales, mensajes entre entrenador y cliente, registros de entrenamiento y notificaciones.",
            "Datos de salud (categoría especial, art. 9 RGPD): medidas corporales, peso, lesiones o restricciones físicas, registros de ayuno y, si activas el módulo correspondiente, datos de ciclo menstrual. Estos datos solo se tratan con tu consentimiento explícito y puedes retirarlo en cualquier momento.",
            "Datos de facturación: gestionados por Stripe; TrainHub no almacena números de tarjeta.",
            "Datos técnicos: cookies de sesión estrictamente necesarias para la autenticación.",
          ],
        },
        {
          h: "3. Finalidades y bases legales",
          p: [],
          list: [
            "Prestación del servicio (creación de cuenta, rutinas, mensajería): ejecución del contrato, art. 6.1.b RGPD.",
            "Tratamiento de datos de salud (medidas, lesiones, ciclo menstrual): consentimiento explícito, art. 9.2.a RGPD, que se solicita de forma separada al activar cada funcionalidad.",
            "Gestión de pagos y facturación: ejecución del contrato y obligación legal, arts. 6.1.b y 6.1.c RGPD.",
            "Comunicaciones sobre el servicio (invitaciones, avisos de rutina, recuperación de contraseña): ejecución del contrato, art. 6.1.b RGPD.",
            "Seguridad de la plataforma (prevención de abuso, verificación anti-bots): interés legítimo, art. 6.1.f RGPD.",
          ],
        },
        {
          h: "4. Destinatarios y encargados",
          p: [
            "No vendemos tus datos ni los cedemos a terceros con fines comerciales. Para prestar el servicio usamos los siguientes proveedores (encargados del tratamiento), con los que existen contratos conforme al art. 28 RGPD:",
          ],
          list: [
            "Supabase Inc. (base de datos y autenticación, alojamiento en la UE/EE. UU. con Cláusulas Contractuales Tipo).",
            "Vercel Inc. (alojamiento de la aplicación web).",
            "Stripe Payments Europe Ltd. (procesamiento de pagos).",
            "Google LLC (envío de emails transaccionales).",
            "Cloudflare Inc. (verificación anti-bots en el registro).",
          ],
        },
        {
          h: "5. Conservación",
          p: [
            "Conservamos tus datos mientras mantengas tu cuenta activa. Al eliminar tu cuenta, los datos personales se suprimen o anonimizan en un plazo máximo de 30 días, salvo los datos de facturación, que se conservan durante los plazos legales fiscales (hasta 6 años).",
          ],
        },
        {
          h: "6. Tus derechos",
          p: [
            `Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad escribiendo a ${OWNER.email}. También puedes retirar el consentimiento para el tratamiento de datos de salud en cualquier momento desde los ajustes de la app o por email, sin que ello afecte al resto del servicio.`,
            "Si consideras que el tratamiento no se ajusta a la normativa, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).",
          ],
        },
        {
          h: "7. Seguridad",
          p: [
            "Aplicamos medidas técnicas y organizativas apropiadas: cifrado en tránsito (TLS) y en reposo, control de acceso por filas en base de datos (cada usuario solo accede a sus propios datos), contraseñas cifradas y copias de seguridad.",
          ],
        },
        {
          h: "8. Menores de edad",
          p: [
            "TrainHub está dirigido a mayores de 18 años. No registramos conscientemente cuentas de menores. Si detectas una cuenta de un menor, contáctanos para eliminarla.",
          ],
        },
        {
          h: "9. Cambios en esta política",
          p: [
            "Si modificamos esta política te lo notificaremos por email o mediante un aviso en la aplicación con antelación razonable.",
          ],
        },
      ],
    },
    en: {
      title: "Privacy policy",
      intro:
        "At TrainHub we take the protection of your personal data seriously. This policy explains what data we process, for what purpose, on what legal basis and what rights you have, in accordance with Regulation (EU) 2016/679 (GDPR).",
      sections: [
        {
          h: "1. Data controller",
          p: [
            `Owner: ${OWNER.name}, Tax ID ${OWNER.nif}, address: ${OWNER.address}. Data protection contact: ${OWNER.email}.`,
            "Regarding data that trainers enter about their clients (routines, measurements, session notes), the trainer acts as data controller and TrainHub as data processor, under the terms of art. 28 GDPR.",
          ],
        },
        {
          h: "2. Data we process",
          p: ["Depending on how you use the platform, we process the following categories of data:"],
          list: [
            "Account data: name, email, password (encrypted), role and language.",
            "Service usage data: routines, nutrition plans, trainer-client messages, workout logs and notifications.",
            "Health data (special category, art. 9 GDPR): body measurements, weight, injuries or physical restrictions, fasting logs and, if you enable the corresponding module, menstrual cycle data. This data is only processed with your explicit consent, which you can withdraw at any time.",
            "Billing data: handled by Stripe; TrainHub does not store card numbers.",
            "Technical data: session cookies strictly necessary for authentication.",
          ],
        },
        {
          h: "3. Purposes and legal bases",
          p: [],
          list: [
            "Service provision (account, routines, messaging): performance of contract, art. 6.1.b GDPR.",
            "Health data processing (measurements, injuries, menstrual cycle): explicit consent, art. 9.2.a GDPR, requested separately when enabling each feature.",
            "Payments and billing: performance of contract and legal obligation, arts. 6.1.b and 6.1.c GDPR.",
            "Service communications (invitations, routine alerts, password recovery): performance of contract, art. 6.1.b GDPR.",
            "Platform security (abuse prevention, anti-bot verification): legitimate interest, art. 6.1.f GDPR.",
          ],
        },
        {
          h: "4. Recipients and processors",
          p: [
            "We do not sell your data or share it with third parties for commercial purposes. To provide the service we use the following providers (data processors), with art. 28 GDPR agreements in place:",
          ],
          list: [
            "Supabase Inc. (database and authentication, hosted in EU/US under Standard Contractual Clauses).",
            "Vercel Inc. (web application hosting).",
            "Stripe Payments Europe Ltd. (payment processing).",
            "Google LLC (transactional email delivery).",
            "Cloudflare Inc. (anti-bot verification at signup).",
          ],
        },
        {
          h: "5. Retention",
          p: [
            "We keep your data while your account is active. When you delete your account, personal data is erased or anonymised within 30 days, except billing data, which is kept for the legally required tax periods (up to 6 years).",
          ],
        },
        {
          h: "6. Your rights",
          p: [
            `You can exercise your rights of access, rectification, erasure, objection, restriction and portability by writing to ${OWNER.email}. You can also withdraw consent for health data processing at any time from the app settings or by email, without affecting the rest of the service.`,
            "If you believe the processing does not comply with the law, you can file a complaint with the Spanish Data Protection Agency (www.aepd.es) or your local supervisory authority.",
          ],
        },
        {
          h: "7. Security",
          p: [
            "We apply appropriate technical and organisational measures: encryption in transit (TLS) and at rest, row-level access control in the database (each user only accesses their own data), encrypted passwords and backups.",
          ],
        },
        {
          h: "8. Minors",
          p: [
            "TrainHub is intended for people over 18. We do not knowingly register accounts for minors. If you detect a minor's account, contact us to remove it.",
          ],
        },
        {
          h: "9. Changes to this policy",
          p: [
            "If we modify this policy we will notify you by email or through an in-app notice with reasonable advance notice.",
          ],
        },
      ],
    },
  },

  // ═══════════════ TÉRMINOS Y CONDICIONES ═══════════════
  terms: {
    es: {
      title: "Términos y condiciones",
      intro:
        "Estos términos regulan el uso de TrainHub, una plataforma que conecta a entrenadores personales con sus clientes para la gestión de rutinas, nutrición, seguimiento y comunicación. Al crear una cuenta aceptas estos términos.",
      sections: [
        {
          h: "1. El servicio",
          p: [
            "TrainHub ofrece a entrenadores herramientas para crear y asignar rutinas de entrenamiento y planes nutricionales, hacer seguimiento de sus clientes y comunicarse con ellos. Los clientes acceden por invitación de su entrenador.",
            "TrainHub es una herramienta de gestión: el contenido de las rutinas, planes y recomendaciones es responsabilidad exclusiva del entrenador que lo crea.",
          ],
        },
        {
          h: "2. Cuentas",
          p: [
            "Debes ser mayor de 18 años y proporcionar información veraz. Eres responsable de mantener la confidencialidad de tu contraseña y de toda actividad realizada desde tu cuenta.",
          ],
        },
        {
          h: "3. Planes y pagos",
          p: [
            "Los entrenadores pueden usar el plan gratuito (con límites) o suscribirse a planes de pago con facturación mensual o anual gestionada por Stripe. Los precios y límites vigentes se muestran en la página de suscripción.",
            "Las suscripciones se renuevan automáticamente. Puedes cancelar en cualquier momento desde el portal de facturación; la cancelación surte efecto al final del periodo ya pagado. Salvo obligación legal, los periodos ya facturados no son reembolsables.",
            "Conforme al art. 103.m del RDL 1/2007, al contratar un servicio digital de ejecución inmediata consientes que la prestación comience de inmediato y conoces que ello limita el derecho de desistimiento respecto del servicio ya prestado.",
          ],
        },
        {
          h: "4. Aviso importante sobre salud y ejercicio",
          p: [
            "TrainHub no proporciona consejo médico. Las rutinas, planes nutricionales y cualquier contenido de la plataforma no sustituyen la valoración de un profesional sanitario. Consulta a tu médico antes de comenzar cualquier programa de ejercicio o nutrición, especialmente si tienes una condición médica preexistente.",
            "El ejercicio físico conlleva riesgos inherentes. Cada usuario practica bajo su propia responsabilidad y debe adecuar la intensidad a su estado físico.",
          ],
        },
        {
          h: "5. Uso aceptable",
          p: ["No está permitido:"],
          list: [
            "Usar la plataforma para fines ilegales o no autorizados.",
            "Acceder o intentar acceder a datos de otros usuarios.",
            "Realizar ingeniería inversa, scraping masivo o ataques que degraden el servicio.",
            "Subir contenido que infrinja derechos de terceros.",
          ],
        },
        {
          h: "6. Contenido del usuario",
          p: [
            "Los entrenadores conservan la titularidad del contenido que crean (rutinas, planes, notas). Al usar TrainHub nos concedes una licencia limitada para almacenarlo y mostrarlo, únicamente con el fin de prestar el servicio.",
          ],
        },
        {
          h: "7. Disponibilidad y responsabilidad",
          p: [
            "Trabajamos para mantener el servicio disponible, pero no garantizamos disponibilidad ininterrumpida. En la medida permitida por la ley, la responsabilidad total de TrainHub se limita al importe pagado por el usuario en los 12 meses anteriores al hecho que la origine.",
            "Nada en estos términos limita la responsabilidad que no pueda limitarse legalmente ni los derechos irrenunciables de los consumidores.",
          ],
        },
        {
          h: "8. Terminación",
          p: [
            "Puedes eliminar tu cuenta en cualquier momento desde los ajustes. Podremos suspender o cerrar cuentas que incumplan estos términos, notificándolo cuando sea posible.",
          ],
        },
        {
          h: "9. Modificaciones",
          p: [
            "Podemos actualizar estos términos. Los cambios sustanciales se notificarán con al menos 15 días de antelación. El uso continuado del servicio tras la entrada en vigor supone la aceptación de los nuevos términos.",
          ],
        },
        {
          h: "10. Ley aplicable",
          p: [
            "Estos términos se rigen por la legislación española. Para cualquier controversia serán competentes los juzgados y tribunales del domicilio del usuario cuando este sea consumidor.",
          ],
        },
      ],
    },
    en: {
      title: "Terms and conditions",
      intro:
        "These terms govern the use of TrainHub, a platform that connects personal trainers with their clients for routine management, nutrition, tracking and communication. By creating an account you accept these terms.",
      sections: [
        {
          h: "1. The service",
          p: [
            "TrainHub provides trainers with tools to create and assign workout routines and nutrition plans, track their clients and communicate with them. Clients join by invitation from their trainer.",
            "TrainHub is a management tool: the content of routines, plans and recommendations is the sole responsibility of the trainer who creates it.",
          ],
        },
        {
          h: "2. Accounts",
          p: [
            "You must be over 18 and provide truthful information. You are responsible for keeping your password confidential and for all activity performed from your account.",
          ],
        },
        {
          h: "3. Plans and payments",
          p: [
            "Trainers can use the free plan (with limits) or subscribe to paid plans with monthly or yearly billing handled by Stripe. Current prices and limits are shown on the subscription page.",
            "Subscriptions renew automatically. You can cancel at any time from the billing portal; cancellation takes effect at the end of the paid period. Unless legally required, already billed periods are non-refundable.",
            "By purchasing a digital service of immediate execution you consent to the service starting immediately and acknowledge that this limits the right of withdrawal for the service already provided.",
          ],
        },
        {
          h: "4. Important health and exercise notice",
          p: [
            "TrainHub does not provide medical advice. Routines, nutrition plans and any platform content are not a substitute for assessment by a healthcare professional. Consult your doctor before starting any exercise or nutrition programme, especially if you have a pre-existing medical condition.",
            "Physical exercise carries inherent risks. Each user trains at their own responsibility and must adapt intensity to their physical condition.",
          ],
        },
        {
          h: "5. Acceptable use",
          p: ["You may not:"],
          list: [
            "Use the platform for illegal or unauthorised purposes.",
            "Access or attempt to access other users' data.",
            "Reverse engineer, mass-scrape or perform attacks that degrade the service.",
            "Upload content that infringes third-party rights.",
          ],
        },
        {
          h: "6. User content",
          p: [
            "Trainers retain ownership of the content they create (routines, plans, notes). By using TrainHub you grant us a limited licence to store and display it, solely for the purpose of providing the service.",
          ],
        },
        {
          h: "7. Availability and liability",
          p: [
            "We work to keep the service available but do not guarantee uninterrupted availability. To the extent permitted by law, TrainHub's total liability is limited to the amount paid by the user in the 12 months prior to the event giving rise to it.",
            "Nothing in these terms limits liability that cannot legally be limited or consumers' non-waivable rights.",
          ],
        },
        {
          h: "8. Termination",
          p: [
            "You can delete your account at any time from settings. We may suspend or close accounts that breach these terms, with notice where possible.",
          ],
        },
        {
          h: "9. Changes",
          p: [
            "We may update these terms. Substantial changes will be notified at least 15 days in advance. Continued use of the service after they take effect constitutes acceptance of the new terms.",
          ],
        },
        {
          h: "10. Governing law",
          p: [
            "These terms are governed by Spanish law. Consumers may also rely on the mandatory protections of their country of residence.",
          ],
        },
      ],
    },
  },

  // ═══════════════ AVISO LEGAL ═══════════════
  legal: {
    es: {
      title: "Aviso legal",
      intro:
        "En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de los siguientes datos:",
      sections: [
        {
          h: "1. Titular del sitio",
          p: [
            `Titular: ${OWNER.name}`,
            `NIF: ${OWNER.nif}`,
            `Domicilio: ${OWNER.address}`,
            `Email de contacto: ${OWNER.email}`,
          ],
        },
        {
          h: "2. Objeto",
          p: [
            "TrainHub es una plataforma web para la gestión profesional de entrenamiento personal: rutinas, nutrición, seguimiento de clientes y comunicación entrenador-cliente.",
          ],
        },
        {
          h: "3. Propiedad intelectual",
          p: [
            "El software, diseño, logotipos y contenidos propios de TrainHub están protegidos por derechos de propiedad intelectual. No se permite su reproducción o distribución sin autorización. El contenido creado por los usuarios pertenece a sus autores.",
          ],
        },
        {
          h: "4. Responsabilidad",
          p: [
            "El titular no se hace responsable del contenido creado por los usuarios de la plataforma ni del mal uso que estos hagan del servicio. Ver los Términos y condiciones para el detalle del régimen de responsabilidad.",
          ],
        },
        {
          h: "5. Cookies",
          p: [
            "TrainHub utiliza únicamente cookies técnicas estrictamente necesarias para la autenticación y el funcionamiento del servicio, exentas del deber de consentimiento según el criterio de la AEPD. No usamos cookies publicitarias ni de seguimiento de terceros.",
          ],
        },
        {
          h: "6. Legislación aplicable",
          p: ["Este sitio se rige por la legislación española."],
        },
      ],
    },
    en: {
      title: "Legal notice",
      intro:
        "In compliance with Spanish Law 34/2002 on Information Society Services and Electronic Commerce (LSSI-CE), the following information is provided:",
      sections: [
        {
          h: "1. Site owner",
          p: [
            `Owner: ${OWNER.name}`,
            `Tax ID: ${OWNER.nif}`,
            `Address: ${OWNER.address}`,
            `Contact email: ${OWNER.email}`,
          ],
        },
        {
          h: "2. Purpose",
          p: [
            "TrainHub is a web platform for professional personal training management: routines, nutrition, client tracking and trainer-client communication.",
          ],
        },
        {
          h: "3. Intellectual property",
          p: [
            "TrainHub's software, design, logos and own content are protected by intellectual property rights. Reproduction or distribution without authorisation is not permitted. User-created content belongs to its authors.",
          ],
        },
        {
          h: "4. Liability",
          p: [
            "The owner is not responsible for content created by platform users or for their misuse of the service. See the Terms and conditions for details of the liability regime.",
          ],
        },
        {
          h: "5. Cookies",
          p: [
            "TrainHub only uses technical cookies strictly necessary for authentication and service operation, exempt from consent requirements. We do not use advertising or third-party tracking cookies.",
          ],
        },
        {
          h: "6. Applicable law",
          p: ["This site is governed by Spanish law."],
        },
      ],
    },
  },
};

const ui = {
  es: { back: "Volver", updated: "Última actualización", otherDocs: "Documentos legales" },
  en: { back: "Back", updated: "Last updated", otherDocs: "Legal documents" },
} as const;

const docLinks: { doc: LegalDoc; path: string; label: Record<Locale, string> }[] = [
  { doc: "legal", path: "legal", label: { es: "Aviso legal", en: "Legal notice" } },
  { doc: "privacy", path: "privacy", label: { es: "Privacidad", en: "Privacy" } },
  { doc: "terms", path: "terms", label: { es: "Términos", en: "Terms" } },
];

export function LegalContent({ doc, locale }: { doc: LegalDoc; locale: Locale }) {
  const d = content[doc][locale];
  const i = ui[locale];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link
            href={`/${locale}/login`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {i.back}
          </Link>
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <Scale className="h-4 w-4" />
            Train<span className="text-primary">Hub</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight">{d.title}</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {i.updated}: {LAST_UPDATED[locale]}
        </p>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{d.intro}</p>

        <div className="mt-8 space-y-8">
          {d.sections.map((s) => (
            <section key={s.h}>
              <h2 className="text-lg font-semibold">{s.h}</h2>
              {s.p.map((par, idx) => (
                <p key={idx} className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {par}
                </p>
              ))}
              {s.list && (
                <ul className="mt-2 list-disc space-y-1 pl-6 text-sm leading-relaxed text-muted-foreground">
                  {s.list.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <footer className="mt-12 border-t pt-6">
          <p className="text-xs font-medium text-muted-foreground">{i.otherDocs}</p>
          <div className="mt-2 flex gap-4 text-sm">
            {docLinks
              .filter((l) => l.doc !== doc)
              .map((l) => (
                <Link key={l.doc} href={`/${locale}/${l.path}`} className="text-primary underline">
                  {l.label[locale]}
                </Link>
              ))}
          </div>
        </footer>
      </main>
    </div>
  );
}
