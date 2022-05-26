import axios from "axios";
const getLocations = async (args) => {
  const pageSize = args.pageSize ? args.pageSize : 1000;
  const pageIndex = args.pageIndex ? args.pageIndex : 0;
  const textSearch = args.textSearch ? args.textSearch : "";

  const locationsResult = await axios.get(
    `http://localhost:2020/data/locations?pageSize=${pageSize}&index=${pageIndex}&textSearch=${textSearch}`
  );
  return locationsResult.data;
};

const getLocation = async (locationId) => {
  const locationsResult = await axios.get(
    `http://localhost:2020/data/locations/location?locationId=${locationId}`
  );
  return locationsResult.data;
};

const getLocationWithData = async (locationId) => {
  const locationsResult = await axios.get(
    `http://localhost:2020/data/locations/location-with-data?locationId=${locationId}`
  );
  return locationsResult.data;
};

const submitLocationPicker = async (data) => {
  const result = await axios.post(
    "http://localhost:2020/data/locations/submit-location-picker",

    { location: data }
  );
  return result.data.locationId;
};

export { getLocations, getLocation, getLocationWithData, submitLocationPicker };
