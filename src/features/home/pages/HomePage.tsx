import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import VISUELLE from "@/assets/visuelle.jpg"

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
      <nav className="border-b border-stone-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-teal-700 text-lg"
          >
            🚦 Code de la route · Madagascar
          </Link>
          <div className="flex gap-4 items-center justify-between">
            <Button>
              <Link
                to="/register"
                className="text-sm text-white hover:text-white/80"
              >
                Inscription
              </Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </nav>
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          {/* Banner avec image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-amber-400/10 rounded-3xl blur-xl"></div>
              <img
                src={VISUELLE}
                alt="Étudiant en train d'étudier en classe"
                className="relative z-10 w-full rounded-2xl border border-stone-200 shadow-lg object-cover"
              />
            </div>
            <div className="text-center lg:text-left space-y-6">
              <h1 className="text-4xl font-bold text-stone-900 sm:text-5xl tracking-tight">
                Réviser le code de la route
              </h1>
              <p className="text-lg text-stone-600 max-w-xl mx-auto lg:mx-0">
                Assistant pédagogique pour le code de la route à Madagascar :
                panneaux, priorités, sanctions et pièges d'examen. Réponses
                simples, en français, en MARKDOWN.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/chat"
                  className="flex-1 rounded-xl bg-teal-700 px-8 py-4 text-lg font-semibold text-white text-center hover:bg-teal-800"
                >
                  Commencer à réviser
                </Link>
                <Link
                  to="/login"
                  className="flex-1 rounded-xl border border-stone-300 bg-white px-8 py-4 text-lg font-semibold text-stone-700 text-center hover:bg-stone-50"
                >
                  Se connecter
                </Link>
              </div>
            </div>
          </div>

          {/* Cartes en dessous */}
          <div className="mt-20">
            <h2 className="text-2xl font-semibold text-stone-900 text-center mb-10">
              Pourquoi réviser avec nous ?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {features.map((item, i) => (
                <Card key={i} className="p-6 h-full flex flex-col">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 mb-4 shrink-0">
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-stone-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed flex-1">
                    {item.text}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
