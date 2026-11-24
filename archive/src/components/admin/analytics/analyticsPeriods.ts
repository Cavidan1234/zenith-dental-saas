export type Period = 'this_week' | 'last_30_days' | 'quarter';

export interface ChartBarItem {
  label: string;
  full: string;
  amount: number;
  height: string;
  appts: number;
}

export interface PeriodStats {
  label: string;
  depositVolume: string;
  depositNum: number;
  depositGrowth: string;
  surgeriesText: string;
  noShowRate: string;
  noShowNum: number;
  noShowRecovered: string;
  averageYield: string;
  yieldNum: number;
  recallRate: string;
  recallNum: number;
  chartBars: ChartBarItem[];
  doctorLeylaHours: string;
  doctorRashadHours: string;
}

export const PERIOD_DATA: Record<Period, PeriodStats> = {
  this_week: {
    label: 'Live Week Roster',
    depositVolume: '$7,870',
    depositNum: 7870,
    depositGrowth: '+24% vs last wk',
    surgeriesText: 'Captured across 68 confirmed surgeries',
    noShowRate: '1.8%',
    noShowNum: 1.8,
    noShowRecovered: 'Recovered ~$3,120 in lost chair time',
    averageYield: '$115.80',
    yieldNum: 115.8,
    recallRate: '84.2%',
    recallNum: 84.2,
    chartBars: [
      { label: 'Mon', full: 'Monday', amount: 1150, height: '63%', appts: 14 },
      { label: 'Tue', full: 'Tuesday', amount: 1420, height: '78%', appts: 17 },
      { label: 'Wed', full: 'Wednesday', amount: 980, height: '54%', appts: 12 },
      { label: 'Thu', full: 'Thursday', amount: 1650, height: '90%', appts: 19 },
      { label: 'Fri', full: 'Friday', amount: 1820, height: '100%', appts: 21 },
      { label: 'Sat', full: 'Saturday', amount: 850, height: '47%', appts: 10 },
    ],
    doctorLeylaHours: '38.5 surgery hours / 42 hrs capacity',
    doctorRashadHours: '34.0 surgery hours / 40 hrs capacity',
  },
  last_30_days: {
    label: 'Past 30 Days (Rolling)',
    depositVolume: '$31,480',
    depositNum: 31480,
    depositGrowth: '+18.4% MoM',
    surgeriesText: 'Captured across 272 confirmed surgeries',
    noShowRate: '1.5%',
    noShowNum: 1.5,
    noShowRecovered: 'Recovered ~$12,480 in lost chair time',
    averageYield: '$118.40',
    yieldNum: 118.4,
    recallRate: '86.1%',
    recallNum: 86.1,
    chartBars: [
      { label: 'Wk 1', full: 'Week 1 (Oct 01-07)', amount: 6900, height: '77%', appts: 62 },
      { label: 'Wk 2', full: 'Week 2 (Oct 08-14)', amount: 7450, height: '83%', appts: 67 },
      { label: 'Wk 3', full: 'Week 3 (Oct 15-21)', amount: 8230, height: '92%', appts: 73 },
      { label: 'Wk 4', full: 'Week 4 (Oct 22-28)', amount: 8900, height: '100%', appts: 79 },
    ],
    doctorLeylaHours: '154.0 surgery hours / 168 hrs capacity',
    doctorRashadHours: '136.0 surgery hours / 160 hrs capacity',
  },
  quarter: {
    label: 'Q1 Comprehensive Audit',
    depositVolume: '$94,440',
    depositNum: 94440,
    depositGrowth: '+31.2% YoY',
    surgeriesText: 'Captured across 816 confirmed surgeries',
    noShowRate: '1.4%',
    noShowNum: 1.4,
    noShowRecovered: 'Recovered ~$37,440 in lost chair time',
    averageYield: '$122.10',
    yieldNum: 122.1,
    recallRate: '88.5%',
    recallNum: 88.5,
    chartBars: [
      { label: 'Jan', full: 'January 2026', amount: 28500, height: '84%', appts: 251 },
      { label: 'Feb', full: 'February 2026', amount: 32100, height: '95%', appts: 279 },
      { label: 'Mar', full: 'March 2026', amount: 33840, height: '100%', appts: 286 },
    ],
    doctorLeylaHours: '462.0 surgery hours / 504 hrs capacity',
    doctorRashadHours: '408.0 surgery hours / 480 hrs capacity',
  },
};
