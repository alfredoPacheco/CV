import 'isomorphic-fetch';
import React, { Component } from 'react';
import { Button, Typography, Grid, Icon, IconButton, Link, Avatar, ButtonBase } from '@material-ui/core';
import Dropzone from 'react-dropzone';
import AppConfig from '../core/AppConfig';
import AuthService from '../core/AuthService';

const Request = async (method: string, endpoint: string, data: any, BaseURL?: string) => {
  if (AuthService.auth == null) AuthService.fillAuthData();
  if (!AuthService.auth || !AuthService.auth.user) throw 'User not signed in.';

  const config: RequestInit = {
    method: method,
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${AuthService.auth.user.BearerToken}`
    },
    body: data
  };

  let response = await fetch((BaseURL || AppConfig.BaseURL) + endpoint, config);
  if (response) {
    if (!response.ok) throw await response.json();
    if (response.status == 403) alert('Invalid Role.');
    if (response.status == 401) throw response;
  } else {
    alert('Failed to fetch. Probably server is down.');
  }
  try {
    const result = await response.json();
    return result;
  } catch (e) {
    return null;
  }
};

interface AttachmentsProps {
  owner: any;
  listBind?: string;
  folderBind?: string;
  kind?: string;
  onChange?: any;
  readOnly?: boolean;
  noButton?: boolean;
  printMode?: boolean;
  afterDelete?: any;
  directUpload?: boolean;
  afterUpload?(): any;

  avatar?: boolean;
  avatarStyle?: any;
}

class Attachments extends Component<AttachmentsProps> {
  state = {
    files: [],
    targetFolder: '',
    uploading: false
  };

  el: any;
  Kind: string;

  constructor(props) {
    super(props);
    this.el = React.createRef();
  }

  updateFiles = from => {
    let files = [...from];
    this.setState({ files });
    return files;
  };

  componentDidMount() {
    let { owner = {}, listBind = 'Attachments' } = this.props;
    if (owner[listBind]) {
      this.updateFiles(owner[listBind]);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { uploading } = this.state;
    if (uploading) return;

    const { files: prevFiles, targetFolder: prevTargetFolder } = prevState;

    let { owner = {}, listBind = 'Attachments', folderBind = 'AttachmentsFolder' } = this.props;

    let targetFolder = owner[folderBind];
    if (targetFolder != prevTargetFolder) {
      this.setState({ targetFolder });
    }

    let files = owner[listBind];
    if (files && files.length != prevFiles.length) {
      this.updateFiles(files);
      return;
    }

    //TODO: Verify comparision:
    // if (files !== prevFiles) {
    //   console.log('files !== prevFiles, updating...');
    //   this.updateFiles(files);
    // }
  }

  _onChange = async files => {
    let { owner = {}, kind = '', onChange, listBind = 'Attachments', folderBind = 'AttachmentsFolder', directUpload } = this.props;
    let { targetFolder } = this.state as any;

    let statedFiles = this.updateFiles(files);

    owner[listBind] = statedFiles;

    if (targetFolder) {
      owner[folderBind] = owner[folderBind] || targetFolder;
    }

    if (directUpload) await this.uploadFiles();

    if (onChange) onChange(files, listBind, folderBind, targetFolder, directUpload, kind);
  };

  onFilesAdded = addedFiles => {
    let { kind = '' } = this.props;
    let { files, targetFolder } = this.state as any;

    let adaptedAddedFiles = addedFiles.map(file => {
      file.FileName = file.name;
      file.Directory = targetFolder;
      file.AttachmentKind = kind;
      file.isForUpload = true;
      return file;
    });

    files = [...files, ...adaptedAddedFiles];

    this._onChange(files);
  };

  uploadFiles = async () => {
    const { owner, afterUpload } = this.props;
    let { files } = this.state as any;

    let filesToUpload = files.filter(file => file.isForUpload);
    if (filesToUpload.length > 0) {
      this.setState({ uploading: true });
      try {
        for (let [index] of filesToUpload.entries()) {
          files = await this.sendRequest(filesToUpload[index]);
        }

        if (afterUpload) await afterUpload();
      } catch (e) {
        console.log(e);
        alert(JSON.stringify(e, null, 3));
      } finally {
        this.setState({ uploading: false });
      }
    }

    return owner;
  };

  sendRequest = async file => {
    let { files, targetFolder } = this.state;

    const formData = new FormData();
    formData.append('file', file, file.FileName);
    formData.append('AttachmentKind', this.Kind);
    formData.append('TargetFolder', targetFolder);

    try {
      let response = await Request('POST', 'Attachment.json', formData);

      let updatedFile;
      let updatedFiles = files.map((f: any) => {
        if (f.FileName == file.FileName) {
          updatedFile = { ...f };
          updatedFile.isForUpload = false;
          return updatedFile;
        }
        return f;
      });

      if (targetFolder != response.Directory) {
        this.setState({ targetFolder: response.Directory });
      }

      this._onChange(updatedFiles);
      return updatedFiles;
    } catch {
      return (file.status = 'error');
    }
  };

  openDialog = () => {
    let { readOnly } = this.props;
    !readOnly && this.el.current.open && this.el.current.open();
  };

  removeFile = (file, index) => {
    let { files } = this.state;
    let updatedFiles;

    if (file.isForUpload) updatedFiles = files.filter((f, i) => i != index);
    else
      updatedFiles = files.map((f: any, i: number) => {
        if (i == index) {
          let updatedFile = { ...f };
          updatedFile.ToDelete = true;
          return updatedFile;
        }
        return f;
      });

    this._onChange(updatedFiles);
  };

  directRemove = file => {
    let { onChange, listBind = 'Attachments', afterDelete } = this.props;
    const avatar = { ...file };
    avatar.ImageBase64 = null;
    if (confirm('Are you sure you want to remote current avatar?')) {
      console.log('Remove Avatar', avatar);
      return Request('POST', `Attachment/delete/${this.Kind}/${avatar.Directory}/${avatar.FileName}`, {})
        .then(response => {
          if (afterDelete) afterDelete();
          this._onChange([]);
        })
        .catch(ex => console.log(ex));
    }
  };

  cancelRemove = (file, index) => {
    let { files } = this.state as any;

    let updatedFiles = files.map((f, i) => {
      if (i == index) {
        let updatedFile = { ...f };
        updatedFile.ToDelete = false;
        return updatedFile;
      }
      return f;
    });

    this._onChange(updatedFiles);
  };

  render() {
    let { files } = this.state as any;
    let { avatar, owner = {}, kind = '', listBind = 'Attachments', printMode, readOnly, avatarStyle = {}, noButton } = this.props;

    const api = 'api_' + listBind;
    owner[api] = {};
    owner[api].uploadFiles = this.uploadFiles;

    this.Kind = kind;

    const firstOne = owner[listBind] ? owner[listBind][0] : {};

    if (avatar) {
      return (
        <Grid item xs style={{ marginTop: 5 }}>
          <Dropzone
            ref={this.el}
            multiple
            onDrop={this.onFilesAdded}
            noClick
            onDragEnter={() => this.setState({ border: 'blue' })}
            onDragLeave={() => this.setState({ border: '#e0e0e0' })}
            onDropAccepted={() => this.setState({ border: '#e0e0e0' })}
            onDropRejected={() => this.setState({ border: '#e0e0e0' })}
            disabled={readOnly}
          >
            {({ getRootProps, getInputProps }) => (
              <Grid
                container
                direction='column'
                {...getRootProps()}
                className='Attachments'
                style={{ borderColor: (this.state as any).border }}
                tabIndex={-1}
                onDoubleClick={this.openDialog}
              >
                <input {...getInputProps()} style={{ display: 'none' }} />
                {firstOne && firstOne.ImageBase64 ? (
                  <ButtonBase onClick={() => this.directRemove(firstOne)}>
                    <Avatar style={avatarStyle} src={`data:image/png;base64,${firstOne.ImageBase64}`} alt='Avatar' />
                  </ButtonBase>
                ) : (
                  <ButtonBase onClick={this.openDialog}>
                    <Avatar style={avatarStyle} />
                  </ButtonBase>
                )}
              </Grid>
            )}
          </Dropzone>
        </Grid>
      );
    }

    return (
      <Grid item xs style={{ marginTop: 5 }}>
        <Dropzone
          ref={this.el}
          multiple
          onDrop={this.onFilesAdded}
          noClick
          onDragEnter={() => this.setState({ border: 'blue' })}
          onDragLeave={() => this.setState({ border: '#e0e0e0' })}
          onDropAccepted={() => this.setState({ border: '#e0e0e0' })}
          onDropRejected={() => this.setState({ border: '#e0e0e0' })}
          disabled={readOnly}
        >
          {({ getRootProps, getInputProps }) => (
            <Grid
              container
              direction='column'
              {...getRootProps()}
              className='Attachments'
              style={{ borderColor: (this.state as any).border }}
              tabIndex={-1}
              onDoubleClick={this.openDialog}
            >
              <input {...getInputProps()} style={{ display: 'none' }} />
              {files.map((file, index) => {
                return (
                  <Grid container direction='row' key={file.FileName} alignItems='flex-end' className='AttachmentsRow' wrap='nowrap'>
                    {file.isForUpload && <Icon style={{ margin: '0 2px' }}>cloud_upload</Icon>}
                    <Grid item xs zeroMinWidth>
                      <a
                        target='_blank'
                        href={
                          AppConfig.BaseURL +
                          `Attachment/Download?directory=${file.Directory}&filename=${file.FileName}&attachmentKind=${kind}`
                        }
                        style={{
                          cursor: 'pointer',
                          textDecoration: file.ToDelete ? 'line-through' : 'initial',
                          color: file.ToDelete ? 'red' : '',
                          width: '100%',
                          display: 'inline-block'
                        }}
                      >
                        <Grid item xs zeroMinWidth style={{ overflow: 'hidden' }}>
                          <Typography variant='caption' className={file.status} noWrap>
                            {file.FileName}
                          </Typography>
                        </Grid>
                      </a>
                    </Grid>
                    {!printMode && !readOnly && !file.ToDelete && (
                      <IconButton size='small' color='secondary' onClick={() => this.removeFile(file, index)}>
                        <Icon style={{ fontSize: '1em' }}>close</Icon>
                      </IconButton>
                    )}
                    {!printMode && !readOnly && file.ToDelete && (
                      <Button
                        size='small'
                        variant='text'
                        style={{ fontSize: '.6em' }}
                        color='secondary'
                        onClick={() => this.cancelRemove(file, index)}
                      >
                        (cancel remove)
                      </Button>
                    )}
                  </Grid>
                );
              })}
              <Grid container direction='row' alignItems='center' wrap='nowrap'>
                {!readOnly && !noButton && (
                  <Grid item xs>
                    <Button
                      className='hidden-print'
                      variant='contained'
                      color='primary'
                      size='small'
                      onClick={this.openDialog}
                      style={{ margin: 3, fontSize: '.65em', padding: 1 }}
                    >
                      Add Files
                    </Button>
                  </Grid>
                )}
                {!files.length && (
                  <Grid item xs zeroMinWidth>
                    <Typography variant='caption' noWrap>
                      No Files
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Grid>
          )}
        </Dropzone>
      </Grid>
    );
  }
}

export default Attachments;
