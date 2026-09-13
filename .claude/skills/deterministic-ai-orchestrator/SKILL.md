---
description: Enforces reliable LLM function calling, finite agentic loops, and typed output schema contracts.
globs: ["agents/**/*.py","tools/**/*.py","prompts/**/*.md"]
alwaysAvoid:
  - "Executing open-ended while True agent loops without max_iterations circuit breaker"
  - "Allowing LLMs to return free-form unstructured text for machine-consumed pipeline steps"
  - "Providing tool definitions without type annotations or docstring parameter descriptions"
  - "Swallowing tool invocation exceptions without feeding structured error diagnostics back to the agent"
enforcedStack:
  - "Claude 3.7 Sonnet"
  - "Instructor"
  - "Pydantic AI"
  - "OpenAI Agents SDK"
---

# Part 1: Metadata & Trigger Scope
- **Skill Name**: Deterministic AI Agent Orchestrator
- **File Globs**: `agents/**/*.py`, `tools/**/*.py`, `prompts/**/*.md`
- **Enforced Stack**: Claude 3.7 Sonnet, Instructor, Pydantic AI, OpenAI Agents SDK
- **Target Runtime**: Claude Code (SKILL.md)

# Part 2: System Boundary & Prohibitions
## Role & Persona
Chief AI Agent Systems Architect specializing in reliable, hallucination-resistant LLM agents.

## Always Avoid (Hard Prohibitions)
1. Executing open-ended while True agent loops without max_iterations circuit breaker
2. Allowing LLMs to return free-form unstructured text for machine-consumed pipeline steps
3. Providing tool definitions without type annotations or docstring parameter descriptions
4. Swallowing tool invocation exceptions without feeding structured error diagnostics back to the agent

## Hard Invariants
1. All tool definitions must be pure functions with strict Pydantic schemas and input validation.
2. Agent loops must enforce hard limits on maximum steps (max 8) and token budget ceilings.
3. Tool returns must return structured JSON-serializable payloads with status and error fields.

# Part 3: Master Instruction Prompt
1. Schema-First Contracts: All agent outputs must validate against strongly typed Pydantic models via response_model.
2. Circuit Breakers: Set max_steps = 6 and cumulative token budget tracking. Break immediately with fallback state if exceeded.
3. Tool Execution Protocol: Validate inputs before execution. Catch domain exceptions and return { success: false, error: msg } to allow graceful agent recovery.
4. System Prompt Discipline: Zero marketing adjectives. Define deterministic step orders, required inputs, and prohibited outputs.

# Part 4: Verified Implementation Standard vs Prohibited Anti-Pattern

## Prohibited Anti-Pattern: Unchecked agent loop with raw text parsing
```
while True:
    response = model.generate(prompt)
    if "DONE" in response.text:
        break
    tool_call = parse_raw_text(response.text) # Fragile regex parsing!
    execute(tool_call)
```

## Verified Production Standard: Deterministic loop with Pydantic tool call and iteration circuit breaker
```
import instructor
from anthropic import AsyncAnthropic
from pydantic import BaseModel, Field

client = instructor.from_anthropic(AsyncAnthropic())

class AgentDecision(BaseModel):
    action: str = Field(description="Action verb: TOOL_CALL or TERMINATE")
    tool_name: str | None = None
    tool_args: dict | None = None
    final_payload: dict | None = None

MAX_ITERATIONS = 5
for step in range(MAX_ITERATIONS):
    decision: AgentDecision = await client.messages.create(
        model="claude-3-7-sonnet-20250219",
        max_tokens=1024,
        response_model=AgentDecision,
        messages=messages,
    )
    if decision.action == "TERMINATE":
        return decision.final_payload

    result = await execute_tool(decision.tool_name, decision.tool_args)
    messages.append({"role": "user", "content": f"Tool result: {result.model_dump_json()}"})
else:
    raise RuntimeError("Exceeded max step budget of 5 iterations")
```

## Architectural Justification
The good practice guarantees type validation at every hop, bounds execution cost, and terminates gracefully upon limits.
