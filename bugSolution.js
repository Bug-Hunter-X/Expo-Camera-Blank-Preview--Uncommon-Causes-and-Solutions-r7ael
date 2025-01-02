This solution focuses on robust asynchronous handling and comprehensive error handling to address the blank preview issue in Expo's Camera API. It accounts for potential race conditions and provides informative error feedback:
```javascript
import { Camera, useCameraDevices, CameraType } from 'expo-camera';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

function App() {
  const devices = useCameraDevices();
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [cameraError, setCameraError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      } catch (error) {
        setCameraError(error);
      }
    })();
  }, []);

  const handleCameraType = () => {
    setCameraType(cameraType === CameraType.back ? CameraType.front : CameraType.back);
  };

  if (hasPermission === null) {
    return <View><Text>Requesting Camera Permission...</Text></View>; 
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  if (cameraError) {
    return <Text>Camera Error: {cameraError.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={cameraType} onError={error => setCameraError(error)}>
        {/* Camera preview */}
      </Camera>
      <button title="Switch Camera" onPress={handleCameraType}/>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
});

export default App;
```