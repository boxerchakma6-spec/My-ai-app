import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
} from 'recharts';
import { TrendingUp, Calendar, ArrowUpRight, BarChart3, Sparkles } from 'lucide-react';

interface DayData {
  date: string;
  dayLabel: string;
  totalEarnings: number;
  ticketEarnings: number;
  trackingEarnings: number;
  listingAndGigEarnings: number;
  tasksCompleted: number;
}

export const DailyPerformanceReport: React.FC = () => {
  const { transactions } = useApp();
  const [selectedMetric, setSelectedMetric] = useState<
    'total' | 'tickets' | 'tracking' | 'listings'
  >('total');

  // Compute 7-day data dynamically including real-time transactions from today
  const chartData = useMemo<DayData[]>(() => {
    // Base historical earnings for previous 6 days
    const baseDays: DayData[] = [
      {
        date: '2026-09-28',
        dayLabel: 'Sep 28',
        totalEarnings: 68.50,
        ticketEarnings: 24.00,
        trackingEarnings: 14.50,
        listingAndGigEarnings: 30.00,
        tasksCompleted: 6,
      },
      {
        date: '2026-09-29',
        dayLabel: 'Sep 29',
        totalEarnings: 94.00,
        ticketEarnings: 42.00,
        trackingEarnings: 22.00,
        listingAndGigEarnings: 30.00,
        tasksCompleted: 8,
      },
      {
        date: '2026-09-30',
        dayLabel: 'Sep 30',
        totalEarnings: 76.50,
        ticketEarnings: 31.50,
        trackingEarnings: 15.00,
        listingAndGigEarnings: 30.00,
        tasksCompleted: 7,
      },
      {
        date: '2026-10-01',
        dayLabel: 'Oct 01',
        totalEarnings: 112.00,
        ticketEarnings: 52.00,
        trackingEarnings: 25.00,
        listingAndGigEarnings: 35.00,
        tasksCompleted: 11,
      },
      {
        date: '2026-10-02',
        dayLabel: 'Oct 02',
        totalEarnings: 135.50,
        ticketEarnings: 48.00,
        trackingEarnings: 32.50,
        listingAndGigEarnings: 55.00,
        tasksCompleted: 13,
      },
      {
        date: '2026-10-03',
        dayLabel: 'Oct 03',
        totalEarnings: 88.00,
        ticketEarnings: 36.50,
        trackingEarnings: 16.50,
        listingAndGigEarnings: 35.00,
        tasksCompleted: 9,
      },
    ];

    // Compute Today (Oct 04) by calculating real-time positive credits
    let todayTicket = 12.00; // Baseline initial ticket
    let todayTracking = 0;
    let todayListingAndGigs = 0;
    let todayTasks = 1;

    transactions.forEach((tx) => {
      if (tx.amount > 0) {
        if (tx.type === 'ticket_bounty') {
          todayTicket += tx.amount;
          todayTasks += 1;
        } else if (tx.type === 'tracking_bounty') {
          todayTracking += tx.amount;
          todayTasks += 1;
        } else if (
          tx.type === 'listing_bounty' ||
          tx.type === 'gig_bounty' ||
          tx.type === 'sale_commission'
        ) {
          todayListingAndGigs += tx.amount;
          todayTasks += 1;
        }
      }
    });

    const todayTotal = todayTicket + todayTracking + todayListingAndGigs;

    const todayData: DayData = {
      date: '2026-10-04',
      dayLabel: 'Today',
      totalEarnings: Number(todayTotal.toFixed(2)),
      ticketEarnings: Number(todayTicket.toFixed(2)),
      trackingEarnings: Number(todayTracking.toFixed(2)),
      listingAndGigEarnings: Number(todayListingAndGigs.toFixed(2)),
      tasksCompleted: todayTasks,
    };

    return [...baseDays, todayData];
  }, [transactions]);

  // Aggregate 7-day stats
  const total7Days = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.totalEarnings, 0);
  }, [chartData]);

  const dailyAverage = useMemo(() => {
    return total7Days / chartData.length;
  }, [total7Days, chartData]);

  const peakDay = useMemo(() => {
    return chartData.reduce(
      (max, curr) => (curr.totalEarnings > max.totalEarnings ? curr : max),
      chartData[0]
    );
  }, [chartData]);

  const getMetricKey = () => {
    switch (selectedMetric) {
      case 'tickets':
        return 'ticketEarnings';
      case 'tracking':
        return 'trackingEarnings';
      case 'listings':
        return 'listingAndGigEarnings';
      default:
        return 'totalEarnings';
    }
  };

  const getMetricColor = () => {
    switch (selectedMetric) {
      case 'tickets':
        return '#fbbf24'; // Amber
      case 'tracking':
        return '#60a5fa'; // Blue
      case 'listings':
        return '#c084fc'; // Purple
      default:
        return '#f59e0b'; // Gold / Warm Amber
    }
  };

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'tickets':
        return 'Support Ticket Bounties';
      case 'tracking':
        return 'Logistics Tracking Bounties';
      case 'listings':
        return 'Listings & Gig Escrow';
      default:
        return 'Total Daily Commission';
    }
  };

  return (
    <div className="bg-stone-900/90 rounded-xl p-5 border border-stone-800 text-stone-100 space-y-5">
      {/* Top Header & Metric Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Daily Performance Report · 7-Day Velocity</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">
            Operator Earnings Trend
          </h3>
        </div>

        {/* Metric Segmented Buttons */}
        <div className="flex items-center gap-1 p-1 bg-stone-800 rounded-lg border border-stone-700/60 overflow-x-auto">
          <button
            onClick={() => setSelectedMetric('total')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              selectedMetric === 'total'
                ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            All Earnings
          </button>
          <button
            onClick={() => setSelectedMetric('tickets')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              selectedMetric === 'tickets'
                ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Support Bounties
          </button>
          <button
            onClick={() => setSelectedMetric('tracking')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              selectedMetric === 'tracking'
                ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Logistics Watch
          </button>
          <button
            onClick={() => setSelectedMetric('listings')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              selectedMetric === 'listings'
                ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Listings & Gigs
          </button>
        </div>
      </div>

      {/* 3 Key Quantitative Summaries */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-stone-800/60 p-3 rounded-lg border border-stone-800">
          <span className="text-[11px] text-stone-400 font-mono block">7-Day Total</span>
          <span className="text-base sm:text-lg font-bold text-white font-mono tabular-nums">
            ${total7Days.toFixed(2)}
          </span>
        </div>
        <div className="bg-stone-800/60 p-3 rounded-lg border border-stone-800">
          <span className="text-[11px] text-stone-400 font-mono block">Daily Run Rate</span>
          <span className="text-base sm:text-lg font-bold text-emerald-400 font-mono tabular-nums">
            ${dailyAverage.toFixed(2)}/day
          </span>
        </div>
        <div className="bg-stone-800/60 p-3 rounded-lg border border-stone-800">
          <span className="text-[11px] text-stone-400 font-mono block">Peak Day</span>
          <span className="text-base sm:text-lg font-bold text-amber-300 font-mono tabular-nums">
            ${peakDay.totalEarnings.toFixed(2)}{' '}
            <span className="text-[11px] text-stone-400 font-normal">({peakDay.dayLabel})</span>
          </span>
        </div>
      </div>

      {/* Recharts Line Chart */}
      <div className="h-60 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
            <XAxis
              dataKey="dayLabel"
              stroke="#78716c"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              axisLine={{ stroke: '#44403c' }}
            />
            <YAxis
              stroke="#78716c"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${val}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as DayData;
                  return (
                    <div className="bg-stone-950 border border-stone-700 p-3 rounded-xl shadow-xl text-xs space-y-1 font-mono">
                      <p className="font-bold text-amber-400">{label} ({data.date})</p>
                      <div className="pt-1 border-t border-stone-800 space-y-0.5 text-stone-300">
                        <div className="flex justify-between gap-4">
                          <span>{getMetricLabel()}:</span>
                          <strong className="text-white tabular-nums font-bold">
                            ${(data[getMetricKey() as keyof DayData] as number).toFixed(2)}
                          </strong>
                        </div>
                        <div className="flex justify-between gap-4 text-stone-400">
                          <span>Total Day Earnings:</span>
                          <span className="tabular-nums">${data.totalEarnings.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between gap-4 text-stone-400">
                          <span>Tasks Fulfilled:</span>
                          <span>{data.tasksCompleted} tasks</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey={getMetricKey()}
              stroke={getMetricColor()}
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#1c1917', stroke: getMetricColor(), strokeWidth: 2 }}
              activeDot={{ r: 6, fill: getMetricColor(), stroke: '#ffffff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-xs text-stone-400 font-mono pt-1 border-t border-stone-800">
        <span>Updates in real-time as you complete customer support & tracking bounties</span>
        <span className="text-emerald-400 flex items-center gap-1 font-semibold">
          <Sparkles className="w-3 h-3" />
          Active Earning Session
        </span>
      </div>
    </div>
  );
};
