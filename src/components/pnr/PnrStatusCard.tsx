/**
 * @file PNR Status Card component
 * @module components/pnr/PnrStatusCard
 * @description Full PNR status display: train header, journey details,
 *   passenger manifest table with color-coded statuses, and journey badge.
 *   Entry animation via framer-motion.
 */

import { Train, Calendar, MapPin, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, cn } from '@/lib/utils';
import { PnrJourneyBadge } from './PnrJourneyBadge';
import type { CustomPNRStatusModel } from '@/types/pnr.types';

interface PnrStatusCardProps {
  data: CustomPNRStatusModel;
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const slideIn = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

const slideInDelayed = (delay: number) => ({
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut', delay },
  },
});

/**
 * PnrStatusCard
 * @description Renders the full PNR status display with train info,
 *   passenger manifest table, and journey status badge. Staggered
 *   entry animation via framer-motion.
 */
export function PnrStatusCard({ data }: PnrStatusCardProps) {
  const chartPrepared = !data.chart_preparation_state?.includes('NOT PREPARED');

  const getPassengerStatusColor = (status: string): string => {
    const s = status.toUpperCase();
    if (s.includes('CNF')) return 'text-pnr-confirmed bg-pnr-confirmed/10 border-pnr-confirmed/30';
    if (s.includes('RAC')) return 'text-pnr-rac bg-pnr-rac/10 border-pnr-rac/30';
    if (s.includes('WL') || s.includes('W/L')) return 'text-pnr-waiting bg-pnr-waiting/10 border-pnr-waiting/30';
    if (s.includes('CAN') || s.includes('CANCELLED')) return 'text-pnr-cancelled bg-pnr-cancelled/10 border-pnr-cancelled/30';
    return 'text-muted-foreground bg-muted border-border';
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* ═══ JOURNEY STATUS BADGE ═══ */}
      <motion.div variants={slideIn}>
        <PnrJourneyBadge
          status={data.derived_journey_status}
          chartPrepared={chartPrepared}
        />
      </motion.div>

      {/* ═══ TRAIN INFO CARD ═══ */}
      <motion.div variants={slideInDelayed(0.1)}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Train className="h-5 w-5 text-primary" />
              <span>{data.associated_train_name}</span>
              <span className="font-mono text-sm text-muted-foreground">
                ({data.associated_train_number})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Journey Date
                </span>
                <span className="font-medium">
                  {formatDate(data.journey_commence_date)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  Route
                </span>
                <span className="font-medium">
                  {data.origin_station_code} → {data.destination_station_code}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  Boarding
                </span>
                <span className="font-medium">{data.boarding_station_code}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Class
                </span>
                <span className="font-medium">{data.travel_class_code}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══ PASSENGER MANIFEST ═══ */}
      <motion.div variants={slideInDelayed(0.2)}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-5 w-5 text-primary" />
              Passengers
              <Badge variant="secondary" className="ml-auto text-xs">
                {data.passenger_manifest?.length ?? 0} passenger{(data.passenger_manifest?.length ?? 0) !== 1 ? 's' : ''}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">#</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Booking Status</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Current Status</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Coach</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Berth</th>
                  </tr>
                </thead>
                <tbody>
                  {data.passenger_manifest?.map((p, i) => (
                    <tr
                      key={p.sequence_no ?? i}
                      className={cn(
                        'border-b border-border last:border-0 transition-colors hover:bg-muted/30',
                      )}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {p.sequence_no ?? i + 1}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'inline-block rounded-md border px-2 py-0.5 text-xs font-medium',
                            getPassengerStatusColor(p.booked_status_label),
                          )}
                        >
                          {p.booked_status_label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'inline-block rounded-md border px-2 py-0.5 text-xs font-medium',
                            getPassengerStatusColor(p.current_status_label),
                          )}
                        >
                          {p.current_status_label}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {p.assigned_coach ?? '—'}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {p.assigned_berth != null ? p.assigned_berth : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
