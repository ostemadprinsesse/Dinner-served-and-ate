---
# 📝 **Running the Project on Windows ARM (Fixing SQLite Installation Issues)**

Dette projekt bruger SQLite som database. Under installation på en Windows ARM‑baseret computer (fx Surface‑modeller med ARM‑processor) opstod der problemer, fordi Node‑pakken `sqlite3` **ikke understøtter Windows ARM64** og derfor fejler under installation.

Her beskrives præcis, hvordan vi fik projektet til at virke — **uden at ændre noget i projektets kode**.
---

## 🚫 Problem: `sqlite3` kan ikke installeres på Windows ARM

Når man kører:

```
npm install
```

fejler installationen med fejl som:

- _“No prebuilt binaries found for sqlite3 on win32/arm64”_
- _“node-gyp rebuild failed”_
- _“ModuleNotFoundError: No module named 'distutils'”_

Årsagen er:

- `sqlite3` kræver native C++ builds
- Windows ARM64 har ingen prebuilds
- Node 20 + Python 3.12+ mangler `distutils`, som `node-gyp` stadig kræver

Derfor kan `sqlite3` **ikke installeres** på Windows ARM.

---

## ✅ Løsning: Fjern `sqlite3` og brug `better-sqlite3` i stedet

For at få projektet til at installere korrekt, gjorde vi følgende:

### 1. Afinstallerede den problematiske driver

```powershell
npm uninstall sqlite3
```

### 2. Installerede en ARM‑kompatibel SQLite‑driver

```powershell
npm install better-sqlite3
```

`better-sqlite3` fungerer på:

- Windows ARM
- Node 18/20
- Uden native build‑fejl
- Uden Python‑afhængigheder

### 3. Ryddede op og installerede projektet igen

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

---

## 🔧 Ingen ændringer i projektets kode

Selve projektets JavaScript/TypeScript‑kode blev **ikke ændret**.  
Fixet bestod udelukkende af at udskifte den SQLite‑driver, der installeres via npm.

---

## 🎉 Resultat

Efter at have skiftet til `better-sqlite3`:

- `npm install` kører uden fejl
- Projektet virker på Windows ARM
- Ingen native builds
- Ingen Python‑fejl
- Ingen node‑gyp problemer

Projektet er nu fuldt kompatibelt med ARM‑baserede Windows‑maskiner.
