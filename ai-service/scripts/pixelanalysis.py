import cv2

image = cv2.imread("../datasets/test/a5.png")

# Pixel Location
x = 30
y = 30

pixel = image[y, x]

print("Pixel Value:", pixel)

print("Blue :", pixel[0])
print("Green:", pixel[1])
print("Red  :", pixel[2])