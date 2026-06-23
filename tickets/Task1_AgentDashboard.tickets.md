## Task 1: Agent Dashboard Enhancement

>> Build a proper agent dashboard with a dedicated sidebar, real data on overview, profile, and geolocation management.
>> See the full implementation plan at [[api-swagger-openapi-json-i-see-that-fizzy-oasis.md]]

  ## Agent Dashboard Tree (after changes)
    >> /agent
    >> ├── Overview — Real stats from useAgentStats + recent requests + earnings snapshot
    >> ├── Onboard — Agent application form (unchanged)
    >> ├── Requests — Pending booking requests with Accept
    >> ├── Bookings — Agent's bookings list
    >> ├── Bookings/:bookingId — Booking detail with PNR + Ticket upload actions
    >> ├── Stats — Performance metrics
    >> ├── Earnings — Earnings overview
    >> ├── Team — Team management (wire to real API, currently demo)
    >> ├── Profile — View/edit agent profile (NEW)
    >> └── Geolocation — Location management using existing AgentGeolocationForm (NEW)

  ## Files to Create (5)

    >> 1. src/components/layout/AgentSidebar.tsx
    >>    Collapsible sidebar with agent-specific nav items + online/offline toggle.
    >>    Use local useState for collapse (not shared ui.slice).

    >> 2. src/components/layout/AgentTopbar.tsx
    >>    Topbar with agent-specific user dropdown links (copy DashboardTopbar pattern).

    >> 3. src/routes/agent/Profile.tsx
    >>    View/edit agent profile page. Fetch via useAgentProfile(), save via useUpdateAgentProfile.

    >> 4. src/routes/agent/Geolocation.tsx
    >>    Wraps existing AgentGeolocationForm component with PageHeader.

    >> 5. src/hooks/agents/useUpdateAgentProfile.ts
    >>    Mutation hook for PATCH /agents/profile. Invalidates queryKeys.agents.profile() on success.

  ## Files to Modify (6)

    >> 6. src/routes/agent/Layout.tsx
    >>    Replace DashboardSidebar → AgentSidebar, DashboardTopbar → AgentTopbar, wrap in TooltipProvider.

    >> 7. src/routes/agent/Overview.tsx
    >>    Replace placeholder "—" with real data from useAgentStats, useAgentRequests, useAgentEarnings.
    >>    Show stat cards, recent requests with Accept buttons, performance summary.

    >> 8. src/routes/agent/Team.tsx
    >>    Wire addMember form to agentsService.addTeamMember via useMutation.
    >>    Add team member list and remove functionality.

    >> 9. src/routes/agent/BookingDetail.tsx
    >>    Add FileDropzone + useFileUpload for ticket upload with URL fallback.

    >> 10. src/constants/routes.ts
    >>     Add agent.profile and agent.geolocation route constants.

    >> 11. src/Routes.tsx
    >>     Add lazy imports and route entries for Profile and Geolocation pages.

  ## Key Components/Patterns to Reuse
    >> DashboardSidebar.tsx (nav link pattern), DashboardTopbar.tsx (dropdown pattern)
    >> AgentGeolocationForm from components/agents/
    >> UserAddressForm from components/profile/
    >> FileDropzone from components/common/
    >> useFileUpload from hooks/common/

  ## Verification
    >> Agent sidebar shows agent-specific nav. Overview shows real stats. Profile loads and saves.
    >> Online toggle in sidebar calls PATCH endpoint.
    >> Geolocation page renders existing form component.
