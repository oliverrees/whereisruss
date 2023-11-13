import length from "@turf/length";

interface Result {
  totalDistance: number;
  lastDistance: number;
  totalElevation: number;
  allCoords: number[][];
  titles: string[];
}

export const processData = (data: any): Result => {
  // console.log(data, metaData);

  // Add distance to each activity
  const totalDistance = data.reduce((total: any, activity: any) => {
    const distance = activity.activity.distance.replace("km", "");
    return total + parseFloat(distance);
  }, 0);

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

  return {
    totalDistance,
    totalElevation,
    lastDistance,
    allCoords,
    titles,
  };
};
