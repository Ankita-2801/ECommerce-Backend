import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const createDeliveryDate = async (req, res) => {
  try {
    const { sourceAddress, destAddress } = req.query;
    const API_KEY = process.env.OSM_API_KEY;

    if (!sourceAddress || !destAddress) {
      return res.status(400).json({ message: "Missing source or destination address" });
    }

    // Step 1: Geocode both addresses (convert to coordinates)
    const geocode = async (address) => {
      const geoUrl = `https://api.openrouteservice.org/geocode/search?api_key=${API_KEY}&text=${encodeURIComponent(address)}`;
      const { data } = await axios.get(geoUrl);
      if (!data.features || data.features.length === 0)
        throw new Error(`Address not found: ${address}`);
      const [lon, lat] = data.features[0].geometry.coordinates;
      return { lat, lon };
    };

    const source = await geocode(sourceAddress);
    const dest = await geocode(destAddress);

    // Step 2: Get route distance between coordinates
    const routeUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}`;
    const routeResponse = await axios.post(routeUrl, {
      coordinates: [
        [source.lon, source.lat],
        [dest.lon, dest.lat],
      ],
    });

    const distanceValue = routeResponse.data.routes[0].summary.distance; // in meters
    const durationValue = routeResponse.data.routes[0].summary.duration; // in seconds

    // Step 3: Estimate delivery days based on distance
    let deliveryDays=1;
    if (distanceValue > 20000 && distanceValue <= 50000) deliveryDays = 2;
    else if (distanceValue > 50000 && distanceValue <= 100000) deliveryDays = 5;
    else if (distanceValue > 100000) deliveryDays = 10;

    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + deliveryDays);

    res.json({
    //  source: sourceAddress,
    //  destination: destAddress,
    //  distance: (distanceValue / 1000).toFixed(2) + " km",
    //  estimatedTravelTime: Math.round(durationValue / 60) + " min",
      todayDate: today.toDateString(),
      deliveryDays,
      deliveryDate: deliveryDate.toDateString(),
      
    });
  } catch (err) {
    console.error("Delivery date error:", err.message);
    res.status(500).json({ message: "Failed to calculate delivery date" });
  }
};
