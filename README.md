# DSH Runtime Evolution Studio

**An adaptive runtime workspace for AI agents.**

DSH Runtime Evolution Studio is an open-source project exploring how an agent's working environment can be designed, composed, tested, compared, and improved over time.

Instead of giving an agent unrestricted permission to rewrite itself, the project uses a controlled evolution loop:

1. Propose a runtime configuration.
2. Compose approved tools, skills, and workflow components.
3. Validate the configuration in an isolated environment.
4. Compare results against a baseline.
5. Ask for human approval before promoting a change.
6. Keep version history and a rollback path.

> **Status: early prototype (0.1.0).** The current release is a local-first UI prototype. It manages demo environment configurations in browser local storage. It does not execute agents, install plugins, create sandboxes, or connect to DeepSeekHarness yet.

## What is included

- Visual runtime composition workspace.
- Create and switch between environment drafts.
- Enable or disable predefined runtime modules.
- Save configuration snapshots.
- Restore a previous snapshot.
- Compare the current draft with the latest saved configuration.
- Local browser persistence.

## Screens and modules

| Module | Purpose | Status |
|---|---|---|
| Runtime Designer | Define task-specific environments | Prototype UI |
| Dynamic Composer | Compose approved modules | Local configuration only |
| Sandbox Lab | Test changes in isolation | Planned |
| Evolution Analyzer | Compare measured outcomes | Planned |
| Version & Rollback | Track and restore configurations | Local snapshots implemented |
| DSH Adapter | Integrate with DeepSeekHarness | Planned; API compatibility review required |

## Quick start

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

Create a production build:

```bash
npm run build
npm run preview
```

## Project structure

```text
src/
  App.tsx        Main workspace and local state
  main.tsx       React entry point
  styles.css     Responsive dark workspace UI
docs/
  ARCHITECTURE.md
  ROADMAP.md
  SECURITY.md
```

## Design principles

- **Human approval:** proposed changes are not automatically promoted to a live runtime.
- **Isolation first:** experiments must run away from production sessions.
- **Reproducibility:** configurations and experiment inputs should be versioned.
- **Observability:** show what changed and why.
- **Least privilege:** adapters should expose only the capabilities needed by a task.
- **Honest measurement:** distinguish configuration differences from measured runtime outcomes.

## Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md).

## Security

See [docs/SECURITY.md](docs/SECURITY.md). Do not connect untrusted plugins or run generated code in a privileged environment.

## Contributing

Issues and pull requests are welcome. Please include a clear problem statement, reproduction steps, expected behavior, and tests where applicable. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. See [LICENSE](LICENSE).
