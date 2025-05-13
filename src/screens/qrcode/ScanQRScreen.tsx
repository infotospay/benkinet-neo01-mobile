import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { apiService } from '../../api';
import { ErrorResponse } from '../../api/errorHandler';
import { formatCurrency } from '../../utils';

// Note: In a real implementation, you would need to install and import a QR code scanner library
// For example: import { BarCodeScanner } from 'expo-barcode-scanner';

const ScanQRScreen = ({ navigation }: any) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrData, setQrData] = useState<any>(null);
  
  useEffect(() => {
    // In a real implementation, you would request camera permissions here
    // For example:
    // (async () => {
    //   const { status } = await BarCodeScanner.requestPermissionsAsync();
    //   setHasPermission(status === 'granted');
    // })();
    
    // For this demo, we'll simulate permission being granted
    setHasPermission(true);
  }, []);
  
  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, you would send the scanned data to the API
      // For this demo, we'll simulate a response
      // const response = await apiService.scanQrCode({ qrData: data });
      
      // Simulate API response
      const simulatedResponse = {
        data: {
          paymentInfo: {
            amount: 100,
            currency: 'USD',
            description: 'Payment for goods',
            walletId: '123456',
            walletName: 'Main Wallet',
            recipientName: 'John Doe',
          },
          isValid: true,
        },
      };
      
      setQrData(simulatedResponse.data);
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      setError(errorResponse.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleConfirmPayment = async () => {
    if (!qrData || !qrData.paymentInfo) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, you would send the payment data to the API
      // For this demo, we'll navigate to the SendMoney screen with pre-filled data
      navigation.replace('SendMoney', {
        amount: qrData.paymentInfo.amount.toString(),
        recipientIdentifier: qrData.paymentInfo.walletId,
        description: qrData.paymentInfo.description,
        recipientName: qrData.paymentInfo.recipientName,
      });
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      setError(errorResponse.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleScanAgain = () => {
    setScanned(false);
    setQrData(null);
    setError(null);
  };
  
  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }
  
  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera permission is required to scan QR codes.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={() => {
            // In a real implementation, you would open app settings
            // For example: Linking.openSettings();
            Alert.alert('Permission Required', 'Please enable camera permission in your device settings.');
          }}
        >
          <Text style={styles.permissionButtonText}>Enable Camera</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      {!scanned ? (
        <View style={styles.scannerContainer}>
          {/* In a real implementation, you would render the BarCodeScanner component here */}
          {/* For example: <BarCodeScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} style={styles.scanner} /> */}
          
          {/* For this demo, we'll simulate a scanner with a button */}
          <View style={styles.mockScanner}>
            <Text style={styles.mockScannerText}>Camera Preview</Text>
            <TouchableOpacity
              style={styles.mockScanButton}
              onPress={() => handleBarCodeScanned({ type: 'qr', data: 'simulated-qr-data' })}
            >
              <Text style={styles.mockScanButtonText}>Simulate Scan</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerFrame} />
            <Text style={styles.scannerText}>
              Align QR code within the frame
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.resultContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Processing QR code...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>Error</Text>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.scanAgainButton}
                onPress={handleScanAgain}
              >
                <Text style={styles.scanAgainButtonText}>Scan Again</Text>
              </TouchableOpacity>
            </View>
          ) : qrData ? (
            <View style={styles.paymentContainer}>
              <Text style={styles.paymentTitle}>Payment Details</Text>
              
              {qrData.paymentInfo && (
                <>
                  <View style={styles.paymentCard}>
                    <View style={styles.paymentRow}>
                      <Text style={styles.paymentLabel}>Amount</Text>
                      <Text style={styles.paymentAmount}>
                        {formatCurrency(qrData.paymentInfo.amount, qrData.paymentInfo.currency)}
                      </Text>
                    </View>
                    
                    {qrData.paymentInfo.description && (
                      <>
                        <View style={styles.separator} />
                        <View style={styles.paymentRow}>
                          <Text style={styles.paymentLabel}>Description</Text>
                          <Text style={styles.paymentValue}>
                            {qrData.paymentInfo.description}
                          </Text>
                        </View>
                      </>
                    )}
                    
                    {qrData.paymentInfo.recipientName && (
                      <>
                        <View style={styles.separator} />
                        <View style={styles.paymentRow}>
                          <Text style={styles.paymentLabel}>Recipient</Text>
                          <Text style={styles.paymentValue}>
                            {qrData.paymentInfo.recipientName}
                          </Text>
                        </View>
                      </>
                    )}
                    
                    {qrData.paymentInfo.walletName && (
                      <>
                        <View style={styles.separator} />
                        <View style={styles.paymentRow}>
                          <Text style={styles.paymentLabel}>Wallet</Text>
                          <Text style={styles.paymentValue}>
                            {qrData.paymentInfo.walletName}
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                  
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.confirmButton}
                      onPress={handleConfirmPayment}
                    >
                      <Text style={styles.confirmButtonText}>Proceed to Payment</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={handleScanAgain}
                    >
                      <Text style={styles.cancelButtonText}>Scan Again</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>Invalid QR Code</Text>
              <Text style={styles.errorText}>
                The scanned QR code is not a valid payment QR code.
              </Text>
              <TouchableOpacity
                style={styles.scanAgainButton}
                onPress={handleScanAgain}
              >
                <Text style={styles.scanAgainButtonText}>Scan Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanner: {
    ...StyleSheet.absoluteFillObject,
  },
  mockScanner: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockScannerText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    marginBottom: spacing.xl,
  },
  mockScanButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  mockScanButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: borderRadius.md,
    backgroundColor: 'transparent',
    marginBottom: spacing.lg,
  },
  scannerText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
    marginHorizontal: spacing.xl,
  },
  resultContainer: {
    flex: 1,
    backgroundColor: colors.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.xl,
  },
  permissionText: {
    fontSize: typography.fontSize.md,
    color: colors.gray[700],
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  permissionButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.xl,
  },
  errorTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.danger,
    marginBottom: spacing.md,
  },
  errorText: {
    fontSize: typography.fontSize.md,
    color: colors.gray[700],
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  scanAgainButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  scanAgainButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
  },
  paymentContainer: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.light,
  },
  paymentTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  paymentCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  paymentLabel: {
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
  },
  paymentValue: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    color: colors.dark,
    maxWidth: '60%',
    textAlign: 'right',
  },
  paymentAmount: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.primary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.gray[200],
  },
  actionButtons: {
    marginTop: spacing.xl,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: colors.light,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.dark,
    fontSize: typography.fontSize.md,
    fontWeight: '500',
  },
});

export default ScanQRScreen;
