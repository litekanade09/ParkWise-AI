import cv2

# Load images
occupied = cv2.imread("../datasets/test/a5.png")
empty = cv2.imread("../datasets/test/a6.png")

# Convert to grayscale
occupied_gray = cv2.cvtColor(occupied, cv2.COLOR_BGR2GRAY)
empty_gray = cv2.cvtColor(empty, cv2.COLOR_BGR2GRAY)

# Canny Edge Detection
occupied_edges = cv2.Canny(occupied_gray, 50, 150)
empty_edges = cv2.Canny(empty_gray, 50, 150)

# Display
cv2.imshow("Occupied Original", occupied)
cv2.imshow("Occupied Edges", occupied_edges)

cv2.imshow("Empty Original", empty)
cv2.imshow("Empty Edges", empty_edges)

cv2.waitKey(0)
cv2.destroyAllWindows()