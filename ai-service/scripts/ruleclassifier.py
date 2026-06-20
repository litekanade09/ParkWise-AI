import cv2
import numpy as np

image = cv2.imread("../datasets/test/a6.png")

gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

brightness = np.mean(gray)
texture = np.std(gray)

print("Brightness:", brightness)
print("Texture:", texture)

if texture > 40 and brightness < 150:
    print("Prediction: OCCUPIED")
else:
    print("Prediction: EMPTY")