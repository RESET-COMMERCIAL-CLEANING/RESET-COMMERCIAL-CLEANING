import { storage } from '@/lib/firebase';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

export const uploadProfilePicture = async (userId: string, file: File): Promise<string> => {
  const fileExtension = file.name.split('.').pop();
  const storageRef = ref(storage, `profile-pictures/${userId}/avatar.${fileExtension}`);

  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export const uploadBeforeAfterPhoto = async (
  jobId: string,
  taskId: string,
  type: 'before' | 'after',
  file: File
): Promise<string> => {
  const fileExtension = file.name.split('.').pop();
  const storageRef = ref(storage, `before-after/${jobId}/${taskId}/${type}.${fileExtension}`);

  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export const uploadTicketAttachment = async (ticketId: string, file: File): Promise<string> => {
  const timestamp = Date.now();
  const fileExtension = file.name.split('.').pop();
  const storageRef = ref(storage, `ticket-attachments/${ticketId}/${timestamp}-${file.name}`);

  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export const deleteFile = async (fileUrl: string): Promise<void> => {
  try {
    const storageRef = ref(storage, fileUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

export const uploadFile = async (path: string, file: File): Promise<string> => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};
