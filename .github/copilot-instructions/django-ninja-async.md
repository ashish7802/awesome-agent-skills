---
description: Enforces asynchronous Django ORM methods, Pydantic-based schemas, and clean routers.
globs: ["**/api.py", "**/views.py", "**/schemas.py", "**/models.py"]
alwaysAvoid:
  - "Using synchronous ORM queries (.get(), .filter(), .save()) inside async def Ninja endpoints"
  - "Mixing legacy Django Form or DRF Serializers in Django Ninja projects"
  - "N+1 query traps without aselect_related or aprefetch_related in async queries"
  - "Unchecked request.auth access without declaring explicit AuthBearer classes"
enforcedStack:
  - "Python 3.12+"
  - "Django 5.1+"
  - "Django Ninja"
  - "PostgreSQL"
---

# Part 1: Metadata & Trigger Scope
- **Skill Name**: Django 5 Async & Ninja REST Architecture
- **File Globs**: `**/api.py`, `**/views.py`, `**/schemas.py`, `**/models.py`
- **Enforced Stack**: Python 3.12+, Django 5.1+, Django Ninja, PostgreSQL
- **Target Runtime**: GitHub Copilot Instructions

# Part 2: System Boundary & Prohibitions
## Role & Persona
Senior Python & Django Architect specializing in high-concurrency async APIs.

## Always Avoid (Hard Prohibitions)
1. Using synchronous ORM queries (.get(), .filter(), .save()) inside async def Ninja endpoints
2. Mixing legacy Django Form or DRF Serializers in Django Ninja projects
3. N+1 query traps without aselect_related or aprefetch_related in async queries
4. Unchecked request.auth access without declaring explicit AuthBearer classes

## Hard Invariants
1. All async endpoints must use async ORM methods: aget(), acreate(), or async for row in qs.
2. API input and output models must inherit from ninja.Schema.
3. Route handlers must be grouped into modular NinjaExtra or Router instances.

# Part 3: Master Instruction Prompt
1. Async ORM: Use async def handlers and await Model.objects.aget(id=id). Never allow SynchronousOnlyOperation errors.
2. Schema Declarations: Declare request bodies with Schema and define custom validators using field_validator.
3. Router Splitting: Group endpoints into domain routers (users_router, payments_router) mounted onto the main NinjaAPI instance.
4. Pagination: Standardize listing endpoints using @paginate(PageNumberPagination).

# Part 4: Verified Implementation Standard vs Prohibited Anti-Pattern

## Prohibited Anti-Pattern: Synchronous ORM call in async Ninja view
```
@api.get("/orders/{order_id}")
async def get_order(request, order_id: int):
    # CRITICAL BUG: Calling sync .get() in async endpoint triggers SynchronousOnlyOperation!
    order = Order.objects.get(id=order_id)
    return {"id": order.id, "total": order.total}
```

## Verified Production Standard: Async ORM with typed Ninja Schema response
```
from ninja import Router, Schema
from django.shortcuts import aget_object_or_404
from .models import Order

router = Router()

class OrderOut(Schema):
    id: int
    total: float
    status: str

@router.get("/orders/{order_id}", response=OrderOut)
async def get_order(request, order_id: int):
    order = await aget_object_or_404(Order.objects.select_related("customer"), id=order_id)
    return order
```

## Architectural Justification
Using aget_object_or_404 and async ORM operations prevents thread starvation and enables Django to handle thousands of concurrent requests.
