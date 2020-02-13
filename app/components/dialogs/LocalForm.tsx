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

import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import FolderIcon from '@material-ui/icons/Folder';
import i18n from '-/services/i18n';
import AppConfig from '-/config';
import { extractDirectoryName } from '-/utils/paths';
import PlatformIO from '-/services/platform-io';

interface Props {
  state: any;
  handleChange: (param1: string, param2: string) => void;
  handleInputChange: (event: any) => void;
  showSelectDirectoryDialog: () => void;
}

class LocalForm extends React.Component<Props> {
  openDirectory = () => {
    if (AppConfig.isElectron) {
      PlatformIO.selectDirectoryDialog()
        .then(selectedPaths => {
          this.props.handleChange('path', selectedPaths[0]);
          if (this.props.state.name.length < 1) {
            this.props.handleChange(
              'name',
              extractDirectoryName(selectedPaths[0])
            );
          }
          return true;
        })
        .catch(err => {
          console.log('selectDirectoryDialog failed with: ' + err);
        });
    } else {
      this.props.showSelectDirectoryDialog();
    }
  };

  render() {
    const { handleInputChange, state } = this.props;

    return (
      <div>
        <FormControl fullWidth={true} error={state.errorTextName}>
          <TextField
            error={state.errorTextName}
            required
            autoFocus
            margin="dense"
            name="name"
            label={i18n.t('core:createLocationName')}
            onChange={handleInputChange}
            value={state.name}
            data-tid="locationName"
            fullWidth={true}
          />
          {state.errorTextName && (
            <FormHelperText>{i18n.t('core:invalidName')}</FormHelperText>
          )}
        </FormControl>
        <FormControl fullWidth={true} error={state.errorTextPath}>
          <InputLabel htmlFor="path">
            {i18n.t('core:createLocationPath')}
          </InputLabel>
          <Input
            required
            margin="dense"
            name="path"
            fullWidth={true}
            data-tid="locationPath"
            onChange={handleInputChange}
            value={state.path}
            endAdornment={
              <InputAdornment position="end" style={{ height: 32 }}>
                <IconButton onClick={this.openDirectory}>
                  <FolderIcon />
                </IconButton>
              </InputAdornment>
            }
          />
          {state.errorTextPath && (
            <FormHelperText>{i18n.t('core:invalidPath')}</FormHelperText>
          )}
        </FormControl>
      </div>
    );
  }
}

export default LocalForm;
