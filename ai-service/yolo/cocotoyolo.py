import json
import os

DATASET_PATH = "../datasets"

SPLITS = ["train", "valid", "test"]

for split in SPLITS:

    json_path = os.path.join(
        DATASET_PATH,
        split,
        "_annotations.coco.json"
    )

    with open(json_path, "r") as f:
        coco = json.load(f)

    images = {
        img["id"]: img
        for img in coco["images"]
    }

    annotations_by_image = {}

    for ann in coco["annotations"]:

        image_id = ann["image_id"]

        if image_id not in annotations_by_image:
            annotations_by_image[image_id] = []

        annotations_by_image[image_id].append(ann)

    labels_dir = os.path.join(
        DATASET_PATH,
        split,
        "labels"
    )

    os.makedirs(labels_dir, exist_ok=True)

    for image_id, anns in annotations_by_image.items():

        image_info = images[image_id]

        width = image_info["width"]
        height = image_info["height"]

        image_name = image_info["file_name"]
        label_name = image_name.replace(".jpg", ".txt")

        label_path = os.path.join(
            labels_dir,
            label_name
        )

        with open(label_path, "w") as f:

            for ann in anns:

                category_id = ann["category_id"]

                if category_id == 1:
                    class_id = 0
                elif category_id == 2:
                    class_id = 1
                else:
                    continue

                x, y, w, h = ann["bbox"]

                x_center = (x + w / 2) / width
                y_center = (y + h / 2) / height

                w /= width
                h /= height

                f.write(
                    f"{class_id} "
                    f"{x_center} "
                    f"{y_center} "
                    f"{w} "
                    f"{h}\n"
                )

print("COCO to YOLO conversion complete!")