import cv2
import numpy as np

# Load Images
occupied = cv2.imread("../datasets/test/a5.png")
empty = cv2.imread("../datasets/test/a6.png")

# Convert to Gray
occupied_gray = cv2.cvtColor(occupied, cv2.COLOR_BGR2GRAY)
empty_gray = cv2.cvtColor(empty, cv2.COLOR_BGR2GRAY)

# Edge Detection
occupied_edges = cv2.Canny(occupied_gray, 50, 150)
empty_edges = cv2.Canny(empty_gray, 50, 150)

# Count Edge Pixels
occupied_edge_count = np.sum(occupied_edges > 0)
empty_edge_count = np.sum(empty_edges > 0)

print("Occupied Edge Count:", occupied_edge_count)
print("Empty Edge Count:", empty_edge_count)