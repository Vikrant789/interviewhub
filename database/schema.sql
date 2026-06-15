-- =============================================
-- InterviewHub Database Schema
-- SQL Server
-- =============================================

-- =============================================
-- Users
-- =============================================

CREATE TABLE Users
(
Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),

```
FirstName NVARCHAR(100) NOT NULL,

LastName NVARCHAR(100) NOT NULL,

Email NVARCHAR(255) NOT NULL UNIQUE,

PasswordHash NVARCHAR(MAX) NOT NULL,

CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE()
```

);

-- =============================================
-- Job Applications
-- =============================================

CREATE TABLE JobApplications
(
Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),

```
UserId UNIQUEIDENTIFIER NOT NULL,

CompanyName NVARCHAR(200) NOT NULL,

RoleName NVARCHAR(200) NOT NULL,

Status NVARCHAR(50) NOT NULL,

Location NVARCHAR(200) NULL,

AppliedDate DATETIME2 NOT NULL,

RecruiterName NVARCHAR(200) NULL,

RecruiterEmail NVARCHAR(255) NULL,

SalaryExpectation DECIMAL(18,2) NULL,

Notes NVARCHAR(MAX) NULL,

CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

UpdatedDate DATETIME2 NULL,

CONSTRAINT FK_JobApplications_Users
    FOREIGN KEY(UserId)
    REFERENCES Users(Id)
```

);

-- =============================================
-- Interview Notes
-- =============================================

CREATE TABLE InterviewNotes
(
Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),

```
JobApplicationId UNIQUEIDENTIFIER NOT NULL,

Question NVARCHAR(MAX) NOT NULL,

Answer NVARCHAR(MAX) NULL,

Topic NVARCHAR(100) NULL,

Difficulty NVARCHAR(50) NULL,

CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

UpdatedDate DATETIME2 NULL,

CONSTRAINT FK_InterviewNotes_JobApplications
    FOREIGN KEY(JobApplicationId)
    REFERENCES JobApplications(Id)
```

);

-- =============================================
-- Indexes
-- =============================================

CREATE INDEX IX_JobApplications_UserId
ON JobApplications(UserId);

CREATE INDEX IX_JobApplications_Status
ON JobApplications(Status);

CREATE INDEX IX_InterviewNotes_JobApplicationId
ON InterviewNotes(JobApplicationId);
