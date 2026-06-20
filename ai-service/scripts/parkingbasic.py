import cv2

# Read image
image = cv2.imread("../datasets/test/parkingoccempimg.jpg")

# Print image information
print("Image Shape:", image.shape)

height, width, channels = image.shape

print("Height:", height)
print("Width:", width)
print("Channels:", channels)

# Display image
cv2.imshow("Parking Image", image)

cv2.waitKey(0)
cv2.destroyAllWindows()