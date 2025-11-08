import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { subDays, format, isSameDay } from 'date-fns';
import Card, { CardHeader, CardContent } from '../common/Card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { SUBJECTS } from '../../constants';
import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon } from '../icons/Icons';
import type { Task } from '../../types';

const StudyHeatmap = () => {
    const { tasks } = useAppContext();
    const [selectedDay, setSelectedDay] = useState<{ date: Date; tasks: Task[]; minutes: number } | null>(null);
    const today = new Date();
    // Use a longer period to ensure full weeks are shown
    const days = Array.from({ length: 91 }, (_, i) => subDays(today, i)).reverse();

    const tasksByDay = tasks.reduce((acc, task) => {
        if (task.status === 'completed' && task.completedAt) {
            const dayKey = format(new Date(task.completedAt), 'yyyy-MM-dd');
            if (!acc[dayKey]) acc[dayKey] = [];
            acc[dayKey].push(task);
        }
        return acc;
    }, {} as Record<string, Task[]>);

    const calendarData = days.map(day => {
        const dayKey = format(day, 'yyyy-MM-dd');
        const tasksOnDay = tasksByDay[dayKey] || [];
        const totalMinutes = tasksOnDay.reduce((sum, task) => sum + task.estimatedTime, 0);
        return { date: day, minutes: totalMinutes, tasks: tasksOnDay };
    });
    
    const firstDay = calendarData[0]?.date;
    const startingDayOfWeek = firstDay ? firstDay.getDay() : 0; // 0 = Sunday

    // Calculate color saturation based on minutes (0-480 minutes max for 8 hours)
    const getColorStyle = (minutes: number) => {
        if (minutes === 0) {
            return { backgroundColor: 'rgba(156, 163, 175, 0.3)' }; // Light gray
        }
        // Normalize to 0-1 scale (assuming max 480 minutes = 8 hours)
        const maxMinutes = 480;
        const intensity = Math.min(minutes / maxMinutes, 1);
        
        // Base green color with increasing saturation
        // Light color for low minutes, bright color for high minutes
        const hue = 142; // Green hue
        const saturationPercent = 40 + (intensity * 60); // 40% to 100% saturation
        const lightness = 70 - (intensity * 30); // 70% to 40% lightness (darker = more saturated)
        const opacity = 0.4 + (intensity * 0.6); // 0.4 to 1.0 opacity
        
        return {
            backgroundColor: `hsla(${hue}, ${saturationPercent}%, ${lightness}%, ${opacity})`,
        };
    }
    
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div>
            <h3 className="font-semibold mb-2">Study Time Heatmap (Last 90 Days)</h3>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-light-text-secondary dark:text-dark-text-secondary mb-2">
                {weekdays.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2 justify-items-center items-center">
                {Array.from({ length: startingDayOfWeek }).map((_, i) => <div key={`empty-${i}`} />)}
                {calendarData.map((day, index) => {
                    const colorStyle = getColorStyle(day.minutes);
                    return (
                        <div
                            key={index}
                            className="w-3 h-3 rounded-full cursor-pointer transition-all hover:scale-125"
                            style={colorStyle}
                            title={`${format(day.date, 'MMM d, yyyy')}: ${day.minutes} mins`}
                            onClick={() => setSelectedDay(day)}
                        />
                    );
                })}
            </div>

             <AnimatePresence>
                {selectedDay && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedDay(null)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md"
                        >
                            <Card className="shadow-2xl">
                                <CardHeader className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-bold">{format(selectedDay.date, 'EEEE, MMMM d')}</h3>
                                        <p className="text-sm font-mono text-primary">{selectedDay.minutes} minutes studied</p>
                                    </div>
                                    <button onClick={() => setSelectedDay(null)} className="p-2 rounded-full hover:bg-light-background dark:hover:bg-dark-background">
                                        <XMarkIcon className="w-6 h-6"/>
                                    </button>
                                </CardHeader>
                                <CardContent className="max-h-[60vh] overflow-y-auto">
                                    {selectedDay.tasks.length > 0 ? (
                                        <ul className="space-y-2">
                                            {selectedDay.tasks.map(task => (
                                                <li key={task.id} className="p-3 rounded-lg bg-light-background dark:bg-dark-background/50">
                                                    <p className="font-semibold">{task.title}</p>
                                                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{task.subject} • {task.estimatedTime} min</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-center text-light-text-secondary dark:text-dark-text-secondary py-4">No tasks completed on this day.</p>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SubjectDistributionChart = () => {
    const { tasks } = useAppContext();
    const completedTasks = tasks.filter(t => t.status === 'completed');

    const data = SUBJECTS.map(subject => ({
        name: subject.name,
        value: completedTasks.filter(t => t.subject === subject.name).reduce((sum, task) => sum + task.estimatedTime, 0),
        color: subject.color.replace('bg-', '').replace('-500', ''),
    })).filter(d => d.value > 0);

    const colors = data.map(d => {
        const colorMap: { [key: string]: string } = {
            blue: '#3b82f6', green: '#22c55e', yellow: '#eab308', red: '#ef4444',
            purple: '#8b5cf6', pink: '#ec4899', indigo: '#6366f1', cyan: '#06b6d4',
            teal: '#14b8a6', orange: '#f97316', lime: '#84cc16', fuchsia: '#d946ef',
        };
        return colorMap[d.color] || '#8884d8';
    });

    if (data.length === 0) return <p className="text-center text-light-text-secondary dark:text-dark-text-secondary">No completed tasks yet.</p>;

    return (
        <div>
            <h3 className="font-semibold mb-2">Subject Time Distribution</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />)}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const WeeklyPerformanceChart = () => {
    const { tasks } = useAppContext();
    const data = Array.from({length: 7}, (_, i) => {
        const day = subDays(new Date(), 6 - i);
        const tasksCompleted = tasks.filter(t => t.status === 'completed' && t.completedAt && isSameDay(new Date(t.completedAt), day)).length;
        return {
            name: format(day, 'EEE'),
            tasks: tasksCompleted
        };
    });

    return (
        <div>
            <h3 className="font-semibold mb-2">Weekly Performance (Tasks Completed)</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="tasks" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};


const Analytics: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-bold">Analytics</h2>
      </CardHeader>
      <CardContent className="space-y-8">
        <StudyHeatmap />
        <div className="grid md:grid-cols-2 gap-8">
            <SubjectDistributionChart />
            <WeeklyPerformanceChart />
        </div>
      </CardContent>
    </Card>
  );
};

export default Analytics;