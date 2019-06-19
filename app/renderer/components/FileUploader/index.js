import React from 'react';
import Dropzone from 'react-dropzone';
import Button from 'components/Button';
import Input from 'components/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

const FileUploader = ({
  onDrop,
  onCancel,
  value: inputValue,
  backgroundColor,
  borderColor,
  placeholder,
  uploaderStyles,
  acceptTypes,
  ...dropZoneProps
}) => (
  <Dropzone accept={acceptTypes} onDrop={onDrop} onFileDialogCancel={onCancel} {...dropZoneProps}>
    {({ getRootProps, getInputProps }) => (
      <div>
        <input {...getInputProps()} />
        <Input
          value={inputValue || ''}
          placeholder={placeholder || 'Please upload file'}
          onChange={() => null}
          {...uploaderStyles}
          suffix={
            <Button
              inputSuffix
              {...getRootProps({ refKey: 'innerRef' })}
              iconAfter={<FontAwesomeIcon icon={faUpload} onClick={() => null} />}
            >
              Upload
            </Button>
          }
        />
      </div>
    )}
  </Dropzone>
);

export default FileUploader;
