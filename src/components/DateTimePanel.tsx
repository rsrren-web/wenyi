import { useEffect, useState } from "react";
import { Solar, Lunar } from "lunar-javascript";

const TIANGAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const DIZHI   = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

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

/** 根据日天干和时辰序号推算时柱干支 */
function calcHourGanZhi(shichenIndex: number, dayGanZhi: string): string {
  const dayGan = dayGanZhi[0];
  const dayGanIdx = TIANGAN.indexOf(dayGan);
  if (dayGanIdx === -1) return '';
  // 甲己→甲 乙庚→丙 丙辛→戊 丁壬→庚 戊癸→壬
  const startStems = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8];
  const hourGanIdx = (startStems[dayGanIdx] + shichenIndex) % 10;
  return TIANGAN[hourGanIdx] + DIZHI[shichenIndex];
}

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
  const lunar = Lunar.fromDate(now) as ReturnType<typeof Lunar.fromDate> & {
    getMonthInGanZhi(): string;
    getDayInGanZhi(): string;
  };

  const solarStr   = `${solar.getYear()}年${solar.getMonth()}月${solar.getDay()}日`;
  const lunarStr   = `${lunar.getYearInGanZhi()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;
  const timeStr    = now.toLocaleTimeString("zh-CN", { hour12: false });

  const hour = now.getHours();
  const shichenIndex  = Math.floor((hour + 1) / 2) % 12;
  const currentShichen = shichenMap[shichenIndex];

  // 四柱
  const yearZhu  = lunar.getYearInGanZhi();
  const monthZhu = lunar.getMonthInGanZhi?.() ?? '';
  const dayZhu   = lunar.getDayInGanZhi?.()   ?? '';
  const hourZhu  = dayZhu ? calcHourGanZhi(shichenIndex, dayZhu) : '';

  if (compact) {
    return (
      <div className="flex items-center justify-between px-5 py-3 border-b border-border text-sm tracking-wider text-foreground/70">
        <span className="text-primary font-medium">{timeStr}</span>
        <span>{solarStr}</span>
        <span>{lunarStr}</span>
        <span className="text-primary">{currentShichen.name} · 五行{currentShichen.element}</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-center px-10 border-r border-border">
      <div className="space-y-8">

        {/* 阳历 + 时间 */}
        <div className="space-y-2">
          <div className="text-xs tracking-[0.35em] text-foreground/55 uppercase">阳历</div>
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
          <div className="text-xs tracking-[0.35em] text-foreground/55 uppercase">四柱干支</div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '年', value: yearZhu  },
              { label: '月', value: monthZhu },
              { label: '日', value: dayZhu   },
              { label: '时', value: hourZhu  },
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
        </div>

      </div>
    </div>
  );
}
