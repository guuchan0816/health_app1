"use client"

import { useState, useEffect } from 'react'
import { Calendar, Activity, List, BarChart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts"

interface SymptomRecord {
  date: string;
  level: number;
}

export function HealthySymptomTrackerComponent() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [level, setLevel] = useState(5)
  const [records, setRecords] = useState<SymptomRecord[]>([])

  useEffect(() => {
    const savedRecords = localStorage.getItem('symptomRecords')
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords))
    }
  }, [])

  const handleSave = () => {
    const newRecord = { date, level }
    const updatedRecords = [...records, newRecord].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    setRecords(updatedRecords)
    localStorage.setItem('symptomRecords', JSON.stringify(updatedRecords))
    alert('記録を保存しました')
  }

  const formatDataForChart = (data: SymptomRecord[]) => {
    return data.map(record => ({
      date: record.date,
      level: record.level
    }))
  }

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-700">健康トラッカー</h1>
      <Card className="mb-8 shadow-lg rounded-xl border-green-200 bg-white">
        <CardHeader className="bg-green-100 rounded-t-xl">
          <CardTitle className="text-green-800 flex items-center">
            <Activity className="mr-2" />
            症状記録
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Label htmlFor="date" className="w-24 text-green-700">日付</Label>
              <div className="relative w-full">
                <Input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pl-10 border-green-300 focus:border-green-500 focus:ring-green-500"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" size={20} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="level" className="text-green-700">症状の程度 (1-10)</Label>
              <Slider
                id="level"
                min={1}
                max={10}
                step={1}
                value={[level]}
                onValueChange={(value) => setLevel(value[0])}
                className="[&_[role=slider]]:bg-green-500"
              />
              <div className="text-center font-bold text-green-700">{level}</div>
            </div>
            <Button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-700">記録を保存</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg rounded-xl border-blue-200 bg-white">
          <CardHeader className="bg-blue-100 rounded-t-xl">
            <CardTitle className="text-blue-800 flex items-center">
              <List className="mr-2" />
              過去の記録
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {records.length > 0 ? (
              <ul className="space-y-2">
                {records.map((record, index) => (
                  <li key={index} className="flex justify-between items-center border-b border-blue-100 pb-2">
                    <span className="text-blue-600">{record.date}</span>
                    <span className="font-bold text-blue-700">レベル: {record.level}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">記録がありません</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-xl border-green-200 bg-white">
          <CardHeader className="bg-green-100 rounded-t-xl">
            <CardTitle className="text-green-800 flex items-center">
              <BarChart className="mr-2" />
              症状レベルの推移
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {records.length > 0 ? (
              <ChartContainer
                config={{
                  level: {
                    label: "症状レベル",
                    color: "hsl(142, 76%, 36%)", // 深い緑色
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formatDataForChart(records)}>
                    <XAxis dataKey="date" stroke="#059669" />
                    <YAxis domain={[1, 10]} stroke="#059669" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="level" stroke="#059669" strokeWidth={2} dot={{ r: 4, fill: "#059669" }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <p className="text-center text-gray-500">データがありません</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
