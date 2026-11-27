# Package validation

The full catalog was materialized and fully scanned: 1,000,000 unique indexed descriptions across 100 gzip JSONL shards. Every record was parsed, matched against its complete deterministic definition and checked for duplicate IDs; all shard hashes were verified. The source registry, English narrative, links, input preservation, frame timing, dimension constraints and custom lineage were also checked.

See VALIDATION.json, CATALOG_VALIDATION.json, BEHAVIORAL_VALIDATION.json and SELFTEST.json for actual results. Descriptions are self-contained parameterized specifications. Generic text/font/asset requirements must be bound before implementation. Neither native engine projects nor rendered videos were generated, and individual visual quality was not reviewed.

The compact archive intentionally omits materialized catalog shards; it keeps the definitions and executable resolver needed to describe any ID or regenerate the full corpus. A manifest referring to omitted shards describes the validated full dataset, not a claim that the compact archive contains them.
