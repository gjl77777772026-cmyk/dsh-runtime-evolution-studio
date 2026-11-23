# Architecture

## 0.1 prototype boundary

The first release is a client-side configuration workbench. React owns the presentation and interaction state. Browser `localStorage` persists environment drafts and snapshots.

No runtime process is started. No plugin is installed. No agent tool is invoked. This boundary is intentional: the UI and data model can be validated before connecting to an external runtime.

## Target architecture

```text
┌───────────────────────────────────────────────────────────┐
│                         Dashboard                          │
│  Environment Designer · History · Comparison · Insights   │
└──────────────────────────────┬────────────────────────────┘
                               │ typed requests
┌──────────────────────────────▼────────────────────────────┐
│                       Studio Core                          │
│  Runtime Designer · Composer · Analyzer · Version Manager │
└───────────────┬──────────────────────────┬────────────────┘
                │                          │
       ┌────────▼────────┐        ┌────────▼────────┐
       │ Policy Engine   │        │ Experiment API  │
       │ allowlists      │        │ run / evaluate  │
       │ approvals       │        │ compare results │
       └────────┬────────┘        └────────┬────────┘
                │                          │
       ┌────────▼──────────────────────────▼────────┐
       │              Adapter Boundary              │
       │       DeepSeekHarness / other runtimes      │
       └──────────────────────┬─────────────────────┘
                              │
                   ┌──────────▼──────────┐
                   │ Isolated execution │
                   │ sandbox / container│
                   └─────────────────────┘
```

## Core domain objects

- **Environment:** a named task-oriented runtime configuration.
- **Module:** an approved capability reference, such as a tool, skill, or agent role.
- **Snapshot:** an immutable record of a configuration at a point in time.
- **Experiment:** a reproducible run with an input, environment snapshot, policy, and measured outcome.
- **Promotion:** a human-approved operation that makes a validated configuration available to a target runtime.

## Planned evolution loop

1. Receive a task brief and constraints.
2. Generate a proposed environment plan.
3. Validate module identifiers, permissions, dependencies, and compatibility.
4. Create an isolated experiment from an immutable snapshot.
5. Execute only explicitly approved capabilities.
6. Evaluate against task-specific success criteria.
7. Present evidence, cost, latency, and differences from baseline.
8. Request approval before promotion.
9. Record the decision and retain a rollback target.

## Adapter contract direction

The DSH adapter should be isolated behind a stable internal interface. It must not assume that upstream plugin APIs are stable. Pin a supported DeepSeekHarness version, perform capability detection, and fail closed when a required contract is unknown.
