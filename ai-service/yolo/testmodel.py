from ultralytics import YOLO

# Load your trained model
model = YOLO(
    "runs/detect/parkwise_test/weights/best.pt"
)

# Predict on one parking image
results = model.predict(
    source="../datasets/test/images/2012-09-11_16_48_36_jpg.rf.4ecc8c87c61680ccc73edc218a2c8d7d.jpg",
    conf=0.25,
    save=True,
    show=True
)

print("Inference Complete!")