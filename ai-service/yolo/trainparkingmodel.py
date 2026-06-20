from ultralytics import YOLO

model = YOLO("yolov8n.pt")

model.train(
    data="E:/ParkingSystem/ai-service/datasets/data.yaml",
    epochs=5,
    imgsz=640,
    batch=4,
    name="parkwise_test"
)