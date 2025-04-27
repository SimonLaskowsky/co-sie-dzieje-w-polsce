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
    votesYes: {
      partyVotes: { party: string; percentage: number }[];
      governmentPercentage: number;
    };
    votesNo: {
      partyVotes: { party: string; percentage: number }[];
      governmentPercentage: number;
    };
    url: string;
  } | null;
};

const chartConfig = {
  percentageNo: {
    label: 'Procent głosów przeciw',
    color: '#f96d6e',
  },
  percentageYes: {
    label: 'Procent głosów za',
    color: '#f1f1f1',
  },
  government: {
    label: 'Rządzący',
    color: '#f1f1f1',
  },
  opposition: {
    label: 'Opozycja',
    color: '#f96d6e',
  },
} satisfies ChartConfig;

const DialogModal = ({ isOpen, onClose, card }: DialogModalProps) => {
  const chartDataYes = card?.votesYes.partyVotes ?? [];
  const chartDataNo = card?.votesNo.partyVotes ?? [];

  const pieChartData = card
    ? [
        {
          name: 'Rządzący',
          value: card.votesYes.governmentPercentage,
          fill: chartConfig.government.color,
        },
        {
          name: 'Opozycja',
          value: 100 - card.votesYes.governmentPercentage,
          fill: chartConfig.opposition.color,
        },
      ]
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-auto w-4/5 h-4/5 !max-w-[1000px] !max-h-[800px] rounded-3xl flex flex-col gap-6">
        {card && (
          <>
            <DialogHeader className="h-fit">
              <DialogTitle className="text-2xl font-bold leading-tight tracking-tighter">
                {card.title}
              </DialogTitle>
              <DialogDescription></DialogDescription>
              <DialogDescription className="text-base font-light dark:text-neutral-100 md:max-w-4/5">
                {card.description}
              </DialogDescription>
            </DialogHeader>
            {card.categories && card.categories.length > 0 && (
              <div className="flex flex-col space-y-1.5">
                <div className="font-semibold tracking-tight text-xl">
                  Uchwała dotyczy
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
                Odnośnik do pełnej treści uchwały
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1 h-fit"></div>
              <a
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md text-sm font-medium 
                  transition-colors focus-visible:outline-none focus-visible:ring-1 
                  focus-visible:ring-ring disabled:pointer-events-none [&_svg]:pointer-events-none 
                  [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground hover:bg-transparent 
                  hover:underline justify-start w-fit max-w-full truncate relative after:absolute after:block 
                  after:h-full after:w-1/2 after:right-0 after:bg-gradient-to-l after:from-background after:to-transparent"
              >
                {card.title}
              </a>
            </div>
            <div className="flex flex-col space-y-1.5">
              <div className="font-semibold tracking-tight text-xl">
                Wykres głosów za i przeciw
              </div>
              <div className="text-sm text-muted-foreground">
                Wykresy słupkowe przedstawiają procentowy rozkład głosów za oraz
                przeciw.
              </div>
              <div className="flex flex-col md:flex-row gap-5 w-full h-auto max-h-80">
                <ChartContainer config={chartConfig} className="md:w-1/2">
                  <BarChart
                    accessibilityLayer
                    data={chartDataYes}
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
                      fill={chartConfig.percentageYes.color}
                      fillOpacity={1}
                      radius={8}
                    />
                  </BarChart>
                </ChartContainer>
                <ChartContainer config={chartConfig} className="md:w-1/2">
                  <BarChart
                    accessibilityLayer
                    data={chartDataNo}
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
                      fill={chartConfig.percentageNo.color}
                      fillOpacity={1}
                      radius={8}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
              <div className="font-semibold tracking-tight text-xl">
                Rozkład głosów za
              </div>
              <div className="text-sm text-muted-foreground">
                Wykres kołowy przedstawia procentowy rozkład głosów za wśród
                rządzących oraz opozycji.
              </div>
              <div className="flex gap-5 w-full h-auto max-h-80">
                <ChartContainer
                  config={chartConfig}
                  className="md:w-1/2 aspect-square"
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
                                  {card.votesYes.governmentPercentage}%
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DialogModal;
