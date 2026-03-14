// Mock flight data — no backend needed
export const airlines = [
  { id: 'AI', name: 'Air India', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Air_India_Logo.svg/120px-Air_India_Logo.svg.png', color: '#e63946' },
  { id: 'IND', name: 'IndiGo', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Indigo_Logo.png/120px-Indigo_Logo.png', color: '#0066cc' },
  { id: 'SJ', name: 'SpiceJet', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/SpiceJet_logo.svg/120px-SpiceJet_logo.svg.png', color: '#e63946' },
  { id: 'VIS', name: 'Vistara', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Vistara_Logo.svg/120px-Vistara_Logo.svg.png', color: '#6a4c9c' },
  { id: 'GO', name: 'GoAir', logo: 'https://img.icons8.com/color/96/airplane-mode-on.png', color: '#00b4d8' },
  { id: 'AK', name: 'AirAsia India', logo: 'https://img.icons8.com/color/96/airplane-mode-on.png', color: '#e63946' },
];

const CITIES = [
  { name: 'Chennai', code: 'MAA', aliases: ['chennai', 'MAA', 'madras'] },
  { name: 'Mumbai', code: 'BOM', aliases: ['mumbai', 'BOM', 'bombay'] },
  { name: 'Delhi', code: 'DEL', aliases: ['delhi', 'DEL', 'new delhi', 'nd'] },
  { name: 'Bengaluru', code: 'BLR', aliases: ['bengaluru', 'BLR', 'bangalore', 'blr'] },
  { name: 'Hyderabad', code: 'HYD', aliases: ['hyderabad', 'HYD'] },
  { name: 'Kolkata', code: 'CCU', aliases: ['kolkata', 'CCU', 'calcutta'] },
  { name: 'Pune', code: 'PNQ', aliases: ['pune', 'PNQ'] },
  { name: 'Ahmedabad', code: 'AMD', aliases: ['ahmedabad', 'AMD'] },
  { name: 'Goa', code: 'GOI', aliases: ['goa', 'GOI'] },
  { name: 'Jaipur', code: 'JAI', aliases: ['jaipur', 'JAI'] },
];

const ROUTE_DURATIONS = {
  'MAA-BOM': 135, 'BOM-MAA': 135,
  'MAA-DEL': 165, 'DEL-MAA': 165,
  'MAA-BLR': 60, 'BLR-MAA': 60,
  'MAA-HYD': 70, 'HYD-MAA': 70,
  'MAA-CCU': 150, 'CCU-MAA': 150,
  'BOM-DEL': 120, 'DEL-BOM': 120,
  'BOM-BLR': 90, 'BLR-BOM': 90,
  'BOM-HYD': 80, 'HYD-BOM': 80,
  'DEL-BLR': 150, 'BLR-DEL': 150,
  'DEL-HYD': 130, 'HYD-DEL': 130,
  'DEL-CCU': 110, 'CCU-DEL': 110,
  'BLR-HYD': 65, 'HYD-BLR': 65,
  'GOI-BOM': 70, 'BOM-GOI': 70,
  'GOI-DEL': 140, 'DEL-GOI': 140,
};

function getCityByInput(input) {
  if (!input) return null;
  const lower = input.toLowerCase().trim();
  return CITIES.find(city =>
    city.name.toLowerCase() === lower ||
    city.code.toLowerCase() === lower ||
    city.aliases.some(a => a.toLowerCase() === lower)
  );
}

function addMinutes(time24, mins) {
  const [h, m] = time24.split(':').map(Number);
  const total = h * 60 + m + mins;
  const rh = Math.floor(total / 60) % 24;
  const rm = total % 60;
  return `${String(rh).padStart(2, '0')}:${String(rm).padStart(2, '0')}`;
}

function formatTime12(time24) {
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

function formatDuration(mins) {
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function randomPrice(base) {
  return base + Math.floor(Math.random() * 2000) - 1000;
}

const DEPARTURES = ['05:00', '06:30', '08:00', '09:30', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30', '20:00', '21:30'];
const CLASSES = ['Economy', 'Business', 'First Class'];
const CLASS_MULTIPLIER = { Economy: 1, Business: 2.4, 'First Class': 4.2 };
const BASE_PRICES = { Economy: 3800, Business: 9500, 'First Class': 18000 };

let flightIdCounter = 1;

function generateFlightsForRoute(fromCity, toCity) {
  const routeKey = `${fromCity.code}-${toCity.code}`;
  const duration = ROUTE_DURATIONS[routeKey] || 120;
  const flights = [];

  // Use all 6 airlines
  airlines.forEach((airline, i) => {
    // 2 departures per airline for variety
    const depTimes = [DEPARTURES[i * 2 % DEPARTURES.length], DEPARTURES[(i * 2 + 4) % DEPARTURES.length]];
    depTimes.forEach(dep => {
      const arrival = addMinutes(dep, duration);
      const classType = CLASSES[Math.floor(Math.random() * 2)]; // mostly economy/business
      const basePrice = Math.round(randomPrice(BASE_PRICES[classType]));
      flights.push({
        id: `FL${String(flightIdCounter++).padStart(4, '0')}`,
        flightNumber: `${airline.id}${Math.floor(Math.random() * 900 + 100)}`,
        airline: airline.name,
        airlineId: airline.id,
        airlineColor: airline.color,
        from: fromCity.name,
        fromCode: fromCity.code,
        to: toCity.name,
        toCode: toCity.code,
        departure: dep,
        departureFormatted: formatTime12(dep),
        arrival,
        arrivalFormatted: formatTime12(arrival),
        duration: formatDuration(duration),
        durationMinutes: duration,
        class: classType,
        price: basePrice,
        seatsAvailable: Math.floor(Math.random() * 80 + 10),
        stops: 0,
        stopLabel: 'Non-stop',
        baggage: '15 kg',
        meal: classType !== 'Economy',
        refundable: Math.random() > 0.5,
      });
    });
  });
  return flights;
}

export function searchFlights(from, to, date) {
  if (!from || !to) return [];
  const fromCity = getCityByInput(from);
  const toCity = getCityByInput(to);
  if (!fromCity || !toCity || fromCity.code === toCity.code) return [];

  flightIdCounter = 1;
  const flights = generateFlightsForRoute(fromCity, toCity);

  // Sort by departure time
  return flights.sort((a, b) => a.departure.localeCompare(b.departure));
}

export function getFlightById(id, from, to) {
  if (!from || !to) return null;
  const fromCity = getCityByInput(from);
  const toCity = getCityByInput(to);
  if (!fromCity || !toCity) return null;
  flightIdCounter = 1;
  const flights = generateFlightsForRoute(fromCity, toCity);
  return flights.find(f => f.id === id) || null;
}

export { CITIES };
