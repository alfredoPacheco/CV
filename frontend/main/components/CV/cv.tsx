import React from 'react';
import { withRouter } from 'next/router';
import { NoSsr, Typography, Grid } from '@material-ui/core';
import FormContainer, { FormProps } from '../../core/FormContainer';
import { withSnackbar } from 'notistack';

import CVService from './cv.service';

const service = new CVService();
const defaultConfig = {
  service
};

interface CVProps extends FormProps {}

class CVForm extends FormContainer<CVProps> {
  constructor(props, config) {
    super(props, Object.assign(defaultConfig, config));
  }

  render() {
    let { isLoading, isDisabled, baseEntity } = this.state;

    return (
      <NoSsr>
        {/* ///start:generated:content<<< */}

        {/* ///end:generated:content<<< */}
      </NoSsr>
    );
  }
}

export default withSnackbar(withRouter(CVForm) as any) as React.ComponentClass<CVProps>;
