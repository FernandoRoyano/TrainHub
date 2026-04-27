import Link from "next/link";
import { ArrowLeft, BookOpen, Briefcase, Users as UsersIcon } from "lucide-react";

type Locale = "es" | "en";
type Role = "trainer" | "client" | "admin";

interface Props {
  locale: Locale;
  role: Role;
}

const t = {
  es: {
    backToApp: "Volver a la app",
    title: "Guía de uso de TrainHub",
    subtitle: "Manual completo de funciones y flujo de trabajo recomendado.",
    forTrainers: "Para entrenadores",
    forClients: "Para clientes",
    contents: "Contenido",
    showSection: "Estás viendo la sección de",
    trainer: "entrenador",
    client: "cliente",
  },
  en: {
    backToApp: "Back to app",
    title: "TrainHub user guide",
    subtitle: "Complete manual of features and recommended workflow.",
    forTrainers: "For trainers",
    forClients: "For clients",
    contents: "Contents",
    showSection: "You are viewing the section for",
    trainer: "trainer",
    client: "client",
  },
} as const;

export function HelpContent({ locale, role }: Props) {
  const i = t[locale];
  const homeHref = role === "client" ? `/${locale}/my-routine` : `/${locale}/dashboard`;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link
            href={homeHref}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {i.backToApp}
          </Link>
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            {i.title}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">{i.title}</h1>
          <p className="mt-2 text-muted-foreground">{i.subtitle}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <Toc locale={locale} />

          <div className="space-y-12">
            <SectionGroup
              icon={<Briefcase className="h-5 w-5 text-primary" />}
              title={i.forTrainers}
            >
              {locale === "es" ? <TrainerEs /> : <TrainerEn />}
            </SectionGroup>

            <SectionGroup
              icon={<UsersIcon className="h-5 w-5 text-primary" />}
              title={i.forClients}
            >
              {locale === "es" ? <ClientEs /> : <ClientEn />}
            </SectionGroup>
          </div>
        </div>
      </main>
    </div>
  );
}

