'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { School, Building, CheckCircle, Users } from 'lucide-react';

interface StatsCardsProps {
  totalSchools: number;
  verifiedSchools: number;
  totalLearners: number;
  totalEducators: number;
}

export function StatsCards({
  totalSchools,
  verifiedSchools,
  totalLearners,
  totalEducators,
}: StatsCardsProps) {
  const verificationRate = ((verifiedSchools / totalSchools) * 100).toFixed(1);

  const stats = [
    {
      title: 'Total Schools',
      value: totalSchools.toLocaleString('en-US'),
      icon: School,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Verified Schools',
      value: `${verifiedSchools} (${verificationRate}%)`,
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Total Learners',
      value: totalLearners.toLocaleString('en-US'),
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Total Educators',
      value: totalEducators.toLocaleString('en-US'),
      icon: Building,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
