interface Result {
  totalDistance: number;
  lastDistance: number;
  totalElevation: number;
  totalRunTime: number;
  avgRunPace: number;
  allCoords: number[][];
  titles: string[];
  rawData: {
    activity: {
      distance: string;
      elevation: string;
      movingTime: string;
    };
    geo_json: {
      features: {
        geometry: {
          coordinates: number[][];
        };
      }[];
    };
    activity_id: string;
    date: string;
  }[];
}

export const processData = (data: any): Result => {
  const totalDistance = data.reduce((total: any, activity: any) => {
    const distance = activity.activity.distance.replace("km", "");
    return total + parseFloat(distance);
  }, 0);

  function sumTimes(times: any) {
    let totalSeconds = times.reduce((total: any, time: any) => {
      const parts = time.split(":").reverse();
      let seconds = parseInt(parts[0]) || 0; // seconds
      let minutes = parseInt(parts[1]) || 0; // minutes
      let hours = parseInt(parts[2]) || 0; // hours

      return total + seconds + minutes * 60 + hours * 3600;
    }, 0);

    // Converting total seconds back to hours:minutes:seconds
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;

    return hours;
  }

  function calculateAveragePace(distanceKm: number, timeHours: number): number {
    const paceHoursPerKm = timeHours / distanceKm;
    return paceHoursPerKm * 60;
  }

  const totalRunTime = sumTimes(
    data.map((activity: any) => activity.activity.movingTime)
  );

  const avgRunPace = calculateAveragePace(totalDistance, totalRunTime);

  const totalElevation = data.reduce((total: any, activity: any) => {
    const elevation = activity.activity.elevation.replace("m", "");
    return total + parseFloat(elevation);
  }, 0);

  // Process coords of all activities
  const titles: string[] = [];
  const allCoords: any = data.map((activity: any) => {
    titles.push(activity.date);
    return activity.geo_json.features[0].geometry.coordinates;
  });

  // Get last days distance
  const lastDistance = parseFloat(data[0].activity.distance.replace("km", ""));

  const rawData = data;

  return {
    rawData,
    totalDistance,
    totalElevation,
    lastDistance,
    totalRunTime,
    avgRunPace,
    allCoords,
    titles,
  };
};
