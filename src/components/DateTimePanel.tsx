import { useEffect, useState } from "react";
import { Solar, Lunar } from "lunar-javascript";
import { getBeijingPillars } from "../lib/calendar";

const shichenMap = [
  { name: "子时", time: "23:00-01:00", element: "水", dizhi: "子" },
  { name: "丑时", time: "01:00-03:00", element: "土", dizhi: "丑" },
  { name: "寅时", time: "03:00-05:00", element: "木", dizhi: "寅" },
  { name: "卯时", time: "05:00-07:00", element: "木", dizhi: "卯" },
  { name: "辰时", time: "07:00-09:00", element: "土", dizhi: "辰" },
  { name: "巳时", time: "09:00-11:00", element: "火", dizhi: "巳" },
  { name: "午时", time: "11:00-13:00", element: "火", dizhi: "午" },
  { name: "未时", time: "13:00-15:00", element: "土", dizhi: "未" },
  { name: "申时", time: "15:00-17:00", element: "金", dizhi: "申" },
  { name: "酉时", time: "17:00-19:00", element: "金", dizhi: "酉" },
  { name: "戌时", time: "19:00-21:00", element: "土", dizhi: "戌" },
  { name: "亥时", time: "21:00-23:00", element: "水", dizhi: "亥" },
];

interface Props {
  compact?: boolean;
}

export function DateTimePanel({ compact = false }: Props) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const solar = Solar.fromDate(now);
  const lunar = Lunar.fromDate(now);

  const solarStr   = `${solar.getYear()}年${solar.getMonth()}月${solar.getDay()}日`;
  const lunarStr   = `${lunar.getYearInGanZhi()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;
  const timeStr    = now.toLocaleTimeString("zh-CN", { hour12: false });

  const hour = now.getHours();
  const shichenIndex  = Math.floor((hour + 1) / 2) % 12;
  const currentShichen = shichenMap[shichenIndex];

  const pillars = getBeijingPillars(now);

  if (compact) {
    return (
      <div className="border-b border-border px-4 py-3 text-foreground/70">
        <div className="mb-1 text-xs text-foreground/70">设备当地时间</div>
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-xl font-light tracking-widest text-primary tabular-nums whitespace-nowrap">
            {timeStr}
          </span>
          <span className="text-xs tracking-wide text-foreground/60 whitespace-nowrap">
            {solarStr}
          </span>
        </div>

        <div className="mt-2 grid grid-cols-1 gap-1.5 border-t border-border/60 pt-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-3">
          <span className="min-w-0 text-xs tracking-wide text-foreground/60">
            农历 · {lunarStr}
          </span>
          <span className="text-xs tracking-wide text-primary whitespace-nowrap">
            {currentShichen.name} · {currentShichen.time} · {currentShichen.element}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full border-r border-border px-6 py-10 xl:px-10">
      <div className="flex h-full flex-col justify-center space-y-7">

        {/* 阳历 + 时间 */}
        <div className="space-y-2">
          <div className="text-xs tracking-[0.2em] text-foreground/75">阳历 · 设备当地时间</div>
          <div className="text-base tracking-wide text-foreground/75">{solarStr}</div>
          <div className="text-3xl font-light tracking-widest text-primary tabular-nums">{timeStr}</div>
        </div>

        <div className="w-8 h-px bg-border" />

        {/* 农历 */}
        <div className="space-y-2">
          <div className="text-xs tracking-[0.35em] text-foreground/55 uppercase">农历</div>
          <div className="text-lg tracking-wide text-foreground/80">{lunarStr}</div>
        </div>

        <div className="w-8 h-px bg-border" />

        {/* 时辰 */}
        <div className="space-y-2">
          <div className="text-xs tracking-[0.35em] text-foreground/55 uppercase">时辰</div>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-medium text-primary tracking-wider">{currentShichen.name}</span>
            <span className="text-sm text-foreground/55 pb-1">五行属{currentShichen.element}</span>
          </div>
          <div className="text-sm text-foreground/50 tracking-wider">{currentShichen.time}</div>
        </div>

        <div className="w-8 h-px bg-border" />

        {/* 四柱 */}
        <div className="space-y-3">
          <div className="text-xs tracking-[0.2em] text-foreground/80">四柱干支 · 北京时间</div>
          <div className="text-xs text-foreground/75 tabular-nums">{pillars.date} {pillars.time}（UTC+8）</div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '年', value: pillars.year },
              { label: '月', value: pillars.month },
              { label: '日', value: pillars.day },
              { label: '时', value: pillars.hour },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 py-3 border border-border bg-card/50">
                <span className="text-[10px] tracking-[0.25em] text-foreground/45">{label}</span>
                <span className="text-base font-medium text-foreground/90 tracking-wide leading-snug">
                  {value[0] ?? ''}
                </span>
                <span className="text-base text-primary/80 tracking-wide leading-snug">
                  {value[1] ?? ''}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs leading-relaxed text-foreground/75">按立春交接换年、节交接换月，23:00 子初换日；不作真太阳时校正。</p>
        </div>

      </div>
    </div>
  );
}
