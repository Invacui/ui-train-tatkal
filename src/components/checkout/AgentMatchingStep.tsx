/**
 * @file AgentMatchingStep.tsx
 * @description Step 5: Shows nearby agents on a map and lets the user select one.
 * @module components/checkout
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgentMapView } from "@/components/checkout/AgentMapView";
import { ArrowLeft, ArrowRight, Search, RefreshCw } from "lucide-react";

import type { AgentGeolocation } from "@/types/geolocation.types";

interface AgentMatchingStepProps {
  userLocation: { lat: number; lon: number } | null;
  nearbyAgents: AgentGeolocation[];
  isSearching: boolean;
  selectedAgent: AgentGeolocation | null;
  onAgentSelect: (agent: AgentGeolocation) => void;
  onSearchAgain: () => void;
  onBack: () => void;
  onProceed: () => void;
}

/**
 * AgentMatchingStep
 * @description Fetches nearby agents based on user location and presents them
 *   on a Leaflet map with a selectable list. The user picks an agent before proceeding.
 */
export function AgentMatchingStep({
  userLocation,
  nearbyAgents,
  isSearching,
  selectedAgent,
  onAgentSelect,
  onSearchAgain,
  onBack,
  onProceed,
}: AgentMatchingStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        Agent Matching
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Agent Matching</CardTitle>
            <p className="text-sm text-muted-foreground">
              {nearbyAgents.length > 0
                ? `We found ${nearbyAgents.length} agent${nearbyAgents.length !== 1 ? "s" : ""} near you.`
                : "We are scanning for nearby agents to handle your booking."}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onSearchAgain} disabled={isSearching}>
            <RefreshCw className={`h-4 w-4 mr-1 ${isSearching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <AgentMapView
            agents={nearbyAgents}
            userLocation={userLocation}
            selectedAgentId={selectedAgent?.id}
            onAgentSelect={onAgentSelect}
            isSearching={isSearching}
            onProceed={onProceed}
          />
        </CardContent>
      </Card>

      {/* Selected agent summary */}
      {selectedAgent && (
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Selected Agent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{selectedAgent.agencyName || 'Agent'}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedAgent.distance ?? 0).toFixed(1)} km away
                  {selectedAgent.rating > 0 ? ` · ${selectedAgent.rating} ★` : ''}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedAgent.completedBookings ?? 0} booking{selectedAgent.completedBookings !== 1 ? 's' : ''}
                  {typeof selectedAgent.completionRate === 'number'
                    ? ` · ${selectedAgent.completionRate}% completion rate`
                    : ''}
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">
                Selected
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <Button onClick={onProceed}>
          Proceed to Payment <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
