# ParkWise AI Backend

Intelligent Parking Operations & Occupancy Monitoring Platform backend built with Node.js, Express, MongoDB Atlas, and Mongoose.

---

## Folder Structure

```
backend/
├── config/             # Config variables & Database connector
├── controllers/        # Express route handlers
├── models/             # Mongoose schemas & indexes (User, Vehicle, ParkingLot, ParkingSlot, Booking)
├── routes/             # REST route files split by module
├── middlewares/        # Custom Express middlewares (error handling, validators)
├── services/           # Service layer for clean business logic separation
├── validators/         # Input validators (express-validator schemas)
├── utils/              # Generic utility helper functions
├── package.json        # Dependencies configurations
└── server.js           # Server application bootstrap file
```

---

## Mongoose Database Models & Schema Specifications

### 1. User
Represents vehicle owners and parking managers.
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  postalCode: { type: String, required: true },
  role: { type: String, enum: ["vehicle_owner", "parking_manager"], required: true }
}
```
*Index*: Unique index on `email` to accelerate authentication and uniqueness checks.

### 2. Vehicle
Represents vehicles owned by proprietors.
```javascript
{
  userId: { type: ObjectId, ref: 'User', required: true },
  vehicleNumber: { type: String, required: true, unique: true },
  vehicleType: { type: String, enum: ["Car", "Bike", "SUV", "Truck", "Electric Vehicle"], required: true },
  vehicleColor: { type: String, required: true },
  vehicleModel: { type: String, required: true }
}
```
*Index*: Unique index on `vehicleNumber` for instant OCR plate scanning and identification. Index on `userId` to query a proprietor's vehicles swiftly.

### 3. ParkingLot
Defines a parking garage or parking lot facility.
```javascript
{
  parkingName: { type: String, required: true },
  parkingAddress: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  parkingType: { type: String, enum: ["Public Parking", "Mall Parking", "Office Parking", "Airport Parking", "Residential Parking"], required: true },
  totalCapacity: { type: Number, required: true },
  bikeSlots: { type: Number, required: true },
  carSlots: { type: Number, required: true },
  suvSlots: { type: Number, required: true },
  truckSlots: { type: Number, required: true },
  facilities: { type: [String] },
  createdBy: { type: ObjectId, ref: 'User', required: true }
}
```
*Index*: Index on `city` to filter parking lots by region quickly. Index on `createdBy` to list lots managed by specific managers.

### 4. ParkingSlot
Represents individual spaces within a parking lot.
```javascript
{
  parkingLotId: { type: ObjectId, ref: 'ParkingLot', required: true },
  slotId: { type: String, required: true },
  zone: { type: String, required: true },
  slotType: { type: String, enum: ["Car", "Bike", "SUV", "Truck"], required: true },
  status: { type: String, enum: ["empty", "reserved", "occupied", "maintenance"], default: "empty", required: true }
}
```
*Index*: Unique compound index on `{ parkingLotId: 1, slotId: 1 }` to prevent duplicate slot IDs within the same layout. Index on `status` to filter empty slots.

### 5. Booking
Handles booking transaction details.
```javascript
{
  userId: { type: ObjectId, ref: 'User', required: true },
  vehicleId: { type: ObjectId, ref: 'Vehicle', required: true },
  parkingLotId: { type: ObjectId, ref: 'ParkingLot', required: true },
  slotId: { type: ObjectId, ref: 'ParkingSlot', required: true },
  bookingDate: { type: Date, default: Date.now },
  entryTime: { type: Date, required: true },
  exitTime: { type: Date, required: true },
  bookingStatus: { type: String, enum: ["active", "completed", "cancelled"], default: "active", required: true }
}
```
*Index*: Index on `userId` for search query, index on `parkingLotId` for dashboard metrics, and compound index on `{ bookingStatus: 1, entryTime: 1 }` for chronological reservation validation.

---

## API Contract & Postman Test Payloads

All APIs return response objects matching:
*   **Success**: `{ "success": true, "message": "Message string", "data": { ... } }`
*   **Error**: `{ "success": false, "message": "Error description", "error": { ... } }`

---

### Module 1: Vehicles API

#### 1. Create Vehicle
- **Endpoint**: `POST /api/vehicles`
- **Request Body**:
```json
{
  "userId": "666870df597f8c0500c00001",
  "vehicleNumber": "MH 12 AB 1234",
  "vehicleType": "Car",
  "vehicleColor": "White",
  "vehicleModel": "Tesla Model Y"
}
```

#### 2. Get All Vehicles
- **Endpoint**: `GET /api/vehicles?userId=666870df597f8c0500c00001`
- **Response Data**: Array of vehicles.

#### 3. Update Vehicle
- **Endpoint**: `PUT /api/vehicles/666870df597f8c0500c00002`
- **Request Body**:
```json
{
  "vehicleColor": "Black",
  "vehicleModel": "Tesla Model Y Performance"
}
```

---

### Module 2: Parking Lots API

#### 1. Create Parking Lot
- **Endpoint**: `POST /api/parking-lots`
- **Request Body**:
```json
{
  "parkingName": "Downtown Premium Plaza",
  "parkingAddress": "404 Wall Street, Financial Dist.",
  "city": "Mumbai",
  "postalCode": "400001",
  "contactNumber": "+91 99999 88888",
  "email": "downtown@parkingwise.com",
  "parkingType": "Office Parking",
  "totalCapacity": 150,
  "bikeSlots": 30,
  "carSlots": 100,
  "suvSlots": 15,
  "truckSlots": 5,
  "facilities": ["24x7", "CCTV", "EV Charging"],
  "createdBy": "666870df597f8c0500c00003"
}
```

---

### Module 3: Parking Slots API

#### 1. Create Parking Slot
- **Endpoint**: `POST /api/slots`
- **Request Body**:
```json
{
  "parkingLotId": "666870df597f8c0500c00004",
  "slotId": "A-12",
  "zone": "Floor 1 - Zone A",
  "slotType": "Car",
  "status": "empty"
}
```

---

### Module 4: Bookings API

#### 1. Create Booking
- **Endpoint**: `POST /api/bookings`
- **Request Body**:
```json
{
  "userId": "666870df597f8c0500c00001",
  "vehicleId": "666870df597f8c0500c00002",
  "parkingLotId": "666870df597f8c0500c00004",
  "slotId": "666870df597f8c0500c00005",
  "entryTime": "2026-06-11T13:00:00Z",
  "exitTime": "2026-06-11T16:00:00Z"
}
```
