from flask import Flask, request, jsonify
from ultralytics import YOLO
import os
import requests

app = Flask(__name__)

# Backend URL configuration
BACKEND_URL = os.getenv(
    "BACKEND_URL",
    "https://parkwise-ai-c9wx.onrender.com"
)

# Load YOLO model
model_path = os.path.join(os.path.dirname(__file__), "best.pt")
print(f"Loading YOLO model from {model_path}...")
model = YOLO(model_path)
print("Model loaded successfully.")

@app.route("/")
def health():
    return jsonify({
        "success": True,
        "message": "ParkWise AI Service Running"
    })

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    if not data or "imagePath" not in data:
        return jsonify({"error": "imagePath is required in JSON payload"}), 400
    
    image_path = data["imagePath"]
    parking_lot_id = data.get("parkingLotId")
    
    # Handle both relative and absolute paths cleanly
    normalized_path = os.path.abspath(image_path)
    
    if not os.path.exists(normalized_path):
        return jsonify({"error": f"Image file not found at: {image_path}"}), 404
    
    try:
        # Run prediction using YOLOv8
        results = model.predict(source=normalized_path, conf=0.25, save=False, verbose=False)
        
        empty_count = 0
        occupied_count = 0
        
        for result in results:
            if result.boxes is not None:
                for box in result.boxes:
                    cls = int(box.cls[0].item())
                    if cls == 0:
                        empty_count += 1
                    elif cls == 1:
                        occupied_count += 1
        
        total_count = empty_count + occupied_count
        
        # Sync with Node.js backend if parkingLotId is provided
        sync_success = True
        sync_error = None
        slots_synced = False
        slots_sync_error = None
        
        if parking_lot_id:
            # 1. Update Analytics (from Phase 2)
            try:
                analytics_url = f"{BACKEND_URL}/api/analytics/update"
                analytics_payload = {
                    "parkingLotId": parking_lot_id,
                    "emptySlots": empty_count,
                    "occupiedSlots": occupied_count,
                    "totalSlots": total_count
                }
                response = requests.post(analytics_url, json=analytics_payload, timeout=5)
                if response.status_code != 200:
                    sync_success = False
                    sync_error = f"Analytics Node backend returned status {response.status_code}: {response.text}"
            except Exception as ex:
                sync_success = False
                sync_error = str(ex)
                
            # 2. Synchronize Slots (Phase 4)
            try:
                # Fetch current slots for the lot
                slots_url = f"{BACKEND_URL}/api/slots?parkingLotId={parking_lot_id}"
                slots_response = requests.get(slots_url, timeout=5)
                if slots_response.status_code == 200:
                    slots_data = slots_response.json().get("data", [])
                    # Extract and sort slot IDs
                    slot_ids = sorted([s["slotId"] for s in slots_data if "slotId" in s])
                    
                    if slot_ids:
                        detections = []
                        for i, slot_id in enumerate(slot_ids):
                            # Mark the first `occupied_count` slots as occupied
                            is_occupied = (i < occupied_count)
                            detections.append({
                                "slotId": slot_id,
                                "isOccupied": is_occupied
                            })
                        
                        # Sync with Node backend
                        sync_slots_url = f"{BACKEND_URL}/api/slots/sync-occupancy"
                        sync_payload = {
                            "parkingLotId": parking_lot_id,
                            "detections": detections
                        }
                        sync_response = requests.post(sync_slots_url, json=sync_payload, timeout=5)
                        if sync_response.status_code == 200:
                            slots_synced = True
                        else:
                            slots_sync_error = f"Slot sync endpoint returned status {sync_response.status_code}: {sync_response.text}"
                    else:
                        slots_sync_error = "No slots found in database for this parking lot"
                else:
                    slots_sync_error = f"Failed to fetch slots from Node backend: status {slots_response.status_code}"
            except Exception as ex:
                slots_sync_error = str(ex)
            
            if sync_success:
                print(f"Successfully synchronized analytics for lot {parking_lot_id} with Node backend.")
            else:
                print(f"Failed to synchronize analytics for lot {parking_lot_id}: {sync_error}")
                
            if slots_synced:
                print(f"Successfully synchronized slot occupancy for lot {parking_lot_id} with Node backend.")
            else:
                print(f"Failed to synchronize slot occupancy for lot {parking_lot_id}: {slots_sync_error}")
        
        return jsonify({
            "empty": empty_count,
            "occupied": occupied_count,
            "total": total_count,
            "synced": sync_success,
            "syncError": sync_error,
            "slotsSynced": slots_synced,
            "slotsSyncError": slots_sync_error
        })
        
    except Exception as e:
        return jsonify({"error": f"Inference execution failed: {str(e)}"}), 500

if __name__ == "__main__":
    # Runs on port 5001 to avoid conflict with node.js backend on port 5000
    app.run(host="0.0.0.0", port=5001, debug=False)
