function mergeIntervals(intervals) {
  if (!Array.isArray(intervals) || intervals.length === 0) return [];

  // Filter out invalid intervals
  intervals = intervals.filter(
    (int) =>
      int &&
      typeof int.start === "number" &&
      typeof int.end === "number" &&
      int.start < int.end
  );

  if (intervals.length === 0) return [];

  intervals.sort((a, b) => a.start - b.start);
  const merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const prev = merged[merged.length - 1];
    const curr = intervals[i];

    if (curr.start <= prev.end) {
      prev.end = Math.max(prev.end, curr.end);
    } else {
      merged.push(curr);
    }
  }

  return merged;
}

module.exports = mergeIntervals;
