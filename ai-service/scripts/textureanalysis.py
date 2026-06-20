import cv2
import numpy as np

occupied = cv2.imread("../datasets/test/a5.png")
empty = cv2.imread("../datasets/test/a6.png")

occupied_gray = cv2.cvtColor(occupied, cv2.COLOR_BGR2GRAY)
empty_gray = cv2.cvtColor(empty, cv2.COLOR_BGR2GRAY)

occupied_texture = np.std(occupied_gray)
empty_texture = np.std(empty_gray)

print("Occupied Texture:", occupied_texture)
print("Empty Texture:", empty_texture)