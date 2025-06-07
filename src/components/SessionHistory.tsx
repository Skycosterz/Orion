import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  LineChart,
  Activity,
  Clock,
  Calendar as CalendarIcon,
} from "lucide-react";

interface SessionData {
  date: Date;
  duration: number; // in minutes
  completed: boolean;
}

const SessionHistory = ({
  sessions = mockSessions,
}: {
  sessions?: SessionData[];
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"calendar" | "stats">("calendar");

  // Calculate stats
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(
    (session) => session.completed,
  ).length;
  const totalMinutes = sessions.reduce(
    (acc, session) => acc + session.duration,
    0,
  );
  const averageSessionLength =
    totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

  // Get sessions for selected date
  const selectedDateSessions = date
    ? sessions.filter(
        (session) => session.date.toDateString() === date.toDateString(),
      )
    : [];

  // Function to highlight dates with sessions
  const isDayWithSession = (day: Date) => {
    return sessions.some(
      (session) => session.date.toDateString() === day.toDateString(),
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-background">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-light tracking-wide">
              Session History
            </CardTitle>
            <div className="flex space-x-2">
              <Tabs
                value={view}
                onValueChange={(v) => setView(v as "calendar" | "stats")}
              >
                <TabsList>
                  <TabsTrigger
                    value="calendar"
                    className="flex items-center gap-2"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    Calendar
                  </TabsTrigger>
                  <TabsTrigger
                    value="stats"
                    className="flex items-center gap-2"
                  >
                    <BarChart className="h-4 w-4" />
                    Statistics
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={view} className="w-full">
            <TabsContent value="calendar" className="mt-0">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="bg-background neu-inset rounded-3xl p-4">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className=""
                      modifiers={{
                        withSession: (day) => isDayWithSession(day),
                      }}
                      modifiersClassNames={{
                        withSession: "bg-primary/20 font-bold neu-flat",
                      }}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    {date
                      ? date.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Select a date"}
                  </h3>

                  {selectedDateSessions.length > 0 ? (
                    <div className="space-y-4">
                      {selectedDateSessions.map((session, index) => (
                        <div
                          key={index}
                          className="p-6 neu-flat rounded-2xl bg-background/50"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {session.date.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <Badge
                              variant={
                                session.completed ? "default" : "outline"
                              }
                            >
                              {session.completed ? "Completed" : "Interrupted"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-muted-foreground" />
                            <span>{session.duration} minutes</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
                      <Activity className="h-12 w-12 mb-2 opacity-20" />
                      <p>No sessions on this date</p>
                      <p className="text-sm">
                        Select a date with a highlighted background to view
                        sessions
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stats" className="mt-0">
              <div className="grid gap-8 md:grid-cols-3">
                <Card className="neu-raised hover:neu-flat transition-all duration-300">
                  <CardContent className="pt-8 text-center">
                    <div className="text-5xl font-light text-primary mb-2">
                      {totalSessions}
                    </div>
                    <p className="text-muted-foreground font-medium">
                      Total Sessions
                    </p>
                  </CardContent>
                </Card>

                <Card className="neu-raised hover:neu-flat transition-all duration-300">
                  <CardContent className="pt-8 text-center">
                    <div className="text-5xl font-light text-primary mb-2">
                      {totalMinutes}
                    </div>
                    <p className="text-muted-foreground font-medium">
                      Total Minutes
                    </p>
                  </CardContent>
                </Card>

                <Card className="neu-raised hover:neu-flat transition-all duration-300">
                  <CardContent className="pt-8 text-center">
                    <div className="text-5xl font-light text-primary mb-2">
                      {averageSessionLength}
                    </div>
                    <p className="text-muted-foreground font-medium">
                      Avg. Minutes per Session
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Completion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">
                          {Math.round(
                            (completedSessions / totalSessions) * 100,
                          ) || 0}
                          %
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {completedSessions} of {totalSessions} sessions
                          completed
                        </span>
                      </div>
                      <Progress
                        value={(completedSessions / totalSessions) * 100 || 0}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Session Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center">
                      <div className="flex items-end justify-between w-full h-full px-2">
                        {/* Mock chart bars - in a real app, use a proper chart library */}
                        {[40, 25, 60, 75, 45, 90, 65].map((height, i) => (
                          <div key={i} className="relative w-8 group">
                            <div
                              className="bg-primary/80 rounded-t-sm w-full transition-all hover:bg-primary"
                              style={{ height: `${height}%` }}
                            />
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6 text-xs text-muted-foreground">
                              {
                                [
                                  "Mon",
                                  "Tue",
                                  "Wed",
                                  "Thu",
                                  "Fri",
                                  "Sat",
                                  "Sun",
                                ][i]
                              }
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Mock data for demonstration
const mockSessions: SessionData[] = [
  { date: new Date(2023, 5, 1, 9, 30), duration: 15, completed: true },
  { date: new Date(2023, 5, 1, 14, 0), duration: 20, completed: false },
  { date: new Date(2023, 5, 3, 10, 15), duration: 30, completed: true },
  { date: new Date(2023, 5, 5, 16, 45), duration: 10, completed: true },
  { date: new Date(2023, 5, 7, 8, 0), duration: 25, completed: true },
  { date: new Date(2023, 5, 7, 18, 30), duration: 15, completed: false },
  { date: new Date(), duration: 20, completed: true },
  { date: new Date(), duration: 15, completed: false },
];

export default SessionHistory;
