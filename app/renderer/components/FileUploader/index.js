import React from 'react';
import Dropzone from 'react-dropzone';

class FileUploader extends React.Component {
  constructor() {
    super();
    this.state = {
      files: [],
    };
  }

  onDrop = files => {
    this.setState({ files });
  };

  onCancel = () => {
    this.setState({
      files: [],
    });
  };

  render() {
    // const files = this.state.files.map(file => (
    //   <li key={file.name}>
    //     {file.name} - {file.size} bytes
    //   </li>
    // ));

    const files =
      (this.state.files[0] && `${this.state.files[0].name} - ${this.state.files[0].size} bytes`) ||
      '';

    return (
      <section>
        <Dropzone onDrop={this.onDrop} onFileDialogCancel={this.onCancel}>
          {({ getRootProps, getInputProps }) => (
            <div>
              <input {...getInputProps()} />

              <input value={files} type="text" readOnly />
              <button type="button" {...getRootProps()}>
                Drop files here, or click to select files
              </button>
            </div>
          )}
        </Dropzone>
      </section>
    );
  }
}
export default FileUploader;
