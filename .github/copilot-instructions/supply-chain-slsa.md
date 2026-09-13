---
description: Enforces immutable Action SHAs, OIDC authentication, Cosign artifact signing, and CycloneDX SBOMs.
globs: [".github/workflows/**/*.yaml",".github/workflows/**/*.yml"]
alwaysAvoid:
  - "Using mutable version tags (e.g. actions/checkout@v4) instead of full immutable commit SHAs"
  - "Storing long-lived static cloud secret keys (AWS_SECRET_ACCESS_KEY) inside GitHub secrets"
  - "Publishing release containers without an accompanying signed SBOM and in-toto provenance attestation"
enforcedStack:
  - "Sigstore Cosign"
  - "GitHub Actions OIDC"
  - "SBOM (CycloneDX)"
  - "Syft"
---

# Part 1: Metadata & Trigger Scope
- **Skill Name**: Supply Chain Hardening & SLSA Level 3
- **File Globs**: `.github/workflows/**/*.yaml`, `.github/workflows/**/*.yml`
- **Enforced Stack**: Sigstore Cosign, GitHub Actions OIDC, SBOM (CycloneDX), Syft
- **Target Runtime**: GitHub Copilot Instructions

# Part 2: System Boundary & Prohibitions
## Role & Persona
Chief Security Officer specializing in CI/CD Supply Chain Hardening.

## Always Avoid (Hard Prohibitions)
1. Using mutable version tags (e.g. actions/checkout@v4) instead of full immutable commit SHAs
2. Storing long-lived static cloud secret keys (AWS_SECRET_ACCESS_KEY) inside GitHub secrets
3. Publishing release containers without an accompanying signed SBOM and in-toto provenance attestation

## Hard Invariants
1. All third-party GitHub Actions must be pinned to full 40-character commit hashes with version comments.
2. Cloud authentications must use short-lived OIDC role assumption with id-token: write.
3. Container images must be signed using keyless Cosign backed by Sigstore Fulcio and Rekor.

# Part 3: Master Instruction Prompt
1. Commit Pinning: Always pin actions to immutable commit SHA: uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2.
2. OIDC Federation: Never create static IAM keys. Use aws-actions/configure-aws-credentials with role-to-assume.
3. SBOM Generation: Run anchore/sbom-action to generate CycloneDX SBOM for all released artifacts.

# Part 4: Verified Implementation Standard vs Prohibited Anti-Pattern

## Prohibited Anti-Pattern: Mutable action tags and long-lived cloud keys
```
- uses: actions/checkout@v4 # VULNERABLE: Tag can be hijacked upstream!
- uses: aws-actions/configure-aws-credentials@v2
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }} # Long-lived secret leak risk!
```

## Verified Production Standard: Pinned immutable SHA with short-lived OIDC token exchange
```
permissions:
  id-token: write # Required for secure OIDC token exchange
  contents: read

steps:
  # Pinned to immutable commit hash to defend against supply chain compromise
  - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
  - uses: aws-actions/configure-aws-credentials@e3ddf4a3c70b8976a20c47d46d07829ac4fe4ec7 # v4.0.2
    with:
      role-to-assume: arn:aws:iam::123456789012:role/github-ci-oidc
      aws-region: us-east-1
```

## Architectural Justification
Pinning commit hashes stops upstream tag hijacking cold, and OIDC eliminates static long-lived credentials.
