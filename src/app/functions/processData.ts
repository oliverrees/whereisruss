import length from "@turf/length";

interface Result {
  totalDistance: number;
  lastDistance: number;
  allCoords: number[][];
  titles: string[];
}

export const processData = (data: any): Result => {
  // Get total distance
  const totalDistance = data.reduce((total: any, activity: any) => {
    const distance = length(activity.geo_json);
    return total + distance;
  }, 0);

  // Process coords of all activities
  const titles: string[] = [];
  const allCoords: any = data.map((activity: any) => {
    titles.push(activity.date);
    return activity.geo_json.features[0].geometry.coordinates;
  });

  // Get last days distance
  const lastDistance = length(data[0].geo_json);
  console.log(data[0]);

  // data.map((activity: any) => {
  // // Reverse the first and second numbers in each coordinate pair
  // allCoords.forEach((activity: any) => {
  //   activity.forEach((coordinate: number[]) => {
  //     const temp = coordinate[0];
  //     coordinate[0] = coordinate[1];
  //     coordinate[1] = temp;
  //   });
  // });
  // });

  return {
    totalDistance,
    lastDistance,
    allCoords,
    titles,
  };
};
