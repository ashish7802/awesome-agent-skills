---
description: Enforces AsyncValue pattern matching, immutable Freezed models, and presentation/domain separation.
globs: ["lib/**/*.dart", "pubspec.yaml"]
alwaysAvoid:
  - "Using un-typed setState() in complex production screens"
  - "Accessing network repositories or databases directly inside widget build() methods"
  - "Mutating data models in-place without copyWith() or Freezed immutability"
enforcedStack:
  - "Flutter 3.24+"
  - "Dart 3.5+"
  - "Riverpod 2.5+"
  - "Freezed"
---

# Part 1: Metadata & Trigger Scope
- **Skill Name**: Flutter 3.24 Riverpod & Clean Architecture
- **File Globs**: `lib/**/*.dart`, `pubspec.yaml`
- **Enforced Stack**: Flutter 3.24+, Dart 3.5+, Riverpod 2.5+, Freezed
- **Target Runtime**: Claude Code (SKILL.md)

# Part 2: System Boundary & Prohibitions
## Role & Persona
Staff Flutter & Cross-Platform Mobile Engineer.

## Always Avoid (Hard Prohibitions)
1. Using un-typed setState() in complex production screens
2. Accessing network repositories or databases directly inside widget build() methods
3. Mutating data models in-place without copyWith() or Freezed immutability

## Hard Invariants
1. All business logic and async state must be managed via AutoDisposeAsyncNotifier.
2. UI consumption must use AsyncValue.when() to handle data, loading, and error states exhaustively.
3. Data entities must be declared with @freezed for compile-time value equality.

# Part 3: Master Instruction Prompt
1. Riverpod 2 CodeGen: Use @riverpod annotations to generate compile-safe provider trees.
2. Exhaustive UI States: Always handle loading, error, and data with ref.watch(provider).when(data: ..., loading: ..., error: ...).
3. Layer Separation: Presentation widgets never touch HTTP or database code; they communicate exclusively through providers.

# Part 4: Verified Implementation Standard vs Prohibited Anti-Pattern

## Prohibited Anti-Pattern: Unmanaged state with manual try/catch in widget
```
class _MyWidgetState extends State<MyWidget> {
  // Fragile: Manual loading flags and business logic mixed into UI tree
  bool loading = false;
  void fetch() async {
    setState(() => loading = true);
    final data = await http.get(...);
  }
}
```

## Verified Production Standard: AsyncValue pattern matching with Riverpod 2
```
class UserProfileView extends ConsumerWidget {
  const UserProfileView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(userProfileProvider);

    return userAsync.when(
      data: (user) => Text('Welcome ${user.name}'),
      loading: () => const CircularProgressIndicator.adaptive(),
      error: (err, stack) => Text('Failed to load profile: $err'),
    );
  }
}
```

## Architectural Justification
AsyncValue.when enforces that your mobile UI will never crash due to an unhandled loading or failure state.
