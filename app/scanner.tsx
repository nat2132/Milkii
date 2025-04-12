import React from 'react';
import { useState, useEffect, useRef } from 'react'; // Added useRef
import { StyleSheet, Text, View, TouchableOpacity, Alert, Dimensions, Platform } from 'react-native'; // Added Platform
import { Camera, CameraView, BarcodeScanningResult, PermissionStatus, CameraType, FlashMode } from 'expo-camera'; // Added CameraType, FlashMode
import { Stack, useRouter } from 'expo-router';
import {
  X as XIcon,
  RefreshCw,
  Check,
  Clipboard,
  MapPin,
  ImageDown, // Icon for Gallery
  Repeat,    // Icon for Swipe Camera
  Zap,       // Icon for Flash
  Minus,     // Icon for Zoom Out
  Plus       // Icon for Zoom In
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider'; // Import Slider
import * as ImagePicker from 'expo-image-picker';

// Get screen dimensions for positioning the viewfinder
const { width } = Dimensions.get('window');
const qrSize = width * 0.7; // Make viewfinder size relative to screen width

export default function QRCodeScannerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null); // Ref for CameraView specific actions if needed
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [scannedData, setScannedData] = useState('');

  // State for Camera Controls (Scanning State)
  const [zoom, setZoom] = useState(0);
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [flashMode, setFlashMode] = useState<boolean>(false); // Use boolean for torch

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      // Optionally request media library permissions upfront if Gallery feature is prominent
      // const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(cameraStatus.status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    if (scanned || confirmed) return;
    setScanned(true);
    setScannedData(data);
    // Optional: Vibrate or make a sound
  };

  const resetScanner = () => {
    setScanned(false);
    setConfirmed(false);
    setScannedData('');
    setZoom(0); // Reset zoom on reset
    // Consider resetting flash/camera type? Maybe not necessary.
  };

  const confirmScan = () => {
    setConfirmed(true);
    setScanned(true);
  };

  const viewItemInfo = () => {
    if (!scannedData) return;
    Alert.alert("View Item Info", `Navigating to info screen for data:\n${scannedData}`);
  };

  const saleItem = () => {
    if (!scannedData) return;
    router.push({
      pathname: './new-sale',
      params: { scannedData }
    });
  };

  // --- Scanning State Actions ---
  const toggleFlash = () => {
    setFlashMode(current => !current);
  };

  const switchCamera = () => {
    setCameraType(current => (current === 'back' ? 'front' : 'back'));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant access to your photo library to scan QR codes from images.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // <-- Use the string literal 'image'
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      try {
        // --- QR Code Scanning from Image ---
        // Expo Camera's `scanFromURLAsync` is deprecated/removed in newer SDKs.
        // You'll need a dedicated library for this (e.g., react-native-vision-camera with a frame processor,
        // or a JS QR library like 'jsqr' combined with fetching image data).
        // This is a complex implementation detail beyond the UI request.
        // For now, we just show an alert.
        Alert.alert("Image Selected", `Would attempt to scan QR code from image: ${uri}. (Library needed for actual scan)`);
        // Example using a hypothetical scan library:
        // const scanResults = await QRCodeDecoderLibrary.decode(uri);
        // if (scanResults && scanResults.length > 0) {
        //   handleBarCodeScanned({ data: scanResults[0].data });
        // } else {
        //   Alert.alert("No QR Code Found", "Could not find a QR code in the selected image.");
        // }
      } catch (error) {
        console.error("Error scanning image:", error);
        Alert.alert("Scan Error", "Failed to scan the selected image.");
      }
    }
  };


  if (hasPermission === null) {
    return <View style={styles.centerTextContainer}><Text style={styles.permissionText}>Requesting camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.centerTextContainer}><Text style={styles.permissionText}>No access to camera. Please enable it in settings.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ----- Camera View ----- */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
           barcodeTypes: ["qr"],
        }}
        facing={cameraType}
        zoom={zoom} // Apply zoom state
        enableTorch={flashMode} // Apply flash state using enableTorch 
        // Consider adding enableTorch={true} if needed, though 'torch' prop usually suffices
      />

      {/* ----- UI Overlays based on state ----- */}

      {/* Header */}
      <View style={[styles.header, { top: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <XIcon size={28} color="#fff" />
        </TouchableOpacity>
        {(scanned || confirmed) && <Text style={styles.headerTitle}>QR Scanner</Text>}
        <View style={{ width: 28 }} />
      </View>

      {/* Viewfinder Overlay / Placeholder */}
      <View style={styles.viewfinderContainer}>
         {(!scanned && !confirmed) && (
            <View style={styles.viewfinder} />
          )}
         {(scanned || confirmed) && (
           <View style={[styles.viewfinder, styles.qrPlaceholder]}>
             {scannedData && <Text style={styles.scannedDataText}>{scannedData}</Text>}
           </View>
         )}
      </View>


      {/* Bottom Controls Container */}
      <View style={[styles.bottomOuterContainer, { paddingBottom: insets.bottom }]}>

        {/* State 1: Initial Scanning Controls (Zoom + Actions) */}
        {!scanned && !confirmed && (
          <>
            {/* Zoom Slider */}
            <View style={styles.zoomContainer}>
              <TouchableOpacity onPress={() => setZoom(Math.max(0, zoom - 0.1))} style={styles.zoomButton}>
                 <Minus size={24} color="#fff" />
              </TouchableOpacity>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={0.5} // Max zoom depends on device, 0.5 is a safe upper limit
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="rgba(255, 255, 255, 0.5)"
                thumbTintColor="#FFFFFF"
                value={zoom}
                onValueChange={setZoom}
              />
              <TouchableOpacity onPress={() => setZoom(Math.min(0.5, zoom + 0.1))} style={styles.zoomButton}>
                 <Plus size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Action Bar */}
            <View style={styles.actionBarContainer}>
              <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
                <ImageDown size={26} color="#fff" />
                <Text style={styles.actionButtonText}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={switchCamera}>
                <Repeat size={26} color="#fff" />
                <Text style={styles.actionButtonText}>Swipe</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={toggleFlash}>
                <Zap size={26} color={flashMode ? "#FFD700" : "#fff"} />
                <Text style={styles.actionButtonText}>Flash</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* State 2: Scanned, waiting for confirmation */}
        {scanned && !confirmed && (
          <View style={styles.scannedControls}>
            <TouchableOpacity style={styles.scannedButton} onPress={resetScanner}>
              <RefreshCw size={32} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.scannedButton, styles.confirmButtonBackground]} onPress={confirmScan}>
              <Check size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* State 3: Confirmed, showing actions */}
        {scanned && confirmed && (
          <View style={styles.confirmedActionsContainer}>
            <TouchableOpacity style={styles.infoButton} onPress={viewItemInfo}>
              <Clipboard size={20} color="#007AFF" />
              <Text style={styles.infoButtonText}>View Item Info</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saleButton} onPress={saleItem}>
              <MapPin size={20} color="#fff" />
              <Text style={styles.saleButtonText}>Sale Item</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  permissionText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  iconButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  viewfinderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Added padding to push viewfinder up slightly from bottom controls
    paddingBottom: 100, // Adjust as needed
  },
  viewfinder: {
    width: qrSize,
    height: qrSize,
    borderColor: 'rgba(255, 255, 255, 0.8)', // Brighter border
    borderWidth: 1, // Thinner border like image 1
    // Simulating corner brackets using borderRadius on pseudo-elements is complex.
    // Using simple border for now. Can be enhanced with absolute positioned Views.
    borderRadius: 10,
  },
  qrPlaceholder: {
    borderColor: 'rgba(255, 255, 255, 0.6)', // Keep consistent border
    borderWidth: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Darker placeholder background
    justifyContent: 'center',
    alignItems: 'center',
    // Placeholder for where the actual scanned QR code *graphic* could be displayed
    // (Not showing the scanned *data* here, that's usually in a modal or separate area)
  },
  scannedDataText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    padding: 8,
  },
  // --- Bottom Controls Styling ---
  bottomOuterContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // No background here, background is on inner elements
  },
  // Zoom Slider Container
  zoomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Background for zoom section
  },
  zoomButton: {
    padding: 8,
  },
  slider: {
    flex: 1,
    height: 40, // Standard slider height
    marginHorizontal: 10,
  },
  // Action Bar (Gallery, Swipe, Flash)
  actionBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#007AFF', // Blue background
    paddingVertical: 10,
    paddingHorizontal: 10,
    // Rounded corners - might need adjustment based on screen shape
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    // If bottom inset is applied to outer container, no need for bottom radius here
  },
  actionButton: {
    alignItems: 'center',
    padding: 5, // Add padding for touch area
    minWidth: 60, // Ensure buttons have some minimum width
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4, // Space between icon and text
  },
  // State 2: Scanned Controls (Reset / Confirm) - Placed directly in bottomOuterContainer
  scannedControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Give it a background consistent with header/zoom
    paddingVertical: 15, // Adjust padding as needed
    paddingHorizontal: 20,
  },
  scannedButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  confirmButtonBackground: {
    backgroundColor: '#4CD964',
  },
  // State 3: Confirmed Actions (Info / Sale) - Placed directly in bottomOuterContainer
  confirmedActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Slightly darker background for final actions
    paddingTop: 15, // Add padding matching scannedControls
    paddingBottom: 15, // Add padding matching scannedControls
    paddingHorizontal: 20,
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#007AFF',
    backgroundColor: '#fff',
    marginRight: 10,
    flex: 1,
  },
  infoButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  saleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    flex: 1,
  },
  saleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});