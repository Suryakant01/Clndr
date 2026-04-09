export const getHeroImage = (date) => {
  const month = date.getMonth();

  const images = [
    // Jan
    'https://images.pexels.com/photos/688660/pexels-photo-688660.jpeg',
    // Feb
    'https://images.pexels.com/photos/301599/pexels-photo-301599.jpeg',
    // Mar
    'https://images.pexels.com/photos/462118/pexels-photo-462118.jpeg',
    // Apr
    'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg',
    // May
    'https://images.pexels.com/photos/2101187/pexels-photo-2101187.jpeg',
    // Jun
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    // Jul
    'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg',
    // Aug
    'https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg',
    // Sep
    'https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg',
    // Oct
    'https://images.pexels.com/photos/6192337/pexels-photo-6192337.jpeg',
    // Nov
    'https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg',
    // Dec
    'https://images.pexels.com/photos/1303098/pexels-photo-1303098.jpeg',
  ];

  return images[month];
};