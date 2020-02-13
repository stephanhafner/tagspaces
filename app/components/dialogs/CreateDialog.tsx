/**
 * TagSpaces - universal file and folder organizer
 * Copyright (C) 2017-present TagSpaces UG (haftungsbeschraenkt)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License (version 3) as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import NoteFileIcon from '@material-ui/icons/DescriptionOutlined';
import TextFileIcon from '@material-ui/icons/InsertDriveFileOutlined';
import MarkdownFileIcon from '@material-ui/icons/GetAppOutlined';
import AddFileIcon from '@material-ui/icons/NoteAddOutlined';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
// import Slide from '@material-ui/core/Slide';
import i18n from '-/services/i18n';
import { getKeyBindingObject } from '-/reducers/settings';
import { actions as AppActions } from '-/reducers/app';
import AppConfig from '-/config';
import { normalizePath } from '-/utils/paths';
import PlatformIO from '-/services/platform-io';
import { formatDateTime4Tag } from '-/utils/misc';

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="down" ref={ref} {...props} />;
// });

const styles: any = () => ({
  root: {
    dispatch: 'flex',
    minWidth: 200,
    minHeight: 300,
    overflow: 'overlay',
    alignSelf: 'center'
  },
  grid: {
    flexGrow: 1,
    width: '100%',
    height: '100%'
  },
  createButton: {
    minHeight: 100,
    width: '100%',
    textAlign: 'center'
  }
});

interface Props {
  open: boolean;
  classes: any;
  selectedDirectoryPath: string;
  chooseDirectoryPath: (path: string) => void;
  showNotification: (message: string, type: string, autohide: boolean) => void;
  reflectCreateEntry: (path: string, isFile: boolean) => void;
  createFileAdvanced: (
    targetPath: string,
    fileName: string,
    content: string,
    fileType: string
  ) => void;
  onClose: () => void;
}

const CreateDialog = (props: Props) => {
  let fileInput: HTMLInputElement;
  const fileName =
    'note' +
    AppConfig.beginTagContainer +
    formatDateTime4Tag(new Date(), true) +
    AppConfig.endTagContainer;
  const fileContent = '';
  const {
    classes,
    selectedDirectoryPath,
    showNotification,
    open,
    onClose
  } = props;

  function handleKeyPress(event: any) {
    if (event.key === 'n') {
      event.stopPropagation();
      createRichTextFile();
    } else if (event.key === 't') {
      event.stopPropagation();
      createTextFile();
    } else if (event.key === 'm') {
      event.stopPropagation();
      createMarkdownFile();
    } else if (event.key === 'a') {
      event.stopPropagation();
      addFile();
    }
  }

  function createRichTextFile() {
    if (selectedDirectoryPath) {
      props.createFileAdvanced(
        selectedDirectoryPath,
        fileName,
        fileContent,
        'html'
      );
      props.onClose();
    }
  }

  function createTextFile() {
    if (selectedDirectoryPath) {
      props.createFileAdvanced(
        selectedDirectoryPath,
        fileName,
        fileContent,
        'txt'
      );
      props.onClose();
    }
  }

  function createMarkdownFile() {
    if (selectedDirectoryPath) {
      props.createFileAdvanced(
        selectedDirectoryPath,
        fileName,
        fileContent,
        'md'
      );
      props.onClose();
    }
  }

  function addFile() {
    fileInput.click();
  }

  // function loadImageLocal() {
  //   props.onClose();
  //   navigator.camera.getPicture(onCameraSuccess, onFail, {
  //     destinationType: Camera.DestinationType.FILE_URI,
  //     sourceType: Camera.PictureSourceType.PHOTOLIBRARY
  //   });
  // }

  // function cameraTakePicture() {
  //   props.onClose();
  //   navigator.camera.getPicture(onCameraSuccess, onFail, {
  //     // quality: 50,
  //     destinationType: Camera.DestinationType.FILE_URI, // DATA_URL, // Return base64 encoded string
  //     // encodingType: Camera.EncodingType.JPEG,
  //     mediaType: Camera.MediaType.PICTURE // ALLMEDIA
  //   });
  // }

  function handleFileInputChange(selection: any) {
    // console.log("Selected File: "+JSON.stringify(selection.currentTarget.files[0]));
    const file = selection.currentTarget.files[0];
    const filePath =
      normalizePath(selectedDirectoryPath) +
      AppConfig.dirSeparator +
      decodeURIComponent(file.name);

    const reader = new FileReader();
    reader.onload = (event: any) => {
      PlatformIO.getPropertiesPromise(filePath)
        .then(entryProps => {
          if (entryProps) {
            showNotification(
              'File with the same name already exist, importing skipped!',
              'warning',
              true
            );
          } else {
            PlatformIO.saveBinaryFilePromise(
              filePath,
              event.currentTarget.result,
              true
            )
              .then(() => {
                showNotification(
                  'File ' + filePath + ' successfully imported.',
                  'default',
                  true
                );
                props.reflectCreateEntry(filePath, true);
                props.onClose();
                return true;
              })
              .catch(error => {
                // TODO showAlertDialog("Saving " + filePath + " failed.");
                console.error('Save to file ' + filePath + ' failed ' + error);
                showNotification(
                  'Importing file ' + filePath + ' failed.',
                  'error',
                  true
                );
                props.onClose();
                return true;
              });
          }
          return true;
        })
        .catch(err => {
          console.log('Error getting properties ' + err);
          props.onClose();
        });
    };

    if (AppConfig.isCordova) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      keepMounted
      scroll="paper"
      // onEnterKey={(event) => onEnterKeyHandler(event, this.addTags)}
      // TransitionComponent={Transition}
    >
      <DialogTitle style={{ alignSelf: 'center' }}>
        Create new content
      </DialogTitle>
      <DialogContent
        onKeyPress={handleKeyPress}
        className={classes.root}
        data-tid="keyboardShortCutsDialog"
      >
        <Grid className={classes.grid} container spacing={1}>
          <Grid item xs>
            <Button
              onClick={createRichTextFile}
              className={classes.createButton}
            >
              <div>
                <NoteFileIcon />
              </div>
              <div>
                <Container>Create Note</Container>
              </div>
            </Button>
          </Grid>
          <Grid item xs>
            <Button onClick={createTextFile} className={classes.createButton}>
              <TextFileIcon />
              <Container>Create Text File</Container>
            </Button>
          </Grid>
        </Grid>
        <Grid className={classes.grid} container spacing={1}>
          <Grid item xs>
            <Button
              onClick={createMarkdownFile}
              className={classes.createButton}
            >
              <MarkdownFileIcon />
              <Container>Create Markdown File</Container>
            </Button>
          </Grid>
          <Grid item xs>
            <Button onClick={addFile} className={classes.createButton}>
              <AddFileIcon />
              <Container>Add file</Container>
            </Button>
          </Grid>
        </Grid>
        <input
          style={{ display: 'none' }}
          ref={input => {
            fileInput = input;
          }}
          accept="*"
          type="file"
          onChange={handleFileInputChange}
        />
      </DialogContent>
      <DialogActions style={{ alignSelf: 'center' }}>
        <Button
          data-tid="closeKeyboardDialog"
          onClick={props.onClose}
          color="primary"
        >
          {i18n.t('core:close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function mapStateToProps(state) {
  return {
    keyBindings: getKeyBindingObject(state)
  };
}

function mapActionCreatorsToProps(dispatch) {
  return bindActionCreators(
    {
      createFileAdvanced: AppActions.createFileAdvanced,
      showNotification: AppActions.showNotification,
      reflectCreateEntry: AppActions.reflectCreateEntry
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapActionCreatorsToProps
)(withStyles(styles)(CreateDialog));
