/**
 * @file File Dropzone component
 * @module components/common/FileDropzone
 * @description A drag-and-drop file upload area built on react-dropzone.
 *   Supports single file upload, accept restrictions, and visual feedback
 *   during drag operations.
 */

// React hooks
import { useCallback } from 'react';

// React dropzone for drag-and-drop functionality
import { useDropzone } from 'react-dropzone';

// Upload icon
import { UploadCloud } from 'lucide-react';

// Utility for conditional class names
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  /** Callback invoked when a file is accepted */
  onFile: (file: File) => void;
  /** Optional MIME type accept configuration (e.g. CSV, XLSX) */
  accept?: Record<string, string[]>;
  /** Additional CSS class names */
  className?: string;
  /** Currently selected file (shows its name when set) */
  file?: File | null;
}

/**
 * FileDropzone
 * @description A drag-and-drop area for file uploads. Accepts single files,
 *   shows the file name after selection, and provides visual feedback
 *   during drag operations.
 * @param props FileDropzoneProps
 * @returns A clickable/droppable file upload zone
 */
export function FileDropzone({ onFile, accept, className, file }: FileDropzoneProps) {
  /**
   * onDrop: A callback function to be called when a file is dropped in the input 
   * this will check the array of the accepted files and if there is at least one file,
   * it will call the onFile callback function to pass the file to the form so it can be called with the api
   */
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) onFile(acceptedFiles[0]);
    },
    [onFile],
  );

  /**
   * dropzoneOptions: Options to configure the dropzone behavior
   * onDrop: The callback function to be called when a file is dropped
   * maxFiles: Limit the number of files that can be dropped to 1
   * accept: An optional object that specifies the accepted file types and extensions.
   * If provided, it will be passed to the useDropzone hook to restrict the file types that can be dropped.
   * The accept object should have the format: { "mime/type": [".ext1", ".ext2"] }
   */
  const dropzoneOptions = {
    onDrop,
    maxFiles: 1,
    ...(accept !== undefined && { accept }),
  };

  /**
   * useDropzone: A hook from the react-dropzone library that provides the necessary props and state for implementing a file dropzone.
   * getRootProps: A function that returns the props to be spread on the root element of the dropzone.
   * getInputProps: A function that returns the props to be spread on the input element of the dropzone.
   * isDragActive: A boolean that indicates whether a file is currently being dragged over the dropzone.
   * The useDropzone hook is called with the dropzoneOptions to configure its behavior according to the specified options.
   */
  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneOptions);

  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors',
        isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
        className,
      )}
    >
      <input {...getInputProps()} />
      <UploadCloud className="h-8 w-8 text-muted-foreground" />
      {file ? (
        <p className="text-sm font-medium">{file.name}</p>
      ) : (
        <>
          <p className="text-sm font-medium">
            {isDragActive ? 'Drop the file here' : 'Drag & drop or click to upload'}
          </p>
          <p className="text-xs text-muted-foreground">CSV or XLSX</p>
        </>
      )}
    </div>
  );
}
