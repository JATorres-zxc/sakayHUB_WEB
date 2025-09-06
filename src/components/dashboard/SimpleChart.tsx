import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", revenue: 45000, rides: 1200 },
  { name: "Feb", revenue: 52000, rides: 1400 },
  { name: "Mar", revenue: 48000, rides: 1300 },
  { name: "Apr", revenue: 61000, rides: 1600 },
  { name: "May", revenue: 55000, rides: 1450 },
  { name: "Jun", revenue: 67000, rides: 1750 },
  { name: "Jul", revenue: 73000, rides: 1900 },
  { name: "Aug", revenue: 69000, rides: 1800 },
  { name: "Sep", revenue: 74000, rides: 1950 },
  { name: "Oct", revenue: 78000, rides: 2050 },
  { name: "Nov", revenue: 81000, rides: 2150 },
  { name: "Dec", revenue: 85000, rides: 2250 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-md">
        <p className="text-sm font-medium">{`${label}`}</p>
        <p className="text-sm text-muted-foreground">
          {`Revenue: $${Number(payload[0]?.value || 0).toLocaleString()}`}
        </p>
      </div>
    );
  }
  return null;
};

export function SimpleChart() {
  return (
    <Card className="col-span-4 card-hover">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
            <XAxis 
              dataKey="name" 
              className="text-xs fill-muted-foreground"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              className="text-xs fill-muted-foreground"
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={CustomTooltip} />
            <Bar 
              dataKey="revenue" 
              fill="hsl(var(--chart-1))" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}