# Locked Design System

Project
PharmaInspect AI

Version
1.0 (Locked)

---

# Design Philosophy

PharmaInspect AI is an enterprise-grade AI-powered pharmaceutical quality inspection platform.

The UI should communicate:

• Trust
• Precision
• Professionalism
• Simplicity
• AI-assisted decision making
• Human-in-the-loop validation

The application is intended for QA inspectors, production supervisors, and quality managers working in pharmaceutical manufacturing.

Every screen should prioritize clarity, readability, and efficient workflows over visual complexity.

---

# Design Style

Modern Enterprise Healthcare Dashboard

Characteristics

• Clean
• Professional
• Minimal
• Spacious
• Enterprise SaaS
• AI-first
• Human-centered
• Data-driven
• Responsive
• Accessible
• Consistent

Avoid

• Flashy animations
• Glassmorphism
• Neon colors
• Heavy gradients
• Decorative UI
• Gaming aesthetics

---

# Color Palette (Locked)

Primary
#0EA5E9
Sky Blue

Secondary
#38BDF8
Light Blue

Accent
#10B981
Teal

Background
#F0F9FF
Ice Blue

Surface
#FFFFFF

Text Primary
#075985
Navy Blue

Text Secondary
#64748B

Border
#E0F2FE

Success
#22C55E

Warning
#F59E0B

Danger
#EF4444

Info
#0284C7

Muted
#F8FAFC

---

# Color Usage

Primary

• Primary Buttons
• Active Navigation
• Links
• Charts

Secondary

• Hover States
• Secondary Buttons
• Highlights

Accent

• AI Features
• Success Highlights
• Recommendation Cards
• Positive Indicators

Success

• Passed Inspection
• Approved
• Completed

Warning

• Needs Review
• Human Validation Required

Danger

• Failed Inspection
• Critical Defects
• Validation Errors

Background

Entire application background

Surface

Cards
Dialogs
Tables
Panels

---

# Typography

Use modern sans-serif fonts.

Preferred

• Inter
or
• Geist
or
• IBM Plex Sans

Hierarchy

Page Title

32px

Section Title

24px

Card Title

18px

Body

16px

Caption

14px

Use medium and semibold font weights.

Avoid excessive bold text.

---

# Layout

Use an 8px spacing system.

Large whitespace.

Consistent alignment.

Maximum content width where appropriate.

Sticky sidebar.

Sticky top navigation.

Cards should have generous padding.

---

# Border Radius

Buttons

10px

Cards

14px

Inputs

10px

Dialogs

16px

Images

12px

---

# Shadows

Soft elevation only.

Avoid strong shadows.

Cards

Small shadow

Dialogs

Medium shadow

Dropdowns

Small shadow

---

# Icons

Library

Lucide React

Guidelines

Always pair icons with labels.

Use consistent icon sizing.

20px–24px for navigation.

16px–20px inside tables.

---

# Components

Build reusable components only.

Examples

Button

Card

StatCard

SectionHeader

PageHeader

Sidebar

Navbar

DataTable

Badge

QualityScore

StatusChip

ProgressBar

UploadZone

ChartCard

RecommendationCard

ImagePreview

ChatMessage

ChatInput

LoadingOverlay

Modal

ConfirmationDialog

EmptyState

---

# Buttons

Primary

Filled
Primary Color

Secondary

Outline

Danger

Red

Ghost

Minimal

Loading buttons should display a spinner.

---

# Forms

Consistent spacing.

Large click targets.

Clear labels.

Validation messages below fields.

Never rely on placeholders as labels.

---

# Tables

Enterprise style.

Sticky header.

Hover rows.

Status badges.

Pagination ready.

Search ready.

Filter ready.

---

# Dashboard

Use KPI cards.

Charts should always have legends.

Use Recharts.

Cards should be modular.

Do not overcrowd dashboards.

---

# AI Components

The AI should always feel like an assistant—not an autonomous decision-maker.

Every AI-generated result should clearly indicate:

• AI Finding
• Confidence
• Requires Human Review (when applicable)

AI cards should use the Accent color.

Human review sections should use the Warning color.

Final approved results should use the Success color.

---

# Human Review

Every inspection should support human validation.

Provide dedicated UI for:

• Inspector Notes
• Root Cause
• Corrective Actions
• Final Decision
• Approval Status

The final report should visually distinguish:

AI Findings

↓

Inspector Review

↓

Final Approved Report

---

# Charts

Library

Recharts

Charts should include

Titles

Legends

Tooltips

Responsive layout

Use the project color palette consistently.

---

# Animations

Use subtle transitions only.

Examples

Hover

Fade

Loading

Progress

Avoid excessive animations.

---

# Accessibility

Keyboard friendly

High contrast

Visible focus states

Accessible labels

Responsive layouts

WCAG-friendly color contrast

---

# Code Guidelines

Framework

React

Styling

Tailwind CSS

Icons

Lucide React

Charts

Recharts

Use reusable components.

Avoid inline styles.

Prefer composition over duplication.

Use Tailwind utility classes.

Keep components small and modular.

---

# UI Inspiration

The application should feel similar to:

• Microsoft Fabric
• Azure Portal
• GitHub Enterprise
• Vercel Dashboard
• Grafana
• Linear
• Atlassian Jira

Not similar to:

• Social media apps
• E-commerce websites
• Mobile-first consumer apps
• Gaming dashboards

---

# Overall Experience

The user should immediately feel they are using a professional pharmaceutical quality management platform.

The interface should emphasize:

• Inspection
• Quality
• Compliance
• AI-assisted analysis
• Human validation
• Traceability
• Reliability

Every design decision should reinforce trust, clarity, and operational efficiency.

# UI Priority Order

Every page should follow this visual hierarchy:

1. Page Header
2. Primary KPI Cards
3. Main Workflow
4. Charts / Analytics
5. Detailed Tables
6. AI Insights
7. Human Review
8. Secondary Actions

This hierarchy should remain consistent across all pages.