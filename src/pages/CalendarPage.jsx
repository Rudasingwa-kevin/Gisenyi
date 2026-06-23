import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Circle } from 'lucide-react';
import { API_BASE } from '../utils/api';
import SEO from '../components/SEO';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const TYPE_COLORS = {
  event: '#C9A84C',
  note: '#4A90D9',
  reminder: '#E8593C',
  holiday: '#2D8A5E'
};

const CalendarPage = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [items, setItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE}/api/calendar?month=${currentMonth + 1}&year=${currentYear}`).then(r => r.ok ? r.json() : []),
      fetch(`${API_BASE}/api/events`).then(r => r.ok ? r.json() : [])
    ]).then(([calItems, evts]) => {
      setItems(calItems);
      setEvents(evts);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [currentMonth, currentYear]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [startOffset, daysInMonth]);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
    setSelectedDay(null);
  };

  const goToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDay(null);
  };

  const getItemsForDay = (day) => {
    if (!day) return [];
    const calItems = items.filter(i => {
      const d = new Date(i.date);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth && d.getDate() === day;
    });
    const dayEvents = events.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth && d.getDate() === day;
    }).map(e => ({ ...e, type: 'event', color: TYPE_COLORS.event, _isRealEvent: true }));
    return [...calItems, ...dayEvents];
  };

  const isToday = (day) => {
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  };

  const selectedItems = selectedDay ? getItemsForDay(selectedDay) : [];

  return (
    <div className="min-h-screen bg-navy-950 pt-24 md:pt-28 px-4 sm:px-6 pb-16 md:pb-20">
      <SEO
        title="Events Calendar"
        description="Plan your visit to Gisenyi with our events calendar. See what's happening on the shores of Lake Kivu — festivals, markets, and more."
        url="/calendar"
        type="website"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Gisenyi Events Calendar',
          description: 'Interactive calendar for events in Gisenyi, Rwanda',
          applicationCategory: 'TravelApplication',
          url: 'https://gisenyi.top/calendar',
        }}
      />
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 md:mb-10">
          <span className="text-[10px] font-poppins font-bold text-gold-500 uppercase tracking-[0.3em] mb-3 md:mb-4 block">Plan Your Visit</span>
          <h2 className="font-sora text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Events <span className="text-gold-500">Calendar</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl border border-white/5 overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/5">
                <div className="flex items-center gap-2 md:gap-4">
                  <button onClick={prevMonth} className="w-9 md:w-10 h-9 md:h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
                    <ChevronLeft className="w-4 md:w-5 h-4 md:h-5" />
                  </button>
                  <h3 className="font-sora text-base md:text-xl font-bold text-white">
                    {MONTHS[currentMonth]} <span className="text-gold-500">{currentYear}</span>
                  </h3>
                  <button onClick={nextMonth} className="w-9 md:w-10 h-9 md:h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
                    <ChevronRight className="w-4 md:w-5 h-4 md:h-5" />
                  </button>
                </div>
                <button onClick={goToday} className="px-3 md:px-4 py-1.5 md:py-2 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-500 font-poppins font-semibold text-[9px] md:text-[10px] uppercase tracking-[0.15em] hover:bg-gold-500 hover:text-navy-900 transition-all">
                  Today
                </button>
              </div>

              <div className="p-3 md:p-6">
                <div className="grid grid-cols-7 mb-2">
                  {DAYS.map(d => (
                    <div key={d} className="text-center text-[10px] font-poppins font-bold text-white/30 uppercase tracking-[0.15em] py-2">{d}</div>
                  ))}
                </div>

                {loading ? (
                  <div className="grid grid-cols-7 gap-0.5 md:gap-1">
                    {Array.from({ length: 35 }).map((_, i) => (
                      <div key={i} className="aspect-square rounded-xl bg-white/5 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-7 gap-0.5 md:gap-1">
                    {calendarDays.map((day, i) => {
                      const dayItems = getItemsForDay(day);
                      const isSelected = selectedDay === day;
                      return (
                        <button
                          key={i}
                          disabled={!day}
                          onClick={() => setSelectedDay(day)}
                          className={`min-h-[44px] md:aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-200 ${
                            !day ? 'invisible' :
                            isSelected ? 'bg-gold-500/20 border border-gold-500/40' :
                            isToday(day) ? 'bg-gold-500/10 border border-gold-500/20' :
                            'bg-white/5 hover:bg-white/10 border border-transparent'
                          }`}
                        >
                          <span className={`font-sora text-xs md:text-sm font-bold ${isSelected ? 'text-gold-500' : isToday(day) ? 'text-gold-500' : 'text-white/70'}`}>
                            {day}
                          </span>
                          {dayItems.length > 0 && (
                            <div className="flex gap-0.5 flex-wrap justify-center px-1">
                              {dayItems.slice(0, 3).map((_, idx) => (
                                <span key={idx} className="w-1 h-1 rounded-full bg-gold-500/70" />
                              ))}
                              {dayItems.length > 3 && (
                                <span className="text-[7px] md:text-[8px] font-poppins font-bold text-white/40">+{dayItems.length - 3}</span>
                              )}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="glass rounded-2xl border border-white/5 p-6 h-full">
              <h3 className="font-sora text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold-500" />
                {selectedDay ? `${MONTHS[currentMonth]} ${selectedDay}, ${currentYear}` : 'Select a day'}
              </h3>

              {selectedDay && selectedItems.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="w-10 h-10 text-white/10 mx-auto mb-3" />
                  <p className="text-white/30 font-inter text-sm">No events or notes for this day</p>
                </div>
              )}

              {selectedDay && selectedItems.length > 0 && (
                <div className="space-y-3">
                  {selectedItems.map(item => {
                    const color = item.color || TYPE_COLORS[item.type] || '#C9A84C';
                    const content = (
                      <div className="flex items-start gap-3">
                        <Circle className="w-3 h-3 mt-1 shrink-0" fill={color} stroke="none" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-poppins font-bold text-white/40 uppercase tracking-[0.1em]">{item.type}</span>
                            {item.time && (
                              <span className="text-[10px] font-inter text-white/30 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {item.time}
                              </span>
                            )}
                          </div>
                          <h4 className="font-sora font-bold text-white text-sm mb-1">{item.title}</h4>
                          {item.description && (
                            <p className="font-inter text-xs text-white/50 line-clamp-2">{item.description}</p>
                          )}
                          {item.location && (
                            <p className="font-inter text-[11px] text-white/30 flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" /> {item.location}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                    return item._isRealEvent ? (
                      <Link
                        key={item.id}
                        to={`/events?highlight=${item.id}`}
                        className="block p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold-500/30 transition-all group"
                      >
                        {content}
                      </Link>
                    ) : (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
                      >
                        {content}
                      </motion.div>
                    );
                  })}
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-white/5">
                <h4 className="text-[10px] font-poppins font-bold text-white/30 uppercase tracking-[0.15em] mb-3">Legend</h4>
                <div className="space-y-2">
                  {Object.entries(TYPE_COLORS).map(([type, color]) => (
                    <div key={type} className="flex items-center gap-2">
                      <Circle className="w-2.5 h-2.5" fill={color} stroke="none" />
                      <span className="text-xs font-inter text-white/40 capitalize">{type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
