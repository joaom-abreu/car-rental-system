import { useEffect, useState } from "react";
import { getNationalHolidays } from "../services/brasilApiService";

export function useHolidays(startDate, endDate) {
  const [holidays, setHolidays] = useState([]);
  const startYear = startDate?.slice(0, 4);
  const endYear = endDate?.slice(0, 4);

  useEffect(() => {
    if (!startYear || !endYear) {
      return;
    }
    let ignore = false;
    const years = startYear === endYear ? [startYear] : [startYear, endYear];
    Promise.all(years.map(getNationalHolidays))
      .then((lists) => {
        if (!ignore) {
          setHolidays(lists.flat());
        }
      })
      .catch(() => {
        if (!ignore) {
          setHolidays([]);
        }
      });
    return () => {
      ignore = true;
    };
  }, [startYear, endYear]);

  if (!startDate || !endDate) {
    return [];
  }
  return holidays.filter((holiday) => holiday.date >= startDate && holiday.date <= endDate);
}
