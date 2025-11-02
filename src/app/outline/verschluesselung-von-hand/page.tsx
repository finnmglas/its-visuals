"use client"

import { useState, useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Copy } from "lucide-react"
import { cn } from "@/lib/utils"

// --- helper algorithms ---

// Caesar cipher (preserve case, leave non-letters)
function caesar(text: string, shift: number) {
  const s = ((shift % 26) + 26) % 26
  return Array.from(text)
    .map((ch) => {
      const code = ch.charCodeAt(0)
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + s) % 26) + 65)
      }
      if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + s) % 26) + 97)
      }
      return ch
    })
    .join("")
}

// Caesar decrypt (shift inverse)
function caesarDecrypt(text: string, shift: number) {
  return caesar(text, -shift)
}

// Vigenère (classic A=0..Z=25, preserve case, non-letters unchanged)
function vigenere(text: string, key: string, encrypt = true) {
  if (!key) return text
  const cleanKey = key
    .split("")
    .filter((c) => /[A-Za-z]/.test(c))
    .map((c) => c.toUpperCase())
  if (cleanKey.length === 0) return text
  let ki = 0
  return Array.from(text)
    .map((ch) => {
      const code = ch.charCodeAt(0)
      const k = cleanKey[ki % cleanKey.length].charCodeAt(0) - 65
      const s = encrypt ? k : -k
      if (code >= 65 && code <= 90) {
        ki++
        return String.fromCharCode(((code - 65 + s + 26) % 26) + 65)
      }
      if (code >= 97 && code <= 122) {
        ki++
        return String.fromCharCode(((code - 97 + s + 26) % 26) + 97)
      }
      return ch
    })
    .join("")
}

// XOR (text XOR key -> hex). Works on UTF-8 code units (simple, not crypto-grade)
function xorHex(text: string, key: string) {
  if (!key) return ""
  const out: string[] = []
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i)
    const k = key.charCodeAt(i % key.length)
    const x = c ^ k
    out.push(x.toString(16).padStart(2, "0"))
  }
  return out.join("")
}
function xorFromHex(hex: string, key: string) {
  if (!hex) return ""
  const bytes = hex.match(/.{1,2}/g) || []
  let out = ""
  for (let i = 0; i < bytes.length; i++) {
    const b = parseInt(bytes[i], 16)
    const k = key.charCodeAt(i % key.length)
    out += String.fromCharCode(b ^ k)
  }
  return out
}

// Scytale (simple classical transposition).
// Encryption: distribute chars into `rows = key` arrays by i % key, then concat rows
function scytaleEncrypt(text: string, key: number) {
  if (key <= 1) return text
  const rows: string[][] = Array.from({ length: key }, () => [])
  for (let i = 0; i < text.length; i++) {
    rows[i % key].push(text[i])
  }
  return rows.map((r) => r.join("")).join("")
}
// Decrypt: slice ciphertext into rows following counts, then rebuild by taking row.shift() cyclically
function scytaleDecrypt(cipher: string, key: number) {
  if (key <= 1) return cipher
  const len = cipher.length
  // compute counts per row: number of chars sent to row r is floor((len-1-r)/k)+1 if r < len
  const counts: number[] = Array.from({ length: key }, (_, r) =>
    r < len ? Math.floor((len - 1 - r) / key) + 1 : 0
  )
  const rows: string[][] = []
  let idx = 0
  for (let r = 0; r < key; r++) {
    const cnt = counts[r]
    rows[r] = cipher.slice(idx, idx + cnt).split("")
    idx += cnt
  }
  // rebuild original by iterating positions and pulling rows[i % key].shift()
  let out = ""
  for (let i = 0; i < len; i++) {
    const r = i % key
    const ch = rows[r].shift() || ""
    out += ch
  }
  return out
}

// small copy util
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // ignore
  }
}

// --- Component ---

