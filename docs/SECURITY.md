# Security model

Runtime Evolution Studio is intended to help people test changes safely. It must not become an unrestricted self-modifying agent.

## Non-negotiable controls

- Never execute generated code in the dashboard process.
- Never install or load a plugin solely because an agent requested it.
- Use explicit capability allowlists and least-privilege credentials.
- Run experiments in disposable, isolated environments.
- Enforce time, memory, network, and filesystem limits at the execution boundary.
- Require human approval before promoting a candidate configuration.
- Keep immutable audit records for proposals, approvals, executions, and rollbacks.
- Redact secrets from logs and exported artifacts.
- Treat tool output, plugin metadata, and retrieved documents as untrusted data.

## Current prototype

The 0.1 UI stores demo configuration data in browser local storage. It does not contact DeepSeekHarness or execute tools. Do not put API keys, passwords, or other secrets into environment names or task descriptions.

## Reporting a vulnerability

Please do not publish exploit details in a public issue. Contact the repository maintainer privately through GitHub's security reporting feature, if enabled.
