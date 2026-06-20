import cv2
import numpy as np

occupied = cv2.imread("../datasets/test/a5.png")
empty = cv2.imread("../datasets/test/a6.png")

occupied_gray = cv2.cvtColor(occupied, cv2.COLOR_BGR2GRAY)
empty_gray = cv2.cvtColor(empty, cv2.COLOR_BGR2GRAY)

occupied_brightness = np.mean(occupied_gray)
empty_brightness = np.mean(empty_gray)

print("Occupied Brightness:", occupied_brightness)
print("Empty Brightness:", empty_brightness)