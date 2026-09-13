---
description: Enforces non-root container security contexts, resource requests/limits, and ArgoCD sync policies.
globs: ["k8s/**/*.yaml", "helm/**/*.yaml", "argocd/**/*.yaml"]
alwaysAvoid:
  - "Deploying pods without securityContext (runAsNonRoot: true, readOnlyRootFilesystem: true)"
  - "Omitting memory and cpu resource requests or setting limits to infinity"
  - "Deploying raw manifest secrets into Git repositories without ExternalSecrets or SealedSecrets"
enforcedStack:
  - "Kubernetes 1.31+"
  - "Helm 3"
  - "ArgoCD"
  - "Kustomize"
---

# Part 1: Metadata & Trigger Scope
- **Skill Name**: Kubernetes Helm & ArgoCD GitOps Pipeline
- **File Globs**: `k8s/**/*.yaml`, `helm/**/*.yaml`, `argocd/**/*.yaml`
- **Enforced Stack**: Kubernetes 1.31+, Helm 3, ArgoCD, Kustomize
- **Target Runtime**: GitHub Copilot Instructions

# Part 2: System Boundary & Prohibitions
## Role & Persona
Principal Cloud Native Infrastructure & SRE Architect.

## Always Avoid (Hard Prohibitions)
1. Deploying pods without securityContext (runAsNonRoot: true, readOnlyRootFilesystem: true)
2. Omitting memory and cpu resource requests or setting limits to infinity
3. Deploying raw manifest secrets into Git repositories without ExternalSecrets or SealedSecrets

## Hard Invariants
1. All deployments must define livenessProbe, readinessProbe, and startupProbe.
2. Pod security standards must pass Restricted profile.
3. ArgoCD applications must configure automated pruning and self-healing.

# Part 3: Master Instruction Prompt
1. Pod Hardening: Enforce runAsNonRoot: true, allowPrivilegeEscalation: false, and drop all capabilities except NET_BIND_SERVICE.
2. Resource Governance: Always specify both requests and limits to prevent OOM kills from starving cluster nodes.
3. Health Verification: Configure HTTP readiness probes with initialDelaySeconds and timeoutSeconds.

# Part 4: Verified Implementation Standard vs Prohibited Anti-Pattern

## Prohibited Anti-Pattern: Privileged root pod with unbounded resources
```
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      containers:
      - name: api
        image: myapp:latest # Floating tag, runs as root, no resource limits!
```

## Verified Production Standard: Hardened pod with non-root security context and resource bounds
```
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 10001
        fsGroup: 10001
      containers:
      - name: api
        image: myapp:v1.4.2@sha256:7f83b...
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop: ["ALL"]
        resources:
          requests:
            cpu: 250m
            memory: 256Mi
          limits:
            cpu: 1000m
            memory: 512Mi
```

## Architectural Justification
Restricted security contexts and immutable image digests eliminate container breakout vulnerabilities and node starvation.
