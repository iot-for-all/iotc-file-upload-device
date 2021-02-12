---
page_type: sample
name: "IoT Central file upload device sample"
description: "Sample code that demonstrates how a device can use IoT Central to upload a file to cloud storage."
languages:
- typescript
products:
- azure-iot-central
urlFragment: iotc-file-upload-device
---

# IoT Central file upload device sample
This sample demonstrates how to use the file upload feature of IoT Hub from within an IoT Central app. For a full description of the IoT Central File Upload feature see the [documentation online](https://apps.azureiotcentral.com).

## Prerequisites
* [Node.js](https://nodejs.org/en/download/)
* [Visual Studio Code](https://code.visualstudio.com/Download) with [TSLint](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin) extension installed
* [Azure Blob Storage account](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-portal)
* [IoT Central Application](https://docs.microsoft.com/en-us/azure/iot-central/core/quick-deploy-iot-central)

## Clone the repository
If you haven't already cloned the repository, use the following command to clone it to a suitable location on your local machine and install the dependent packages:
```
git clone https://github.com/iot-for-all/iotc-file-upload-device
cd iotc-file-upload-device
npm i
```
Open the cloned repository with VS Code.

## Create an IoT Central application
Follow the instructions to create an IoT Central application and associate the application with your Azure Storage account. Create a new device template using the included file upload device sample template.
* From the left pane in your IoT Central Application select "Device templtes"
* At the top of the device templates view select the "+ New" option to create a new template
* Select the "IoT Device" option
* Select the "Next: Customize" button
* Name your template (e.g. File Upload Device Sample)
* Select the "Next: Review" button
* Select the "Create" button
* Select the "Import capability model" option. The device template is included in the project here */setup/FileUploadDeviceDcm.json*.

After importing the device template you need to create a view on the telemetry and properties the device will send and receive. See the documentation to [Create and manage dashboards in IoT Central](https://docs.microsoft.com/en-us/azure/iot-central/core/howto-create-personal-dashboards). Create a dashboard view for *Visualizing the device*
* In your new device template select the "Views" option
* Select the "Visualize the device" option
* For the "View name" enter "Dashboard"
* Select the `System Heartbeat` telemetry and then the "Add tile" button at the bottom. This telemetry is a heartbeat signal that shows that your device is alive and running. This signal will be charted on a graph.
* Select the `Upload Image` telemtry and then the "Add tile" button at the bottom. This telemetry is an event that will indicated when a file upload has occurred.
* Select the "Save" option for this view.

Create another view for *Editing device and cloud data*
* Select the "Views" option
* Select the "Editing device and cloud data" option
* For the "Form name" enter "Upload options"
* Select the `Filename Suffix` property and then the "Add section" button at the bottom. This property is the suffix to use on the uploaded file name.
* Select the "Save" option for this view.

Now publish the template by selecting the "Publish" option at the top of the screen. You are now ready to create a device and run the sample code.

## Create an IoT Device
In your IoT Central application create a new device based on your new template and get the connection information.
* From the left pane in your IoT Central Application select "Devices"
* In the device list view select the "+ New" option
* In the Create a new device screen specify your template, a Device name, and a Device ID
* Select the "Create" button
* In the device list select your new device
* In the device view select the "Connect" option at the top of the screen
  * Copy the values for "ID scope", "Device ID", and "Primary key". You will use these values in the device sample code.

## Run the sample code
Create a ".env" file at the root of your project and add the values you copied above. The file should look like the sample below with your own values. NOTE: the modelId is copied from the */setup/FileUploadDeviceDcm.json* file.
```
scopeId=<YOUR_SCOPE_ID>
deviceId=<YOUR_DEVICE_ID>
deviceKey=<YOUR_PRIMARY_KEY>
modelId=urn:IoTCentral:IotCentralFileUploadDevice:1
```

Now you are ready to run the sample. Press F5 to run/debug the sample in VSCode or _npm run start_ in command line otherwise. In your terminal window you should see that the device is registered and is connected to IoT Central:
```
Starting IoT Central device...
 > Machine: ...
Starting device registration...
DPS registration succeeded
Connecting the device...
IoT Central successfully connected device: file-upload-device
```

## Upload a file
The sample project comes with a sample file named datafile.json. This will be the file that is uploaded when you use the Upload File command in your IoT Central application. To test this open your application and select the device you created. Select the Command tab and you should see a button named "Run". When you select that button the IoT Central app will call a direct method on your device to upload the file. You can see this direct method in the sample code in the */device.ts* file. The method is named *uploadFileCommand*.

The *uploadFileCommand* calls a method named *uploadFile*. This method gets the device setting for the filename suffix to use. By default the built-in file upload feature automatically creates a folder with the same name as your deviceId. This device setting is purely to demonstrate how to communicate property changes to your device from IoT Central. After getting the file name and some information about file to upload the code calls the built-in IoT Hub method `deviceClient.uploadToBlob` on the device client interface. This uses the IoT Hub file upload feature to stream the file to the associated Azure Blob storage.

> While this sample uses the Command capability in IoT Central to call a direct method on your device in order to upload a file it it not required. For example you could have a video analytics device that automatically uploads a sample image when it detects an anomaly.

This sample demonstrates the simplest way to upload generic files to an Azure Blob Storage account. The features of the IoT Hub take care of creating the SAS token for the connection. If you need more fine grained control of the features of Azure Blob Storage from your IoT Device then you will need to use the Azure Storage SDK directly in your Azure IoT Device project. To learn more about the Azure Blob Storage SDK see the [Azure Blob storage documentation](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction).
