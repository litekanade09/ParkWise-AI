import cv2

image = cv2.imread("../datasets/test/parkingoccempimg.jpg")

# Draw rectangle
cv2.rectangle(
    image,
    (100, 100),      # Top-left corner
    (500, 280),      # Bottom-right corner
    (0, 255, 0),     # Green color
    10                # Thickness
)

cv2.imshow("Rectangle Demo", image)

cv2.waitKey(0)
cv2.destroyAllWindows()