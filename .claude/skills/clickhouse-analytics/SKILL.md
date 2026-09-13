---
description: Enforces optimal sorting keys, batch insertion pipelines, and continuous materialized view aggregation.
globs: ["analytics/**/*.sql", "src/analytics/**/*.ts"]
alwaysAvoid:
  - "Executing single-row INSERT statements (which create too many unmerged data parts)"
  - "Sorting keys with high cardinality columns first in the ORDER BY clause"
  - "Using UPDATE or DELETE statements for transactional mutations instead of ReplacingMergeTree"
enforcedStack:
  - "ClickHouse"
  - "Columnar OLAP"
  - "Kafka"
  - "Vector Engines"
---

# Part 1: Metadata & Trigger Scope
- **Skill Name**: ClickHouse Real-Time Analytics Engine
- **File Globs**: `analytics/**/*.sql`, `src/analytics/**/*.ts`
- **Enforced Stack**: ClickHouse, Columnar OLAP, Kafka, Vector Engines
- **Target Runtime**: Claude Code (SKILL.md)

# Part 2: System Boundary & Prohibitions
## Role & Persona
Staff Data Infrastructure & OLAP Engineer.

## Always Avoid (Hard Prohibitions)
1. Executing single-row INSERT statements (which create too many unmerged data parts)
2. Sorting keys with high cardinality columns first in the ORDER BY clause
3. Using UPDATE or DELETE statements for transactional mutations instead of ReplacingMergeTree

## Hard Invariants
1. All insertions must be batched (minimum 5,000 rows or buffer flushed every 2 seconds).
2. MergeTree ORDER BY keys must order by lowest cardinality to highest cardinality.
3. Real-time metrics rollups must use Materialized Views with AggregatingMergeTree.

# Part 3: Master Instruction Prompt
1. Batch Ingestion: Never perform single-row inserts. Buffer in memory or consume from Kafka in batches of 10,000+.
2. Sorting Key Hygiene: Choose ORDER BY (tenant_id, event_type, timestamp) based strictly on filter patterns in query WHERE clauses.
3. Materialized Views: Pre-aggregate hourly and daily statistics automatically into AggregatingMergeTree tables.

# Part 4: Verified Implementation Standard vs Prohibited Anti-Pattern

## Prohibited Anti-Pattern: Single row inserts into ClickHouse
```
// TERRIBLE: Creating a data part per single row will crash ClickHouse with "Too many parts"!
for (const event of events) {
  await clickhouse.insert({
    table: 'events',
    values: [event],
    format: 'JSONEachRow'
  });
}
```

## Verified Production Standard: High-throughput vectorized batch insertion
```
// EFFICIENT: Vectorized batch insert of aggregated buffer
await clickhouse.insert({
  table: 'events',
  values: eventBatchBuffer,
  format: 'JSONEachRow'
});
eventBatchBuffer.length = 0;
```

## Architectural Justification
Batching inserts allows ClickHouse to compress columnar chunks directly into optimal part files on disk.
