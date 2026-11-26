// Compact rows hold the last hint, last assisted solution, first independent solution
// and last interaction as calendar days. Stable slots 0/1 are practice, 2 is stretch, 3 is recall.
const GuideSkills = (() => {
  const catalog = @@GUIDE_CATALOG@@;
  const valid = new Set(catalog.map(u => u.id));
  const day = (d = new Date()) => d.getFullYear()*10000 + (d.getMonth()+1)*100 + d.getDate();
  function dateNumber(n) {
    if (!Number.isInteger(n) || n < 20000101 || n > 21991231) return 0;
    const date = new Date(Math.floor(n/10000),Math.floor(n/100)%100-1,n%100);
    return day(date) === n ? n : 0;
  }
  function merge(...ledgers) {
    const result = {};
    for (const ledger of ledgers) {
      for (const [skill,rows] of Object.entries(ledger || {})) {
        if (!valid.has(skill) || !rows || typeof rows !== 'object') continue;
        for (const [index,row] of Object.entries(rows)) {
          if (!/^[0-3]$/.test(index) || !Array.isArray(row) || row.length !== 4) continue;
          const [hint,aided,solo,attempt] = row.map(dateNumber);
          if (!attempt) continue;
          const unit = result[skill] ||= {};
          const prev = unit[index] || [0,0,0,0];
          unit[index] = [Math.max(prev[0],hint),Math.max(prev[1],aided),
            solo && prev[2] ? Math.min(prev[2],solo) : solo || prev[2],Math.max(prev[3],attempt)];
        }
      }
    }
    return result;
  }
  function status(ledger,id,date=day()) {
    const rows=ledger?.[id] || {};
    const wins=[rows[0]?.[2],rows[1]?.[2]].filter(Boolean);
    const both=wins.length===2 ? Math.max(...wins) : 0;
    const remembered=Boolean(both && rows[3]?.[2]>both);
    const heard=Object.values(rows);
    return {solo:wins.length,supported:heard.filter(row=>row[1]).length,
      stretch:Boolean(rows[2]?.[2]),remembered,recallDue:Boolean(both && both<date && !remembered),
      needsHelp:heard.some(row=>row[0] && (!row[2] || row[0]>row[2]) && row[0]>row[1])};
  }
  return {catalog,merge,status,day};
})();
