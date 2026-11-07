import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { BookOpenCheck, FileCheck2, FileText, ShieldCheck, GraduationCap } from "lucide-react";
import VISUELLE from "@/assets/visuelle.jpg"
import SOURCE_DOCUMENT from "@/assets/D71-138-VF.pdf?url";

const features = [
  {
    number: 1,
    title: "Rapide",
    text: "Des résumés courts pour apprendre en quelques minutes.",
  },
  {
    number: 2,
    title: "Spécifique Madagascar",
    text: "Priorités, panneaux et règles locales expliquées simplement.",
  },
  {
    number: 3,
    title: "Pièges d'examen",
    text: "Les erreurs fréquentes à éviter le jour J.",
  },
];

export default function HomePage() {

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <nav className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-teal-700 text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            🚦 E-Torolalana · Madagascar
          </Link>
          <div className="flex gap-4 items-center justify-between">
            <Link
              to="/register"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Inscription
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          {/* Banner avec image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-amber-400/10 rounded-3xl blur-xl"></div>
              <img
                src={VISUELLE}
                alt="Étudiant en train d'étudier en classe"
                className="relative z-10 h-56 w-full rounded-2xl border border-stone-200 object-cover shadow-lg sm:h-72 lg:h-[380px]"
              />
            </div>
            <div className="text-center lg:text-left space-y-6">
              <h1 className="text-4xl font-bold text-stone-900 dark:text-foreground sm:text-5xl tracking-tight">
                Réviser le code de la route
              </h1>
              <p className="text-lg text-stone-600 dark:text-foreground max-w-xl mx-auto lg:mx-0">
                Assistant pédagogique pour le code de la route à Madagascar :
                panneaux, priorités, sanctions et pièges d'examen. Réponses
                simples, en français, en MARKDOWN.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/chat"
                  className="flex-1 rounded-xl bg-teal-700 px-8 py-4 text-lg font-semibold text-white text-center hover:bg-teal-800 dark:text-teal-950"
                >
                  Commencer à réviser
                </Link>
                <Link
                  to="/login"
                  className="flex-1 rounded-xl border border-stone-300 bg-white px-8 py-4 text-lg font-semibold text-stone-700 text-center hover:bg-stone-50 dark:border-border dark:bg-card dark:text-foreground dark:hover:bg-accent"
                >
                  Se connecter
                </Link>
              </div>
            </div>
          </div>

          <section
            aria-labelledby="trusted-learning-title"
            className="mt-10 rounded-2xl border border-teal-200 bg-teal-50 p-5 dark:border-teal-900 dark:bg-teal-950/30 sm:mt-12 sm:p-7"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
              <div className="flex min-w-0 flex-1 items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white">
                  <BookOpenCheck size={24} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-teal-800 dark:text-teal-300">
                    Une base documentaire enrichie par l’équipe admin
                  </p>
                  <h2 id="trusted-learning-title" className="mt-1 text-xl font-bold text-stone-900 dark:text-foreground sm:text-2xl">
                    Des réponses appuyées sur des sources de référence
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-stone-700 dark:text-foreground sm:text-base">
                    L’administration ajoute des documents officiels et des ressources fiables sur le code de la route à Madagascar.
                    Gemini peut s’appuyer sur ces connaissances pour apporter des réponses plus précises aux apprenants.
                  </p>
                </div>
              </div>
              <ul className="grid shrink-0 gap-3 border-t border-teal-200 pt-4 dark:border-teal-900 md:w-64 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                <li className="flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-foreground">
                  <ShieldCheck size={18} className="shrink-0 text-teal-700 dark:text-teal-300" aria-hidden="true" />
                  Sources choisies par l’administration
                </li>
                <li className="flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-foreground">
                  <FileCheck2 size={18} className="shrink-0 text-teal-700 dark:text-teal-300" aria-hidden="true" />
                  Documents vérifiés avant ajout
                </li>
              </ul>
            </div>
          </section>

          <section
            aria-labelledby="source-document-title"
            className="mt-14 rounded-2xl border border-border bg-card p-5 shadow-sm sm:mt-16 sm:p-7"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileText size={23} aria-hidden="true" />
                </span>
                <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
                  Exemple de document source
                </p>
                <h2 id="source-document-title" className="mt-1 text-xl font-bold text-foreground">
                  D71-138-VF.pdf
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Un exemple de document officiel de référence que l’administration peut fournir pour étayer les réponses de l’IA.
                </p>
                </div>
              </div>
              <a
                href={SOURCE_DOCUMENT}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <FileText size={18} aria-hidden="true" />
                Consulter le document
              </a>
            </div>
          </section>

          <div className="mt-14 sm:mt-16">
            <h2 className="text-2xl font-semibold text-stone-900 text-center mb-10 dark:text-foreground">
              Pourquoi réviser avec nous ?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {features.map((item, i) => (
                <Card key={i} className="p-6 h-full flex flex-col">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 mb-4 shrink-0">
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-stone-900 mb-2 dark:text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed flex-1 dark:text-muted-foreground">
                    {item.text}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          <footer className="mt-14 sm:mt-16">
            <div className="rounded-3xl border border-teal-200 bg-teal-50 px-6 py-9 text-center dark:border-teal-800 dark:bg-teal-950/40 sm:px-12 sm:py-12">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <GraduationCap size={30} aria-hidden="true" />
              </span>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-teal-800 dark:text-teal-300 sm:text-sm">
                Un outil complémentaire pour apprendre
              </p>
              <h2 className="mx-auto mt-3 max-w-3xl text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                Rien ne remplace l’apprentissage en auto-école
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-foreground sm:text-lg">
                Cet assistant ne remplace ni l’étude en auto-école ni l’accompagnement d’un professionnel.
                Il est là pour aider celles et ceux qui en ont besoin à réviser et à mieux comprendre le code de la route.
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
