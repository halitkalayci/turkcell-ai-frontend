# Frontend Architecture Documentation

## Overview

Bu dizin, Turkcell E-Commerce Frontend projesi için mimari dokümantasyonu içerir.

## Tech Stack

- **Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.4
- **Language:** TypeScript 5.9.3
- **Styling:** CSS (Vanilla)
- **State Management:** TBD (Context/Zustand/Jotai)
- **HTTP Client:** fetch (Native)

## Documentation Structure

```
docs/frontend/
├── README.md                    # Bu dosya - genel bakış
├── 01-architecture-layers.md    # Katman mimarisi detayları
├── 02-type-system.md            # Type yönetimi ve SSOT kuralları
├── 03-naming-conventions.md     # Dosya ve kod adlandırma standartları
├── 04-import-rules.md           # Import sıralaması ve sınırlandırmalar
└── 05-code-review-checklist.md  # PR öncesi kontrol listesi
```

## Quick Links

- [AGENTS.md - Section 3: Frontend Architecture](../../AGENTS.md#3-frontend-architecture-mandatory-flow)
- [OpenAPI Contract: Products v1](/docs/openapi/products-v1.yaml)
- [Frontend Workspace](/frontend/)

## Core Principles

1. **Contract-First Development:** OpenAPI spec is the source of truth
2. **Strict Layer Separation:** UI → State → Business → API
3. **Single Source of Truth (SSOT):** No duplicate type definitions
4. **Type Safety First:** Leverage TypeScript strict mode
5. **No Code Invention:** Ask when requirements are unclear

## Getting Started

Yeni geliştiriciler için:

1. [01-architecture-layers.md](01-architecture-layers.md) dosyasını okuyun
2. [02-type-system.md](02-type-system.md) ile type yönetimini öğrenin
3. [03-naming-conventions.md](03-naming-conventions.md) ile dosya yapısını anlayın
4. [04-import-rules.md](04-import-rules.md) ile bağımlılık kurallarını öğrenin
5. Kod yazarken [05-code-review-checklist.md](05-code-review-checklist.md) kullanın

## Contributing

Frontend koduna katkıda bulunurken:

- AGENTS.md Section 3'teki tüm kurallara uyun
- Her PR'da code review checklist'i kontrol edin
- Type'ları asla inline tanımlamayın, `src/types/api/` kullanın
- Katman atlamalarından kaçının (UI → API gibi)
