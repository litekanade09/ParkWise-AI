import cv2

image = cv2.imread("../datasets/test/parkingoccempimg.jpg")

# A1 Coordinates
x1 = 461
y1 = 145

x2 = 524
y2 = 280

# Crop Slot A1
slot_a1 = image[y1:y2, x1:x2]

print("Slot Shape:", slot_a1.shape)

cv2.imshow("Original Image", image)
cv2.imshow("Slot A1", slot_a1)

cv2.waitKey(0)
cv2.destroyAllWindows()