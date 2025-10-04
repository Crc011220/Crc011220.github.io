---
icon: pen-to-square
date: 2025-10-03
category:
  - Learning Records
tag:
  - Docker
---

# Docker vs Podman

- Purpose: Podman is a Docker-compatible, daemonless container engine focused on security and compatibility with OCI.
- Security model: Rootless by default via user namespaces; works with SELinux/AppArmor; reduces blast radius compared to a rootful daemon.
- Architecture: No central daemon; containers are regular processes managed by the user; integrates well with `systemd` (generate unit files, manage lifecycle).
- Docker compatibility: Largely CLI-compatible; can run Docker images; `podman build` (powered by Buildah) supports Dockerfiles; optional Docker REST API socket for tooling compatibility.
- Kubernetes integration: First-class pod concept; `podman generate kube` exports manifests; `podman play kube` runs manifests locally; smoother dev→K8s workflows.
- Networking: Uses CNI plugins; rootless networking relies on slirp4netns (some port/MTU limitations); differs from Docker’s default bridge but offers comparable outcomes in most cases.
- Storage: OCI image layout; OverlayFS where available, `fuse-overlayfs` for rootless; supports volumes and image management similar to Docker.
- Compose: Supports `podman-compose`; with the Docker-compatible socket, many `docker compose` workflows can work, though features may vary by version.
- Cross-platform: Native on Linux; macOS/Windows use Podman Machine (a lightweight VM), similar conceptually to Docker Desktop.
- Performance: Lower overhead on Linux without a long-running daemon; on macOS/Windows performance depends on the backing VM.
- Use cases: Security-conscious environments, rootless CI, local K8s-oriented development, and servers where a daemon is undesirable.
- Limitations: No persistent daemon to auto-manage state; some rootless networking constraints; ecosystem around Compose and third-party tools can be uneven versus Docker.