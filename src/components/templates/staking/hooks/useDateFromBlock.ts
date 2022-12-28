import { useEffect, useState } from "react";

import { DateData, StakeStructOutputWithStatus } from "../../../../custom-types";

export const useDateFromBlock = (stake: StakeStructOutputWithStatus) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const [data, setData] = useState<DateData>();

  const since = parseInt(stake?.since);
  const timelockInDay = stake?.timelock * 30;

  const fetchAllDates = () => {
    // daysFrom = number of days since the stake was made
    const daysFrom = Math.floor((timestamp - since) / (24 * 3600));
    // left = number of days before the stake unlocks
    const left = timelockInDay - daysFrom;
    const data = { latestTimestamp: timestamp, daysFrom: daysFrom, left: left };

    setData(data);
  };

  useEffect(() => {
    fetchAllDates();
  }, [stake]);

  return data;
};
