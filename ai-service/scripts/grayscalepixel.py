import cv2

image = cv2.imread("../datasets/test/a5.png")

gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

pixel = gray[30,30]

print("Gray Pixel Value:", pixel)