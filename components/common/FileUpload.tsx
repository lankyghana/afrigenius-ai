import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Upload, File, X, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

interface FileUploadProps {
  onFileSelect: (file: any) => void;
  acceptedTypes?: string[];
  maxSizeInMB?: number;
  multiple?: boolean;
  placeholder?: string;
  allowPromptExtraction?: boolean;
}

interface UploadedFile {
  uri: string;
  name: string;
  type: string;
  size: number;
  status: 'uploading' | 'success' | 'error';
}

export function FileUpload({
  onFileSelect,
  acceptedTypes = ['image/*', 'application/pdf', 'text/*'],
  maxSizeInMB = 10,
  multiple = false,
  placeholder = 'Upload files',
  allowPromptExtraction = false
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const validateFile = (file: any): boolean => {
    // Check file size
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      Alert.alert('File Too Large', `File size must be less than ${maxSizeInMB}MB`);
      return false;
    }

    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        const category = type.split('/')[0];
        return file.type?.startsWith(category);
      }
      return file.type === type;
    });

    if (!isValidType) {
      Alert.alert('Invalid File Type', `Accepted types: ${acceptedTypes.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: acceptedTypes,
        multiple,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets) {
        const files = result.assets;
        
        for (const file of files) {
          if (validateFile(file)) {
            await uploadFile(file);
          }
        }
      }
    } catch (error) {
      console.error('Document picker error:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera roll permissions');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        allowsMultipleSelection: multiple,
      });

      if (!result.canceled && result.assets) {
        const files = result.assets;
        
        for (const file of files) {
          if (validateFile(file)) {
            await uploadFile(file);
          }
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadFile = async (file: any) => {
    const uploadedFile: UploadedFile = {
      uri: file.uri,
      name: file.name || 'Unknown',
      type: file.type || 'unknown',
      size: file.size || 0,
      status: 'uploading',
    };

    setUploadedFiles(prev => [...prev, uploadedFile]);
    setUploading(true);

    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Extract text content if it's a text file and prompt extraction is enabled
      if (allowPromptExtraction && file.type?.startsWith('text/')) {
        // In a real implementation, you would read the file content here
        const extractedText = `Extracted content from ${file.name}`;
        file.extractedText = extractedText;
      }
      
      // Update file status to success
      setUploadedFiles(prev =>
        prev.map(f =>
          f.uri === uploadedFile.uri
            ? { ...f, status: 'success' }
            : f
        )
      );

      onFileSelect(file);
    } catch (error) {
      console.error('Upload error:', error);
      
      // Update file status to error
      setUploadedFiles(prev =>
        prev.map(f =>
          f.uri === uploadedFile.uri
            ? { ...f, status: 'error' }
            : f
        )
      );
      
      Alert.alert('Upload Failed', 'Please try again');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (uri: string) => {
    setUploadedFiles(prev => prev.filter(f => f.uri !== uri));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return '🖼️';
    } else if (type === 'application/pdf') {
      return '📄';
    } else if (type.startsWith('text/')) {
      return '📝';
    }
    return '📁';
  };

  return (
    <View style={styles.container}>
      {/* Upload Area */}
      <View style={styles.uploadArea}>
        <Upload size={32} color={Colors.textSecondary} />
        <Text style={styles.uploadTitle}>{placeholder}</Text>
        <Text style={styles.uploadSubtitle}>
          Max size: {maxSizeInMB}MB • Types: {acceptedTypes.join(', ')}
        </Text>
        
        <View style={styles.uploadButtons}>
          <TouchableOpacity style={styles.uploadButton} onPress={handleDocumentPick}>
            <File size={20} color={Colors.primary} />
            <Text style={styles.uploadButtonText}>Choose Files</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.uploadButton} onPress={handleImagePick}>
            <Image size={20} color={Colors.secondary} />
            <Text style={styles.uploadButtonText}>Choose Images</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <View style={styles.filesContainer}>
          <Text style={styles.filesTitle}>Uploaded Files</Text>
          
          {uploadedFiles.map((file, index) => (
            <View key={index} style={styles.fileItem}>
              <View style={styles.fileInfo}>
                <Text style={styles.fileIcon}>{getFileIcon(file.type)}</Text>
                <View style={styles.fileDetails}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {file.name}
                  </Text>
                  <Text style={styles.fileSize}>
                    {formatFileSize(file.size)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.fileActions}>
                {file.status === 'uploading' && (
                  <View style={styles.uploadingIndicator}>
                    <Text style={styles.uploadingText}>Uploading...</Text>
                  </View>
                )}
                
                {file.status === 'success' && (
                  <CheckCircle size={20} color={Colors.success} />
                )}
                
                {file.status === 'error' && (
                  <AlertCircle size={20} color={Colors.error} />
                )}
                
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeFile(file.uri)}
                >
                  <X size={16} color={Colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  uploadArea: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadTitle: {
    fontSize: 18,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginTop: 12,
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },
  filesContainer: {
    marginTop: 16,
  },
  filesTitle: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginBottom: 12,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  fileActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  uploadingIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.warning + '20',
    borderRadius: 12,
  },
  uploadingText: {
    fontSize: 10,
    fontFamily: Fonts.medium,
    color: Colors.warning,
  },
  removeButton: {
    padding: 4,
  },
});