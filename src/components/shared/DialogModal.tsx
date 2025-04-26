import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  Label,
  Pie,
  PieChart,
  Bar,
  BarChart,
} from 'recharts';

type DialogModalProps = {
  isOpen: boolean;
  onClose: () => void;
  card: {
    title: string;
    description: string;
    categories?: string[];
    governmentCharts: { party: string; percentage: number }[];
    governmentPercentage: number;
  } | null;
};

const chartConfig = {
  percentage: {
    label: 'Procent głosów',
    color: '#E6736B',
  },
  government: {
    label: 'Rządzący',
    color: '#f1f1f1',
  },
  opposition: {
    label: 'Opozycja',
    color: '#E6736B',
  },
} satisfies ChartConfig;

const DialogModal = ({ isOpen, onClose, card }: DialogModalProps) => {
  if (!card) return null;

  const chartData = card.partyVotes.map(vote => ({
    party: vote.party,
    percentage: vote.percentage,
  }));

  const pieChartData = [
    {
      name: 'Rządzący',
      value: card.governmentPercentage,
      fill: chartConfig.government.color,
    },
    {
      name: 'Opozycja',
      value: 100 - card.governmentPercentage,
      fill: chartConfig.opposition.color,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-auto w-4/5 h-4/5 !max-w-[1000px] !max-h-[800px] rounded-3xl flex flex-col gap-6">
        {' '}
        {/* Te style napisują shadcn temu tak dziwnie */}
        <DialogHeader className="h-fit">
          <DialogTitle className="text-2xl font-bold leading-tight tracking-tighter">
            {card.title}
          </DialogTitle>
          <DialogDescription></DialogDescription>
          <DialogDescription className="text-base font-light dark:text-neutral-100 max-w-4/5">
            {card.description}
          </DialogDescription>
        </DialogHeader>
        {card.categories && card.categories.length > 0 && (
          <div className="flex flex-col space-y-1.5">
            <div className="font-semibold tracking-tight text-xl">
              Kategorie uchwały
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1 h-fit">
              {card.categories.map((category: string, index: number) => (
                <span
                  key={index}
                  className="dark:bg-neutral-700/50 h-fit bg-neutral-600/10 px-2 py-1 text-xs font-medium text-neutral-900 dark:text-neutral-100 rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col space-y-1.5">
          <div className="font-semibold tracking-tight text-xl">
            Wykres szczegółowy
          </div>
          <div className="text-sm text-muted-foreground">
            Procentowy szczegółowy wykres partii głosujących za ustawą.
          </div>
          <div className="flex gap-5 w-full h-auto max-h-80">
            <ChartContainer config={chartConfig} className="w-1/2">
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 20,
                  right: 12,
                  left: 12,
                  bottom: 5,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="party"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar
                  dataKey="percentage"
                  type="natural"
                  fill="var(--color-percentage)"
                  fillOpacity={1}
                  stroke="var(--color-percentage)"
                  strokeWidth={2}
                  radius={8}
                />
              </BarChart>
            </ChartContainer>

            <ChartContainer
              config={chartConfig}
              className="w-1/2 mx-auto aspect-square"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {card.governmentPercentage}%
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Rządzący
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogModal;
