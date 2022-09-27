# Trashclass

![cxbxzuyc](https://user-images.githubusercontent.com/85836377/191777052-f38d2b01-80ce-4dab-bff4-8497d88ef48b.png)

<h1> Motivation for the
  Project </h1>

Being able to sort trash according to different materials is very important for recycling. However, sorting trash is one of the toughest tasks to do. While it is easy to sort metals and non-metals, it is very difficult to sort paper, glass, plastic and cardboard.

Currently, it is done by people. It is not a good job and such people are often at danger of being exposed to harmful chemicals, medical wastes and be exposed to diseases. If instead we can use a neural network that can do the classification then we can make the process faster, safer and more accurate.
This project attempts to use a convolutional neural network to do just that.

<h2>Project Structure</h2>

mobilenet_training.py: You can use this script to train the model.
trash_classifier.py: The script to classify trash on the UP Board Embedded kit.
prediction_images: Directory Containing the predicted images.
models: The saved model is here

<h3>Data</h3>

The data for this project was collected from the trashnet project
This project requires python3.6 and opencv. Other requirements are present in the requirements.txt file
