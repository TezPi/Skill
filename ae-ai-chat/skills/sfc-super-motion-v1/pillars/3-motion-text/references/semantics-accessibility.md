# Content meaning, typography and readability

Choose motion from semantic intent: explaining, comparing, listing, quoting, naming, emphasizing or introducing a section. Tone and appearance are separate choices. A lower third is a role/layout; neon is appearance; a slide is a mechanism. Industry profiles are authored suggestions, not evidence of market popularity.

Preserve exact text, whitespace, punctuation, values, signs, dates, units, attribution, qualifiers and negation. Keep a number with its unit and a claim with its qualifier in the same readable window. Avoid scramble/odometer values that could be read as real prices or data. Do not turn decorative progress into a fabricated time series.

Unicode code points and user-perceived characters are different. Preserve extended grapheme clusters and joined sequences. Python's standard library is not a complete UAX29 segmenter. Supply boundaries from a suitable segmenter; concatenation must exactly reproduce the source, including punctuation and spaces. A practical JavaScript boundary helper is:

```javascript
const groups = Array.from(
  new Intl.Segmenter(locale, {granularity: 'grapheme'}).segment(text),
  part => part.segment
);
// Write JSON.stringify(groups) to a groups file. Do not normalize or rewrite text silently.
```

Line grouping requires actual font metrics and layout. Semantic/phrase/paired grouping is an editorial decision, not an automatic Intl.Segmenter mode. Whitespace tokens are not guaranteed semantic words for every language.

Provide a reduced/static treatment when appropriate: stable layout, complete content, brief fade/cut and sufficient reading time. Interactive previews may respect prefers-reduced-motion; a rendered MP4 needs a separate reduced version if that option is required. Flash checks and a few spec fields do not establish full WCAG compliance. Check actual luminance/area/timing and delivery context rather than relying only on a frequency label.
