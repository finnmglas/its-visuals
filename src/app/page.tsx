"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Lock,
  Shield,
  Cpu,
  Key,
  Terminal,
  Bug,
  Globe,
  FileWarning,
  FolderLock,
  Layers,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"

type Subchapter = { id: string; title: string; soon?: boolean }
type Chapter = {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  soon?: boolean
  sub?: Subchapter[]
}

const chapters: Chapter[] = [
  /*{
    id: "intro",
    title: "Einführung",
    description: "Ziele, Aufbau und Grundlagen des Moduls",
    icon: <BookOpen className="h-6 w-6" />,
    color: "from-blue-500 to-cyan-400",
    sub: [
      { id: "ziel-des-moduls", title: "Ziel des Moduls" },
      { id: "aufbau-des-skripts", title: "Aufbau des Skripts" },
      { id: "begriffe-grundlagen", title: "Begriffe und Grundlagen" },
      { id: "kerckhoffs-prinzip", title: "Kerckhoffs’ Prinzip" },
      { id: "korrektheit-verfahren", title: "Korrektheit von Verfahren" },
      { id: "sicherheit-verfahren", title: "Sicherheit von Verschlüsselungsverfahren" },
      { id: "algorithmus-protokoll", title: "Algorithmus & Protokoll" },
      { id: "mathematische-grundlagen", title: "Mathematische Grundlagen" },
    ],
  },*/
  {
    id: "geschichte",
    title: "Geschichte der Kryptologie",
    description: "Von Steganografie zu modernen Chiffriermaschinen",
    icon: <Lock className="h-6 w-6" />,
    color: "from-blue-500 to-cyan-400",
    sub: [
      { id: "steganografie", title: "Steganografie" },
      { id: "geschichte-der-kryptografie", title: "Geschichte der Kryptografie" },
      { id: "verschluesselung-von-hand", title: "Die Verschlüsselung von Hand" },
      { id: "chiffriermaschinen", title: "Chiffriermaschinen" },
    ],
  },
  {
    id: "bausteine",
    title: "Bausteine der Kryptografie",
    description: "Symmetrische & asymmetrische Verfahren, Hashfunktionen",
    icon: <Cpu className="h-6 w-6" />,
    color: "from-purple-500 to-indigo-400",
    sub: [
      { id: "stromchiffren", title: "Stromchiffren" },
      { id: "one-time-pad", title: "One-Time-Pad" },
      { id: "blockchiffren", title: "Blockchiffren" },
      { id: "asymmetrisch", title: "Asymmetrische Verschlüsselung" },
      { id: "schluesselaustausch", title: "Diffie–Hellman & ElGamal" },
      { id: "snake-oil", title: "Snake Oil" },
      { id: "hashfunktionen", title: "Hashfunktionen" },
      { id: "integritaet", title: "Integrität & Signaturen" },
    ],
  },
  {
    id: "benutzerverwaltung",
    title: "Benutzerverwaltung",
    description: "Zugriffskontrolle, Authentifizierung, Passwörter",
    icon: <Shield className="h-6 w-6" />,
    color: "from-emerald-500 to-green-400",
    sub: [
      { id: "identifizierung", title: "Identifizierung" },
      { id: "authentifizierung", title: "Authentifizierung" },
      { id: "passwoerter-speichern", title: "Passwörter speichern" },
      { id: "zugriffskontrollparadigmen", title: "Zugriffskontrollparadigmen" },
      { id: "umsetzung-zugriffskontrolle", title: "Umsetzung der Zugriffskontrolle" },
    ],
  },
  {
    id: "protokolle",
    title: "Kryptographische Protokolle",
    description: "SSH, TLS, sichere Übertragung und Vergleich",
    icon: <Key className="h-6 w-6" />,
    color: "from-amber-500 to-orange-400",
    sub: [
      { id: "ssh", title: "Secure Shell (SSH)" },
      { id: "tls", title: "TLS & TLS Handshake" },
      { id: "ssh-vs-tls", title: "SSH vs. TLS" },
    ],
  },
  {
    id: "schwachstellen",
    title: "Schwachstellen & Malware",
    description: "Angriffsquellen, CVEs, Malware-Arten und Gegenmaßnahmen",
    icon: <Bug className="h-6 w-6" />,
    color: "from-red-500 to-pink-400",
    sub: [
      { id: "cves", title: "Common Vulnerabilities & Exposures (CVE)" },
      { id: "malware-systematik", title: "Malware Systematik" },
      { id: "infektionswege", title: "Infektionswege" },
      { id: "gegenmassnahmen", title: "Gegenmaßnahmen" },
      { id: "erkennung", title: "Malware-Erkennung" },
    ],
  },
  {
    id: "isms",
    title: "Informationssicherheits-managementsysteme (ISMS)",
    description: "Management, Risikoanalyse und Sicherheitskonzepte",
    icon: <FolderLock className="h-6 w-6" />,
    color: "from-cyan-500 to-teal-400",
    soon: false,
    sub: [
      { id: "isms-einleitung", title: "Einleitung", soon: false },
      { id: "komponenten", title: "Komponenten des ISMS", soon: false },
      { id: "sicherheitskonzept", title: "Sicherheitskonzept", soon: false },
      { id: "risikoanalyse", title: "Risikoanalyse", soon: false },
    ],
  },
]