export default function VerschluesselungVonHandPage() {
  // shared
  const [source, setSource] = useState<string>("THE QUICK BROWN FOX jumps 123")
  // Caesar
  const [caesarShift, setCaesarShift] = useState<number>(3)
  const caesarEnc = useMemo(() => caesar(source, caesarShift), [source, caesarShift])
  const caesarDec = useMemo(() => caesarDecrypt(source, caesarShift), [source, caesarShift])

  // Vigenere
  const [vigenereKey, setVigenereKey] = useState<string>("KEY")
  const vigenereEnc = useMemo(() => vigenere(source, vigenereKey, true), [source, vigenereKey])
  const vigenereDec = useMemo(() => vigenere(source, vigenereKey, false), [source, vigenereKey])

  // XOR
  const [xorKey, setXorKey] = useState<string>("secret")
  const xorEnc = useMemo(() => xorHex(source, xorKey), [source, xorKey])
  const xorDec = useMemo(() => xorFromHex(xorEnc, xorKey), [xorEnc, xorKey])

  // Scytale
  const [scytaleKey, setScytaleKey] = useState<number>(4)
  const scytaleEnc = useMemo(() => scytaleEncrypt(source, Math.max(1, Math.floor(scytaleKey))), [source, scytaleKey])
  const scytaleDec = useMemo(() => scytaleDecrypt(scytaleEnc, Math.max(1, Math.floor(scytaleKey))), [scytaleEnc, scytaleKey])

  return (
    <div className="min-h-screen p-6 bg-background text-foreground">
      <h1 className="text-3xl font-semibold mb-6">Verschlüsselung von Hand — interaktive Demos</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quelltext</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Plaintext</Label>
            <Textarea value={source} onChange={(e) => setSource(e.target.value)} className="mb-3" />
            <div className="flex gap-2">
              <Button onClick={() => setSource("")}>Clear</Button>
              <Button variant="secondary" onClick={() => setSource("HELLO FROM FINN — example 42")}>
                Load example
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scytale (Transposition)</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Wicklungsstärke (rows)</Label>
            <Input
              type="number"
              min={1}
              value={scytaleKey}
              onChange={(e) => setScytaleKey(Number(e.target.value || 1))}
              className="mb-3"
            />
            <div className="grid gap-2">
              <div className={cn("rounded p-3 border bg-muted")}>
                <div className="text-sm text-muted-foreground">Verschlüsselt</div>
                <div className="font-mono break-all">{scytaleEnc}</div>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" onClick={() => copyToClipboard(scytaleEnc)}>
                    <Copy className="mr-2 h-4 w-4" /> Copy
                  </Button>
                </div>
              </div>

              <div className={cn("rounded p-3 border bg-muted")}>
                <div className="text-sm text-muted-foreground">Entschlüsselt (Rekonstruiert)</div>
                <div className="font-mono break-all">{scytaleDec}</div>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" onClick={() => copyToClipboard(scytaleDec)}>
                    <Copy className="mr-2 h-4 w-4" /> Copy
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Caesar</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Shift</Label>
            <Input
              type="range"
              min={-25}
              max={25}
              value={caesarShift}
              onChange={(e) => setCaesarShift(Number(e.target.value))}
              className="mb-3"
            />
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm">Shift: {caesarShift}</div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => { setCaesarShift((s) => s - 1) }}>-</Button>
                <Button size="sm" onClick={() => { setCaesarShift((s) => s + 1) }}>+</Button>
              </div>
            </div>

            <div className="rounded p-3 border bg-muted">
              <div className="text-sm text-muted-foreground">Verschlüsselt</div>
              <div className="font-mono break-all">{caesarEnc}</div>
              <div className="mt-2 flex gap-2">
                <Button size="sm" onClick={() => copyToClipboard(caesarEnc)}><Copy className="mr-2 h-4 w-4" />Copy</Button>
              </div>
            </div>

            <div className="rounded p-3 border bg-muted mt-3">
              <div className="text-sm text-muted-foreground">Entschlüsselt (Shift invertiert)</div>
              <div className="font-mono break-all">{caesarDec}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vigenère</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Key</Label>
            <Input value={vigenereKey} onChange={(e) => setVigenereKey(e.target.value)} className="mb-3" />
            <div className="rounded p-3 border bg-muted">
              <div className="text-sm text-muted-foreground">Verschlüsselt</div>
              <div className="font-mono break-all">{vigenereEnc}</div>
              <div className="mt-2 flex gap-2">
                <Button size="sm" onClick={() => copyToClipboard(vigenereEnc)}><Copy className="mr-2 h-4 w-4" />Copy</Button>
              </div>
            </div>

            <div className="rounded p-3 border bg-muted mt-3">
              <div className="text-sm text-muted-foreground">Entschlüsselt (mit Key)</div>
              <div className="font-mono break-all">{vigenereDec}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>XOR (simple)</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Key (byte-wise XOR)</Label>
            <Input value={xorKey} onChange={(e) => setXorKey(e.target.value)} className="mb-3" />
            <div className="rounded p-3 border bg-muted">
              <div className="text-sm text-muted-foreground">Verschlüsselt (hex)</div>
              <div className="font-mono break-all">{xorEnc}</div>
              <div className="mt-2 flex gap-2">
                <Button size="sm" onClick={() => copyToClipboard(xorEnc)}><Copy className="mr-2 h-4 w-4" />Copy hex</Button>
                <Button size="sm" onClick={() => { /* quick check: place decrypted into source */ setSource(xorDec) }}>
                  Load decrypted
                </Button>
              </div>
            </div>

            <div className="rounded p-3 border bg-muted mt-3">
              <div className="text-sm text-muted-foreground">Entschlüsselt (XOR hex → text)</div>
              <div className="font-mono break-all">{xorDec}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