function Toc({ locale }: { locale: Locale }) {
  const i = t[locale];
  const trainerLinks =
    locale === "es"
      ? [
          ["overview-trainer", "Visión general"],
          ["clients", "Clientes"],
          ["service-tiers", "Service Tiers"],
          ["coaching-plans", "Coaching Plans"],
          ["routines", "Rutinas"],
          ["exercises", "Ejercicios"],
          ["blocks", "Bloques"],
          ["nutrition", "Nutrición"],
          ["questionnaires", "Cuestionarios"],
          ["messages", "Mensajería"],
          ["calendar", "Calendario"],
          ["analytics", "Analytics"],
          ["settings", "Configuración"],
          ["workflow", "Cómo encaja todo"],
        ]
      : [
          ["overview-trainer", "Overview"],
          ["clients", "Clients"],
          ["service-tiers", "Service Tiers"],
          ["coaching-plans", "Coaching Plans"],
          ["routines", "Routines"],
          ["exercises", "Exercises"],
          ["blocks", "Blocks"],
          ["nutrition", "Nutrition"],
          ["questionnaires", "Questionnaires"],
          ["messages", "Messaging"],
          ["calendar", "Calendar"],
          ["analytics", "Analytics"],
          ["settings", "Settings"],
          ["workflow", "How it all fits"],
        ];

  const clientLinks =
    locale === "es"
      ? [
          ["overview-client", "Visión general"],
          ["my-plan", "Mi plan"],
          ["my-routine", "Mi rutina"],
          ["my-nutrition", "Mi nutrición"],
          ["my-questionnaires", "Mis cuestionarios"],
          ["my-progress", "Mi progreso"],
          ["my-measurements", "Mis medidas"],
          ["my-cycle", "Mi ciclo"],
          ["my-fasting", "Mi ayuno"],
          ["my-messages", "Mensajes"],
          ["my-profile", "Mi perfil"],
        ]
      : [
          ["overview-client", "Overview"],
          ["my-plan", "My plan"],
          ["my-routine", "My routine"],
          ["my-nutrition", "My nutrition"],
          ["my-questionnaires", "My questionnaires"],
          ["my-progress", "My progress"],
          ["my-measurements", "My measurements"],
          ["my-cycle", "My cycle"],
          ["my-fasting", "My fasting"],
          ["my-messages", "Messages"],
          ["my-profile", "My profile"],
        ];

  return (
    <nav className="lg:sticky lg:top-20 lg:self-start text-sm">
      <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {i.contents}
      </p>
      <p className="mb-1 mt-3 px-2 text-xs font-medium text-foreground/70">
        {i.forTrainers}
      </p>
      <ul className="space-y-0.5">
        {trainerLinks.map(([id, label]) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className="block rounded px-2 py-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
      <p className="mb-1 mt-4 px-2 text-xs font-medium text-foreground/70">
        {i.forClients}
      </p>
      <ul className="space-y-0.5">
        {clientLinks.map(([id, label]) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className="block rounded px-2 py-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function SectionGroup({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-6 flex items-center gap-2 border-b pb-3">
        {icon}
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      </div>
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-10">
        {children}
      </div>
    </section>
  );
}

function H3({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="scroll-mt-20 text-lg font-semibold text-foreground">
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>;
}

function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul className="ml-5 list-disc space-y-1 text-sm leading-relaxed text-muted-foreground">
      {children}
    </ul>
  );
}

function OL({ children }: { children: React.ReactNode }) {
  return (
    <ol className="ml-5 list-decimal space-y-1 text-sm leading-relaxed text-muted-foreground">
      {children}
    </ol>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-foreground">
      <span className="font-semibold text-primary">Tip · </span>
      {children}
    </div>
  );
}

/* ============================================================
 *                       SPANISH CONTENT
 * ============================================================ */

function TrainerEs() {
  return (
    <>
      <div>
        <H3 id="overview-trainer">Visión general</H3>
        <P>
          Como entrenador en TrainHub gestionas clientes, defines servicios (Service Tiers + Coaching Plans),
          creas rutinas y planes de nutrición, asignas cuestionarios y mantienes contacto vía mensajería.
          El plan gratuito permite hasta 3 clientes.
        </P>
      </div>

      <div>
        <H3 id="clients">Clientes</H3>
        <P>
          En <strong>Clientes</strong> creas, invitas y gestionas a tus clientes. Hay dos formas de invitar:
        </P>
        <UL>
          <li><strong>Por email</strong>: introduces datos del cliente, le llega un email con link para crear cuenta.</li>
          <li><strong>Link compartido</strong>: generas un link genérico (sin email pre-asignado) que puedes pasar por WhatsApp, etc.</li>
        </UL>
        <Tip>
          El plan gratuito tiene un máximo de 3 clientes. Si intentas añadir el 4º, el sistema lo bloquea.
        </Tip>
      </div>

      <div>
        <H3 id="service-tiers">Service Tiers (qué incluye cada servicio)</H3>
        <P>
          Un <strong>Service Tier</strong> define qué módulos están activos para un cliente: rutinas, nutrición,
          mensajería, seguimiento de progreso, medidas, etc. Es la &quot;plantilla de servicio&quot;.
        </P>
        <P>
          Por ejemplo: un tier &quot;Solo entrenamiento&quot; activaría rutinas pero desactivaría nutrición.
          Un tier &quot;Coaching completo&quot; lo activaría todo.
        </P>
        <P>Crea tantos tiers como modelos de servicio ofrezcas.</P>
      </div>

      <div>
        <H3 id="coaching-plans">Coaching Plans (paquetes asignables)</H3>
        <P>
          Un <strong>Coaching Plan</strong> combina un Service Tier + una duración + un precio. Es lo que
          asignas finalmente a un cliente.
        </P>
        <P>Ejemplos:</P>
        <UL>
          <li>&quot;Pack 3 meses entrenamiento&quot; = Tier &quot;Solo entrenamiento&quot; + 3 meses + 90€.</li>
          <li>&quot;Coaching premium 6 meses&quot; = Tier &quot;Coaching completo&quot; + 6 meses + 600€.</li>
        </UL>
        <P>
          Al asignar un Coaching Plan a un cliente, este verá en su app solo los módulos definidos en el Tier
          asociado durante el periodo del plan.
        </P>
      </div>

      <div>
        <H3 id="routines">Rutinas</H3>
        <P>
          Las rutinas son los planes de entrenamiento. Cada rutina tiene varios <strong>días</strong> (ej.
          &quot;Día A push&quot;, &quot;Día B pull&quot;), y cada día contiene ejercicios con series, reps, descanso, peso.
        </P>
        <P>Funciones avanzadas:</P>
        <UL>
          <li><strong>Grupos</strong>: agrupa ejercicios como biserie, triserie, circuito, EMOM, AMRAP.</li>
          <li><strong>Descripción del día</strong>: instrucciones generales que verá el cliente.</li>
          <li><strong>Imagen de portada</strong>: para que la rutina sea reconocible.</li>
          <li><strong>Asignar a cliente</strong>: con fechas de inicio y fin.</li>
        </UL>
        <Tip>
          Cuando una rutina está a 3 días de acabar, el sistema te notifica automáticamente para que renueves o asignes una nueva.
        </Tip>
      </div>

      <div>
        <H3 id="exercises">Ejercicios</H3>
        <P>
          Tu biblioteca personal de ejercicios. Cada ejercicio puede tener nombre, descripción, grupo muscular,
          equipo necesario, y dos imágenes (frame 0 y frame 1) que en la app del cliente se alternan creando
          una mini-animación.
        </P>
      </div>

      <div>
        <H3 id="blocks">Bloques</H3>
        <P>
          Plantillas reutilizables de grupos de ejercicios. Si tienes un calentamiento, una secuencia de movilidad
          o un superset que repites mucho, lo guardas como bloque y lo arrastras a tus rutinas.
        </P>
      </div>

      <div>
        <H3 id="nutrition">Nutrición</H3>
        <P>
          Crea planes nutricionales con comidas, alimentos y macros. La búsqueda de alimentos usa la base de
          datos USDA con traducciones al español.
        </P>
        <P>Asignas un plan a un cliente igual que con las rutinas. El cliente lo verá en &quot;Mi nutrición&quot;.</P>
      </div>

      <div>
        <H3 id="questionnaires">Cuestionarios</H3>
        <P>
          Permiten recoger información estructurada del cliente: anamnesis inicial, valoración semanal,
          encuestas de satisfacción, etc.
        </P>
        <OL>
          <li><strong>Crear plantilla</strong>: defines preguntas (texto, opción múltiple, escala, etc.).</li>
          <li><strong>Asignar al cliente</strong>: el cliente lo verá en &quot;Mis cuestionarios&quot;.</li>
          <li><strong>Recibir respuestas</strong>: ves las respuestas en el perfil del cliente.</li>
        </OL>
      </div>

      <div>
        <H3 id="messages">Mensajería</H3>
        <P>
          Chat 1 a 1 con cada cliente. Soporta emojis. El icono de campana en la cabecera te avisa de mensajes
          nuevos sin leer.
        </P>
      </div>

      <div>
        <H3 id="calendar">Calendario</H3>
        <P>
          Vista global de todas las rutinas asignadas, con fechas de inicio y fin. Útil para planificar
          renovaciones y ver carga de trabajo.
        </P>
      </div>

      <div>
        <H3 id="analytics">Analytics</H3>
        <P>
          Métricas agregadas: clientes activos, adherencia, mensajes pendientes, etc. Revisa esto al menos una
          vez por semana.
        </P>
      </div>

      <div>
        <H3 id="settings">Configuración</H3>
        <P>
          Tu perfil, foto, plan de suscripción, idioma, tema (claro/oscuro). También cambias tu contraseña aquí.
        </P>
      </div>

      <div>
        <H3 id="workflow">Cómo encaja todo (flujo recomendado)</H3>
        <P>Si acabas de crear tu cuenta, este es el orden lógico:</P>
        <OL>
          <li><strong>Configura tu perfil</strong> en Configuración (foto, bio).</li>
          <li>
            <strong>Crea al menos 1 Service Tier</strong> que represente tu servicio típico (ej. &quot;Coaching
            completo&quot; con todos los módulos activos).
          </li>
          <li>
            <strong>Crea al menos 1 Coaching Plan</strong> ligado a ese Tier (ej. &quot;3 meses · 150€&quot;).
          </li>
          <li>
            <strong>Llena tu biblioteca de ejercicios</strong> con los que más usas (15-30 para empezar es suficiente).
          </li>
          <li>
            <strong>Crea una rutina plantilla</strong> que sirva de base para varios clientes.
          </li>
          <li>
            <strong>Invita a tu primer cliente</strong> desde Clientes → Nuevo.
          </li>
          <li>
            <strong>Asígnale un Coaching Plan</strong> y la rutina creada.
          </li>
          <li>
            <strong>Asigna un cuestionario inicial</strong> de anamnesis para conocer su historial.
          </li>
          <li>
            <strong>Saluda por Mensajería</strong> y explícale cómo entrar.
          </li>
          <li>
            <strong>Revisa su progreso semanalmente</strong> en el perfil del cliente y ajusta la rutina.
          </li>
        </OL>
        <Tip>
          La diferencia clave: Service Tier = &quot;qué módulos&quot;, Coaching Plan = &quot;qué pack
          comercial (tier + duración + precio)&quot;, Rutina = &quot;el entrenamiento concreto&quot;.
        </Tip>
      </div>
    </>
  );
}

function ClientEs() {
  return (
    <>
      <div>
        <H3 id="overview-client">Visión general</H3>
        <P>
          Como cliente accedes a tu plan de entrenamiento, nutrición, cuestionarios y mensajería con tu
          entrenador. Lo que ves depende de lo que tu entrenador haya activado en tu Service Tier.
        </P>
      </div>

      <div>
        <H3 id="my-plan">Mi plan</H3>
        <P>
          Vista resumen del Coaching Plan asignado: qué incluye, fecha de inicio, fecha de fin y módulos
          activos.
        </P>
      </div>

      <div>
        <H3 id="my-routine">Mi rutina</H3>
        <P>
          Aquí ves tu rutina activa con los días planificados. Click en un día para ver los ejercicios.
        </P>
        <P>Durante el entrenamiento:</P>
        <UL>
          <li><strong>Timer integrado</strong> para descansos entre series.</li>
          <li><strong>Marca series completadas</strong> con peso y reps reales.</li>
          <li><strong>Feedback por ejercicio</strong>: tu valoración llega al entrenador.</li>
          <li><strong>Animaciones</strong> de los ejercicios para entender la técnica.</li>
        </UL>
      </div>

      <div>
        <H3 id="my-nutrition">Mi nutrición</H3>
        <P>
          Tu plan nutricional: comidas, alimentos, cantidades y macros. Si activado, podrás ver totales
          diarios.
        </P>
      </div>

      <div>
        <H3 id="my-questionnaires">Mis cuestionarios</H3>
        <P>
          Cuestionarios que tu entrenador te asignó (anamnesis, valoración semanal, etc.). Click para
          contestar. Las respuestas las ve tu entrenador para ajustar tu plan.
        </P>
      </div>

      <div>
        <H3 id="my-progress">Mi progreso</H3>
        <P>
          Gráficos de evolución: rutinas completadas, adherencia, días entrenados, etc.
        </P>
      </div>

      <div>
        <H3 id="my-measurements">Mis medidas</H3>
        <P>
          Registra tus medidas corporales (peso, cintura, brazo, etc.) periódicamente. Verás la evolución en
          gráficos.
        </P>
      </div>

      <div>
        <H3 id="my-cycle">Mi ciclo (mujeres)</H3>
        <P>
          Tracking del ciclo menstrual y adaptación del entrenamiento a la fase. Privacidad total: tu
          entrenador solo ve lo que tú decidas compartir.
        </P>
      </div>

      <div>
        <H3 id="my-fasting">Mi ayuno</H3>
        <P>
          Control de ayuno intermitente: define ventana de comida, registra inicio/fin y ve histórico.
        </P>
      </div>

      <div>
        <H3 id="my-messages">Mensajes</H3>
        <P>
          Chat directo con tu entrenador. Soporta emojis. La campanita en la cabecera te avisa de mensajes
          nuevos.
        </P>
      </div>

      <div>
        <H3 id="my-profile">Mi perfil</H3>
        <P>
          Tus datos personales, foto, idioma y tema. También cambias tu contraseña aquí.
        </P>
      </div>
    </>
  );
}

/* ============================================================
 *                       ENGLISH CONTENT
 * ============================================================ */

function TrainerEn() {
  return (
    <>
      <div>
        <H3 id="overview-trainer">Overview</H3>
        <P>
          As a trainer you manage clients, define services (Service Tiers + Coaching Plans), create routines
          and nutrition plans, assign questionnaires and stay in touch via messaging. The free plan supports
          up to 3 clients.
        </P>
      </div>

      <div>
        <H3 id="clients">Clients</H3>
        <P>In <strong>Clients</strong> you create, invite and manage your clients. Two ways to invite:</P>
        <UL>
          <li><strong>By email</strong>: enter client data, they get an email with a sign-up link.</li>
          <li><strong>Shareable link</strong>: generate a generic link to share via WhatsApp etc.</li>
        </UL>
        <Tip>The free plan allows max 3 clients. The 4th will be blocked by the system.</Tip>
      </div>

      <div>
        <H3 id="service-tiers">Service Tiers (what each service includes)</H3>
        <P>
          A <strong>Service Tier</strong> defines which modules are active for a client: routines, nutrition,
          messaging, progress tracking, measurements, etc. It&apos;s the &quot;service template&quot;.
        </P>
        <P>
          Example: a &quot;Training only&quot; tier would enable routines but disable nutrition. A &quot;Full
          coaching&quot; tier enables everything.
        </P>
      </div>

      <div>
        <H3 id="coaching-plans">Coaching Plans (assignable packages)</H3>
        <P>
          A <strong>Coaching Plan</strong> combines a Service Tier + duration + price. This is what you
          actually assign to a client.
        </P>
        <UL>
          <li>&quot;3-month training pack&quot; = &quot;Training only&quot; tier + 3 months + €90.</li>
          <li>&quot;Premium coaching 6 months&quot; = &quot;Full coaching&quot; tier + 6 months + €600.</li>
        </UL>
      </div>

      <div>
        <H3 id="routines">Routines</H3>
        <P>
          Routines are the workout plans. Each routine has multiple <strong>days</strong> (e.g. &quot;Day A
          push&quot;), and each day has exercises with sets, reps, rest, weight.
        </P>
        <UL>
          <li><strong>Groups</strong>: bi-set, tri-set, circuit, EMOM, AMRAP.</li>
          <li><strong>Day description</strong>: general instructions visible to the client.</li>
          <li><strong>Cover image</strong> for easy identification.</li>
          <li><strong>Assign to client</strong> with start and end dates.</li>
        </UL>
        <Tip>You get notified 3 days before a routine ends so you can renew or assign a new one.</Tip>
      </div>

      <div>
        <H3 id="exercises">Exercises</H3>
        <P>
          Your personal exercise library. Each exercise can have name, description, muscle group, equipment,
          and two images (frame 0 and frame 1) that alternate in the client app to form a mini animation.
        </P>
      </div>

      <div>
        <H3 id="blocks">Blocks</H3>
        <P>
          Reusable templates of exercise groups. If you use a warm-up or superset often, save it as a block
          and drag it into routines.
        </P>
      </div>

      <div>
        <H3 id="nutrition">Nutrition</H3>
        <P>
          Build nutrition plans with meals, foods and macros. Food search uses the USDA database with Spanish
          translations.
        </P>
      </div>

      <div>
        <H3 id="questionnaires">Questionnaires</H3>
        <P>Collect structured info from clients: intake forms, weekly check-ins, satisfaction surveys.</P>
        <OL>
          <li><strong>Create template</strong>: define questions (text, multiple choice, scale).</li>
          <li><strong>Assign to client</strong>: appears in their &quot;My questionnaires&quot;.</li>
          <li><strong>Receive answers</strong>: see them on the client profile.</li>
        </OL>
      </div>

      <div>
        <H3 id="messages">Messaging</H3>
        <P>
          1-to-1 chat with each client. Supports emojis. The bell icon in the header alerts you of new unread
          messages.
        </P>
      </div>

      <div>
        <H3 id="calendar">Calendar</H3>
        <P>
          Global view of all assigned routines with start/end dates. Useful for planning renewals and seeing
          workload.
        </P>
      </div>

      <div>
        <H3 id="analytics">Analytics</H3>
        <P>Aggregated metrics: active clients, adherence, pending messages. Check at least weekly.</P>
      </div>

      <div>
        <H3 id="settings">Settings</H3>
        <P>Your profile, photo, subscription plan, language, theme (light/dark). Change password here too.</P>
      </div>

      <div>
        <H3 id="workflow">How it all fits (recommended workflow)</H3>
        <P>If you just signed up, this is the logical order:</P>
        <OL>
          <li><strong>Set up your profile</strong> in Settings (photo, bio).</li>
          <li><strong>Create at least 1 Service Tier</strong> matching your typical service offering.</li>
          <li><strong>Create at least 1 Coaching Plan</strong> linked to that tier (e.g. &quot;3 months · €150&quot;).</li>
          <li><strong>Build your exercise library</strong> with the ones you use most (15-30 to start is enough).</li>
          <li><strong>Create a template routine</strong> as a base for multiple clients.</li>
          <li><strong>Invite your first client</strong> from Clients → New.</li>
          <li><strong>Assign them a Coaching Plan</strong> and the routine.</li>
          <li><strong>Assign an intake questionnaire</strong> to learn their history.</li>
          <li><strong>Say hi via Messaging</strong> and explain how to log in.</li>
          <li><strong>Review their progress weekly</strong> from the client profile and adjust as needed.</li>
        </OL>
        <Tip>
          Key distinction: Service Tier = &quot;which modules&quot;, Coaching Plan = &quot;commercial pack
          (tier + duration + price)&quot;, Routine = &quot;the actual training&quot;.
        </Tip>
      </div>
    </>
  );
}

function ClientEn() {
  return (
    <>
      <div>
        <H3 id="overview-client">Overview</H3>
        <P>
          As a client you access your training plan, nutrition, questionnaires and messaging with your
          trainer. What you see depends on what your trainer has enabled in your Service Tier.
        </P>
      </div>

      <div>
        <H3 id="my-plan">My plan</H3>
        <P>
          Summary view of your assigned Coaching Plan: what it includes, start date, end date and active
          modules.
        </P>
      </div>

      <div>
        <H3 id="my-routine">My routine</H3>
        <P>Your active routine with planned days. Click a day to see the exercises.</P>
        <UL>
          <li><strong>Built-in timer</strong> for rest between sets.</li>
          <li><strong>Mark sets done</strong> with actual weight and reps.</li>
          <li><strong>Per-exercise feedback</strong>: your rating reaches the trainer.</li>
          <li><strong>Animations</strong> to understand technique.</li>
        </UL>
      </div>

      <div>
        <H3 id="my-nutrition">My nutrition</H3>
        <P>Your nutrition plan: meals, foods, amounts and macros. Daily totals if enabled.</P>
      </div>

      <div>
        <H3 id="my-questionnaires">My questionnaires</H3>
        <P>
          Forms your trainer assigned to you. Click to fill in. Answers are shared with your trainer to adjust
          your plan.
        </P>
      </div>

      <div>
        <H3 id="my-progress">My progress</H3>
        <P>Evolution charts: completed routines, adherence, days trained.</P>
      </div>

      <div>
        <H3 id="my-measurements">My measurements</H3>
        <P>Log body measurements (weight, waist, arm, etc.) periodically. Evolution is plotted in charts.</P>
      </div>

      <div>
        <H3 id="my-cycle">My cycle (women)</H3>
        <P>
          Menstrual cycle tracking and training adaptation by phase. Full privacy: your trainer only sees what
          you choose to share.
        </P>
      </div>

      <div>
        <H3 id="my-fasting">My fasting</H3>
        <P>Intermittent fasting tracker: define eating window, log start/end, view history.</P>
      </div>

      <div>
        <H3 id="my-messages">Messages</H3>
        <P>Direct chat with your trainer. Supports emojis. Bell icon in header alerts you of new messages.</P>
      </div>

      <div>
        <H3 id="my-profile">My profile</H3>
        <P>Your personal data, photo, language and theme. Change password here too.</P>
      </div>
    </>
  );
}
