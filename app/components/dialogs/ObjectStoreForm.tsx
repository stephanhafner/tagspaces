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
import CreatableSelect from 'react-select/creatable';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import i18n from '-/services/i18n';

export const suggestions = [
  { label: 'us-east-2 (US East Ohio)', value: 'us-east-2' },
  { label: 'us-east-1 (US East N. Virginia)', value: 'us-east-1' },
  { label: 'us-west-1 (US West N. California)', value: 'us-west-1' },
  { label: 'us-west-2 (US West Oregon)', value: 'us-west-2' },
  { label: 'ap-south-1 (Asia Pacific Mumbai)', value: 'ap-south-1' },
  {
    label: 'ap-northeast-3 (Asia Pacific Osaka-Local)',
    value: 'ap-northeast-3'
  },
  { label: 'ap-northeast-2 (Asia Pacific Seoul)', value: 'ap-northeast-2' },
  { label: 'ap-southeast-1 (Asia Pacific Singapore)', value: 'ap-southeast-1' },
  { label: 'ap-southeast-2 (Asia Pacific Sydney)', value: 'ap-southeast-2' },
  { label: 'ap-northeast-1 (Asia Pacific Tokyo)', value: 'ap-northeast-1' },
  { label: 'ca-central-1 (Canada Central)', value: 'ca-central-1' },
  { label: 'cn-north-1 (China Beijing)', value: 'cn-north-1' },
  { label: 'cn-northwest-1 (China Ningxia)', value: 'cn-northwest-1' },
  { label: 'eu-central-1 (EU Frankfurt)', value: 'eu-central-1' },
  { label: 'eu-west-1 (EU Ireland)', value: 'eu-west-1' },
  { label: 'eu-west-2 (EU London)', value: 'eu-west-2' },
  { label: 'eu-west-3 (EU Paris)', value: 'eu-west-3' },
  { label: 'sa-east-1 (South America São Paulo)', value: 'sa-east-1' }
];

const styles: any = (theme: any) => ({
  root: {
    flexGrow: 1,
    height: 250
  },
  input: {
    display: 'flex',
    padding: 0,
    height: 36,
    marginTop: 10
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden'
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2)
  },
  singleValue: {
    fontSize: 16
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16
  },
  paper: {
    // position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  divider: {
    height: theme.spacing(2)
  }
});

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps
        }
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      ref={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
}

function Menu(props) {
  return (
    <Paper
      elevation={2}
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  MultiValue: undefined,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer
};

interface Props {
  state: any;
  handleChange: (name: string, value: any) => void;
  handleInputChange: (event: any) => void;
  classes: any;
  theme: any;
}

class ObjectStoreForm extends React.Component<Props> {
  handleChange = name => value => {
    this.props.handleChange(name, value);
  };

  handleInputSelectChange = (inputValue: any, actionMeta: any) => {
    if (actionMeta.action === 'set-value') {
      suggestions.push({
        label: this.props.state.region,
        value: this.props.state.region
      });
    } else if (actionMeta.action === 'input-change') {
      this.props.handleChange('region', inputValue);
    }
  };

  render() {
    const { classes, theme, handleInputChange, state } = this.props;

    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit'
        }
      })
    };

    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth={true} error={state.cloudErrorTextName}>
            <InputLabel htmlFor="storeName">
              {i18n.t('core:createLocationName')}
            </InputLabel>
            <Input
              required
              margin="dense"
              name="storeName"
              fullWidth={true}
              data-tid="locationName"
              onChange={handleInputChange}
              value={state.storeName}
            />
            {state.cloudErrorTextName && (
              <FormHelperText>{i18n.t('core:invalidName')}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth={true} error={state.cloudErrorTextPath}>
            <InputLabel htmlFor="path">
              {i18n.t('core:createLocationPath')}
            </InputLabel>
            <Input
              margin="dense"
              name="storePath"
              fullWidth={true}
              data-tid="locationPath"
              onChange={handleInputChange}
              value={state.storePath}
            />
            {state.cloudErrorTextPath && (
              <FormHelperText>{i18n.t('core:invalidPath')}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth={true} error={state.cloudErrorAccessKey}>
            <InputLabel htmlFor="accessKeyId">
              {i18n.t('core:accessKeyId')}
            </InputLabel>
            <Input
              margin="dense"
              name="accessKeyId"
              fullWidth={true}
              data-tid="accessKeyId"
              onChange={handleInputChange}
              value={state.accessKeyId}
            />
            {state.cloudErrorAccessKey && (
              <FormHelperText>{i18n.t('core:invalidAccessKey')}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth={true} error={state.cloudErrorSecretAccessKey}>
            <InputLabel htmlFor="secretAccessKey">
              {i18n.t('core:secretAccessKey')}
            </InputLabel>
            <Input
              margin="dense"
              name="secretAccessKey"
              type="password"
              fullWidth={true}
              data-tid="secretAccessKey"
              onChange={handleInputChange}
              value={state.secretAccessKey}
            />
            {state.cloudErrorSecretAccessKey && (
              <FormHelperText>
                {i18n.t('core:invalidSecretAccessKey')}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={5}>
          <FormControl error={state.cloudErrorBucketName}>
            <InputLabel htmlFor="bucketName">
              {i18n.t('core:bucketName')}
            </InputLabel>
            <Input
              required
              margin="dense"
              name="bucketName"
              fullWidth={true}
              data-tid="bucketName"
              onChange={handleInputChange}
              value={state.bucketName}
            />
            {state.cloudErrorBucketName && (
              <FormHelperText>
                {i18n.t('core:invalidBucketName')}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={7}>
          <FormControl fullWidth={true} error={state.cloudErrorRegion}>
            <NoSsr>
              <CreatableSelect
                isClearable
                classes={classes}
                options={suggestions}
                styles={selectStyles}
                fullWidth={true}
                components={components}
                value={state.region}
                onChange={this.handleChange('region')}
                onInputChange={this.handleInputSelectChange}
                placeholder={i18n.t('core:regionSearch')}
              />
            </NoSsr>
            {state.cloudErrorRegion && (
              <FormHelperText>{i18n.t('core:invalidRegion')}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ObjectStoreForm);
