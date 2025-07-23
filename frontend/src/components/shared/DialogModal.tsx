/* eslint-disable @typescript-eslint/no-explicit-any */
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
import FixedElement from './FixedElement';

type NewVotes = {
  government: {
    parties: string[];
    votesPercentage: {
      yes: number;
      no: number;
      abstain: number;
      absent: number;
    };
  };
  parties: {
    [party: string]: {
      votes: {
        yes: number;
        no: number;
        abstain: number;
        absent: number;
      };
    };
  };
  summary: {
    yes: number;
    no: number;
  };
};

type DialogModalProps = {
  isOpen: boolean;
  onClose: () => void;
  card: {
    title: string;
    content: string;
    announcement_date: string;
    promulgation: string;
    item_type?: string;
    categories?: string[];
    votes: NewVotes;
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

const truncatePartyName = (name: string): string => {
  if (name.length > 4) {
    return name.slice(0, 4) + '...';
  }
  return name;
};

const DialogModal = ({ isOpen, onClose, card }: DialogModalProps) => {
  const votes = card?.votes;
  const parties = votes?.parties;

  const combinedData = parties
    ? Object.keys(parties).map(party => ({
        party: party,
        yes: parties[party].votes.yes,
        no: parties[party].votes.no,
      }))
    : [];

  const combinedChartConfig = {
    yes: {
      label: 'Liczba głosów za',
      color: chartConfig.percentageYes.color,
    },
    no: {
      label: 'Liczba głosów przeciw',
      color: chartConfig.percentageNo.color,
    },
  };

  const pieChartData = votes?.government?.votesPercentage
    ? [
        {
          name: 'Rządzący',
          value: votes.government.votesPercentage.yes,
          fill: chartConfig.government.color,
        },
        {
          name: 'Opozycja',
          value: 100 - votes.government.votesPercentage.yes,
          fill: chartConfig.opposition.color,
        },
      ]
    : [];

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Brak daty';
    if (dateString == undefined) return 'Brak daty';
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? 'Brak daty'
      : date.toLocaleDateString('pl-PL', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
  };

  const formattedDate = formatDate(card?.announcement_date ?? '');
  const formattedPromulgationDate = formatDate(card?.promulgation ?? '');

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  const isImportant = card?.item_type === 'Ustawa';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`overflow-auto w-11/12 h-11/12 sm:w-4/5 sm:h-4/5 !max-w-[1000px] !max-h-[800px] rounded-3xl flex flex-col gap-6
        ${
          isImportant
            ? '!border-red-500/70 shadow-red-500/10'
            : 'border-neutral-200 dark:border-neutral-700'
        }`}
      >
        <>
          <FixedElement />
          <DialogHeader className="h-fit">
            <DialogTitle className="text-2xl font-bold leading-tight tracking-tighter text-left">
              {card?.title}
            </DialogTitle>
            <DialogDescription></DialogDescription>
            <DialogDescription className="text-base font-light dark:text-neutral-100 md:max-w-4/5 text-left">
              {stripHtml(card?.content ?? '')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col">
            <div className="font-semibold tracking-tight text-xl">
              Odnośnik do pełnej treści aktu
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1 h-fit"></div>
            <a
              href={card?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer inline-flex items-center gap-2 rounded-md text-sm font-medium 
                transition-colors focus-visible:outline-none focus-visible:ring-1 
                focus-visible:ring-ring disabled:pointer-events-none [&_svg]:pointer-events-none 
                [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground hover:bg-transparent 
                hover:underline justify-start w-fit max-w-full truncate relative after:absolute after:block 
                after:h-full after:w-1/6 after:right-0 after:bg-gradient-to-l after:from-background after:to-transparent"
            >
              {card?.title}
            </a>
          </div>
          {card?.categories && card.categories.length > 0 && (
            <div className="flex flex-col space-y-1.5">
              <div className="font-semibold tracking-tight text-xl">
                Akt dotyczy
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1 h-fit">
                {card.categories.map((category: string, index: number) => (
                  <span
                    key={index}
                    className="dark:bg-neutral-700/50 h-fit bg-neutral-600/10 px-2 py-1 text-xs font-medium text-neutral-900 dark:text-neutral-100 rounded-full cursor-default"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            <div className="flex flex-col">
              <div className="font-semibold tracking-tight text-xl">
                Data ogłoszenia aktu
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1 h-fit"></div>
              <span className="text-sm text-muted-foreground">
                {formattedDate}
              </span>
            </div>
            <div className="flex flex-col">
              <div className="font-semibold tracking-tight text-xl">
                Data wejścia aktu w życie
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1 h-fit"></div>
              <span className="text-sm text-muted-foreground">
                {formattedPromulgationDate}
              </span>
            </div>
          </div>
          {votes?.government && (
            <>
              <div className="font-semibold tracking-tight text-xl">
                Wykres głosów za i przeciw
              </div>
              <div className="text-sm text-muted-foreground">
                Wykres słupkowy przedstawia liczbę głosów za oraz przeciw dla
                każdej partii.
              </div>
              <div className="flex flex-col space-y-1.5">
                <div className="flex gap-5 w-full h-auto max-h-80">
                  <ChartContainer
                    config={combinedChartConfig}
                    className="md:w-1/2"
                  >
                    <BarChart
                      accessibilityLayer
                      data={combinedData}
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
                        tickFormatter={truncatePartyName}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dashed" />}
                      />
                      <Bar
                        dataKey="yes"
                        fill="var(--color-yes)"
                        radius={4}
                        minPointSize={2}
                      />
                      <Bar
                        dataKey="no"
                        fill="var(--color-no)"
                        radius={4}
                        minPointSize={2}
                      />
                    </BarChart>
                  </ChartContainer>
                </div>
                <div className="font-semibold tracking-tight text-xl">
                  Rozkład głosów za przyjęciem ustawy
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
                                    {card?.votes.government.votesPercentage.yes.toFixed(
                                      1
                                    )}
                                    %
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
        </>
      </DialogContent>
    </Dialog>
  );
};

export default DialogModal;
