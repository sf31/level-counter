# Translations

Keep source text in the app code in English. Mark translatable template text with `i18n`, translatable attributes with the corresponding `i18n-attribute` form (for example, `i18n-title`), and TypeScript strings with `$localize`.

After adding or changing source messages, run:

```sh
npm run i18n:extract
```

For a new message, copy its generated `<trans-unit>` from `src/locale/messages.xlf` into `src/locale/messages.<locale>.xlf`, add its `<target>`, then run:

```sh
npm run build
```

Changing an existing target-language translation means editing only `<target>`; extraction is not needed.

## Notes

- A generated ID can change when source text, structure, or placeholders change.
- Extraction removes obsolete source units, but does not modify translated catalogues; remove stale units there manually.
- Trans-unit order does not affect matching, though matching source order helps maintenance.
- `sourcefile` and `linenumber` context is informational.
- Preserve IDs, placeholders, and their semantic placement.
