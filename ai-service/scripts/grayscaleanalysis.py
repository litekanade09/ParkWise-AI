import cv2

# Load Occupied Slot (A5)
occupied = cv2.imread("../datasets/test/a5.png")

# Load Empty Slot (A6)
empty = cv2.imread("../datasets/test/a6.png")

# Convert to Grayscale
occupied_gray = cv2.cvtColor(occupied, cv2.COLOR_BGR2GRAY)
empty_gray = cv2.cvtColor(empty, cv2.COLOR_BGR2GRAY)

# Print Shapes
print("Occupied Shape:", occupied.shape)
print("Occupied Gray Shape:", occupied_gray.shape)

print("Empty Shape:", empty.shape)
print("Empty Gray Shape:", empty_gray.shape)

# Show Images
cv2.imshow("Occupied Color", occupied)
cv2.imshow("Occupied Gray", occupied_gray)

cv2.imshow("Empty Color", empty)
cv2.imshow("Empty Gray", empty_gray)

cv2.waitKey(0)
cv2.destroyAllWindows()