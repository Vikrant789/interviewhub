                    ┌────────────────────────────┐
                    │        React Frontend      │
                    │  (Dashboard + Kanban UI)   │
                    └─────────────┬──────────────┘
                                  │ REST APIs
                                  ↓
        ┌────────────────────────────────────────────────┐
        │                API LAYER                      │
        │                                                │
        │   Node.js API (Core Orchestration Layer)      │
        │   - Auth (JWT)                                │
        │   - Job Applications CRUD                    │
        │   - User Management                          │
        │                                                │
        │   .NET Core API (Domain Services Layer)       │
        │   - Interview Notes Engine                   │
        │   - Analytics Service                        │
        │   - Reporting APIs                           │
        └───────────────┬──────────────────────────────┘
                        │
                        │ Shared DB Access / Service Calls
                        ↓
        ┌────────────────────────────────────────────────┐
        │                 DATA LAYER                    │
        │                                                │
        │   SQL Server                                 │
        │   - Users                                   │
        │   - Jobs                                    │
        │   - Interviews                              │
        │                                                │
        └────────────────────────────────────────────────┘

        ┌────────────────────────────────────────────────┐
        │             OPTIONAL SERVICES                  │
        │                                                │
        │   Redis Cache (Dashboard stats)               │
        │   Azure Blob Storage (Resume files)           │
        │   Background Worker (Reminders/Cron Jobs)     │
        └────────────────────────────────────────────────┘



=====================================================================================

#FLOW OF SYSTEM (important for interviews)

1. User Login Flow
React → Node.js API → JWT Auth → Response → React stores token
2. Job Application Flow
React → Node.js API → SQL Server → Response → Dashboard Update
3. Interview Notes Flow (.NET Core)
React → .NET Core API → SQL Server → Response → UI update
4. Analytics Flow
React Dashboard → .NET Core Analytics API → SQL Aggregation → Response
5. Optional Background Jobs
Node Worker / .NET Hosted Service
        ↓
Reminder / Follow-up logic
        ↓
Email (future enhancement)