// --- Component ---
export default function StartPage() {
  const [active, setActive] = useState<Chapter | null>(null)

  const goPrev = () => {
    if (!active) return
    const i = chapters.findIndex((x) => x.id === active.id)
    if (i > 0) setActive(chapters[i - 1])
  }
  const goNext = () => {
    if (!active) return
    const i = chapters.findIndex((x) => x.id === active.id)
    if (i < chapters.length - 1) setActive(chapters[i + 1])
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-background transition-colors">
      <AnimatePresence mode="wait">
        {!active && (
          <motion.div
            key="main"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-6 w-full max-w-6xl sm:grid-cols-2 lg:grid-cols-3"
          >
            {chapters.map((c) => (
              <Card
                key={c.id}
                onClick={() => setActive(c)}
                className={cn(
                  "group relative cursor-pointer overflow-hidden border border-border/60 hover:border-border bg-card hover:shadow-lg transition-all duration-300"
                )}
              >
                <div className={cn("absolute inset-0 opacity-40 bg-gradient-to-br", c.color)} />
                <CardHeader className="relative z-10 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-primary">{c.icon}</div>
                    {c.soon && <Badge variant="secondary">Soon</Badge>}
                  </div>
                  <CardTitle className="font-semibold">{c.title}</CardTitle>
                  <CardDescription>{c.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </motion.div>
        )}

        {active && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-3xl"
          >
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setActive(null)}
                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Zurück
              </button>
              <div className="flex gap-2">
                <button
                  onClick={goPrev}
                  disabled={chapters.findIndex((c) => c.id === active.id) === 0}
                  className="flex items-center text-sm text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Davor
                </button>
                <button
                  onClick={goNext}
                  disabled={chapters.findIndex((c) => c.id === active.id) === chapters.length - 1}
                  className="flex items-center text-sm text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Danach <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>

            <Card className="border border-border/60 bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={cn("p-2 rounded-md text-white bg-gradient-to-br", active.color)}>
                  {active.icon}
                </div>
                <h2 className="text-2xl font-semibold">{active.title}</h2>
              </div>
              <p className="text-muted-foreground mb-6">{active.description}</p>

              <CardContent className="grid gap-3">
                {active.sub?.map((s) => (
                  <Link
                    key={s.id}
                    href={`/outline/${s.id}`}
                    className="flex items-center justify-between p-3 rounded-md border border-border/50 hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <span>{s.title}</span>
                    {s.soon && <Badge variant="outline">Soon</Badge>}
                  </Link>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
