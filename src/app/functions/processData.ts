import length from "@turf/length";

interface Activity {
  geo_json: {
    features: {
      properties: {
        name: string;
      };
      geometry: {
        coordinates: number[][];
      };
    }[];
  };
}

interface Result {
  totalDistance: number;
  lastDistance: number;
  allCoords: number[][];
  titles: string[];
}

export const processData = (data: Activity[]): Result => {

  // Get total distance
  const totalDistance = data.reduce((total, activity) => {
    const distance = length(activity.geo_json);
    return total + distance;
  }, 0);

  // Process coords of all activities
  const titles: string[] = [];
  const allCoords: number[][] = data.map((activity) => {
    titles.push(activity.geo_json.features[0].properties.name);
    return activity.geo_json.features[0].geometry.coordinates;
  });

  // Get last days distance
  const lastDistance = length(data[0].geo_json);
  console.log(lastDistance);

  // Reverse the first and second numbers in each coordinate pair
  allCoords.forEach((activity) => {
    activity.forEach((coordinate: number[]) => {
      const temp = coordinate[0];
      coordinate[0] = coordinate[1];
      coordinate[1] = temp;
    });
  });

  return {
    totalDistance,
    lastDistance,
    allCoords,
    titles,
  };
}
