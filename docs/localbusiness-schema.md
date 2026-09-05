# LocalBusiness / OnlineStore schema — ready to fill

Not published yet, deliberately. Every field below needs a real, verifiable
value; a fabricated address or phone number in structured data is worse than no
structured data at all, because Google cross-checks NAP (name, address, phone)
against other sources and inconsistency damages local ranking.

## Which type applies

- **`LocalBusiness`** (or the narrower `Store`) — only if customers can visit a
  physical location. It *requires* a street address and opening hours.
- **`OnlineStore`** — if Filaverse ships but has no premises customers visit.
  This is probably the right type, and it needs no street address.

Pick one. Do not publish both.

## What to collect first

| Field | Where it comes from |
|---|---|
| Legal name | KBO/BCE registration |
| `vatID` | BE0xxx.xxx.xxx |
| `taxID` | Company/enterprise number |
| Street, postcode, city | Registered or shipping address |
| `telephone` | In international format, e.g. `+32 3 123 45 67` |
| `email` | Public customer address |
| `openingHoursSpecification` | Only if customers can visit |
| `sameAs` | Real social profile URLs only |

## Template

Fill every `TODO`, delete any line you cannot verify, then paste into the
`@graph` array in `index.html` and add `"@id"` cross-references.

```json
{
  "@type": "OnlineStore",
  "@id": "https://www.filaverse.be/#store",
  "name": "TODO legal name",
  "url": "https://www.filaverse.be/",
  "logo": "https://www.filaverse.be/assets/img/favicon-512.png",
  "image": "https://www.filaverse.be/assets/img/filaverse-social-share.jpg",
  "description": "Filament, 3D-printers en accessoires voor makers, scholen en bedrijven.",
  "email": "TODO",
  "telephone": "TODO +32...",
  "vatID": "TODO BE0...",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "TODO",
    "postalCode": "TODO",
    "addressLocality": "TODO",
    "addressCountry": "BE"
  },
  "areaServed": { "@type": "Country", "name": "België" },
  "currenciesAccepted": "EUR",
  "sameAs": ["TODO real profile URLs, or delete this line"]
}
```

If you use `LocalBusiness` instead, add `geo` (latitude/longitude) and
`openingHoursSpecification`, and make sure the address exactly matches your
Google Business Profile — character for character.

## Do not add

- `AggregateRating` or `Review` — there is no verified review data.
- `Offer` with a price — no catalogue prices are published.
- `FAQPage` — the FAQ answers on the homepage are not signed off yet.

Structured data that describes something not visible on the page is a
guidelines violation, not a shortcut.
