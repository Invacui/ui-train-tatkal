---
name: booking-flow-ux-improvements
description: Improved DeliveryStep address chip UX and auto-add family members in PassengerStep
metadata:
  type: project
---

**DeliveryStep** (`src/components/checkout/DeliveryStep.tsx`):
- The user's saved address is now always shown as a prominent chip/card at the top (if they have one), regardless of the delivery toggle state
- Below it, the "I want home delivery" toggle asks the user whether they want delivery
- If they toggle ON but have no saved address, they're prompted to add one
- The edit address flow opens inline

**PassengerStep / FamilyMemberSelector**:
- `PassengerStep.tsx` — on mount, if family members exist and none are selected, auto-selects all via `onFamilySelectionChange(familyMembers.map(m => m.id))`
- `FamilyMemberSelector.tsx` — redesigned from checkbox list to removable chip UX: selected members display as badges with an X button to remove; unselected members show below with +Add buttons
