from ultralytics import YOLO

# Load pretrained YOLO model
model = YOLO("yolov8n.pt")

# Run prediction
results = model("../datasets/test/parkingoccempimg.jpg", show=True)

# Print results
for result in results:
    print(result.boxes)