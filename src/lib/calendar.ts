import { Solar } from 'lunar-javascript';

const beijingFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
});

/** Convert an instant explicitly, without depending on the device's timezone. */
export function getBeijingPillars(instant: Date) {
  const parts = Object.fromEntries(beijingFormatter.formatToParts(instant)
    .filter(part => part.type !== 'literal').map(part => [part.type, part.value]));
  const solar = Solar.fromYmdHms(Number(parts.year), Number(parts.month), Number(parts.day),
    Number(parts.hour), Number(parts.minute), Number(parts.second));
  const eightChar = solar.getLunar().getEightChar();
  // Sect 1: the day pillar changes at 23:00, consistently with the 子 hour.
  // EightChar uses the exact 立春 instant for years and 节 instants for months.
  eightChar.setSect(1);
  return {
    year: eightChar.getYear(), month: eightChar.getMonth(),
    day: eightChar.getDay(), hour: eightChar.getTime(),
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}:${parts.second}`,
  };
}
