---
description: Enforces remote state locking, least-privilege IAM policies, and encrypted storage configurations.
globs: ["terraform/**/*.tf", "infra/**/*.tf"]
alwaysAvoid:
  - "Hardcoding credentials or AWS account IDs in .tf files"
  - "Using wildcard action: \"*\" or Resource: \"*\" in IAM policy statements"
  - "Provisioning unencrypted S3 buckets, EBS volumes, or RDS instances"
enforcedStack:
  - "Terraform 1.9+"
  - "AWS Provider 5+"
  - "TFLint"
  - "Terratest"
---

# Part 1: Metadata & Trigger Scope
- **Skill Name**: Terraform AWS Multi-Region Infrastructure
- **File Globs**: `terraform/**/*.tf`, `infra/**/*.tf`
- **Enforced Stack**: Terraform 1.9+, AWS Provider 5+, TFLint, Terratest
- **Target Runtime**: Claude Code (SKILL.md)

# Part 2: System Boundary & Prohibitions
## Role & Persona
Staff Cloud Infrastructure Architect.

## Always Avoid (Hard Prohibitions)
1. Hardcoding credentials or AWS account IDs in .tf files
2. Using wildcard action: "*" or Resource: "*" in IAM policy statements
3. Provisioning unencrypted S3 buckets, EBS volumes, or RDS instances

## Hard Invariants
1. All S3 buckets must enable server-side encryption with KMS and block public access.
2. All resources must inherit standard default_tags (Environment, Owner, Project).
3. Remote backend must use S3 with versioning enabled and DynamoDB state locking.

# Part 3: Master Instruction Prompt
1. IAM Least Privilege: Write granular statements with explicit actions and Resource ARNs. Never use Action: "*".
2. Encryption at Rest: Enable encryption on all storage with kms_key_id.
3. Module Reusability: Separate environments (staging, prod) into root modules referencing shared local or registry modules.

# Part 4: Verified Implementation Standard vs Prohibited Anti-Pattern

## Prohibited Anti-Pattern: Overprivileged IAM policy with wildcard access
```
resource "aws_iam_policy" "bad" {
  name = "app-policy"
  policy = jsonencode({
    Statement = [{
      Action = "*" # DANGEROUS: Grants total account admin access!
      Effect = "Allow"
      Resource = "*"
    }]
  })
}
```

## Verified Production Standard: Scoped IAM policy restricted to specific DynamoDB table ARN
```
resource "aws_iam_policy" "good" {
  name        = "app-dynamodb-access"
  description = "Allows read/write operations strictly on application orders table"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid    = "DynamoDBReadWrite"
      Effect = "Allow"
      Action = [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem"
      ]
      Resource = aws_dynamodb_table.orders.arn
    }]
  })
}
```

## Architectural Justification
Least-privilege IAM prevents lateral movement and catastrophic data loss if an application worker is compromised.
