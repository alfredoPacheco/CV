import React from 'react';
import { withRouter } from 'next/router';
import { withSnackbar } from 'notistack';
import { NoSsr, Typography, Grid } from '@material-ui/core';
import SearchBox from '../../widgets/Searchbox';
import Pagination from 'react-js-pagination';
import ListContainer, { ListProps } from '../../core/ListContainer';

///start:generated:dependencies<<<
import { Container } from '@material-ui/core';
///end:generated:dependencies<<<

import GitActivityService from './gitactivity.service';

const service = new GitActivityService();
const defaultConfig = {
  service,
  filterName: 'GitActivitys',
  sortname: 'GitActivitys'
};

interface GitActivityProps extends ListProps {}

class GitActivitysList extends ListContainer<GitActivityProps> {
  constructor(props, config) {
    super(props, Object.assign(defaultConfig, config));
  }

  render() {
    let { isLoading, baseEntity, baseList, filterOptions, isDisabled } = this.state;

    return (
      <NoSsr>
        {/* ///start:generated:content<<< */}

        <Container style={{ padding: 20 }} maxWidth={false}>
          <Typography variant='h1' gutterBottom>
            Git Activity
          </Typography>
        </Container>

        {/* ///end:generated:content<<< */}
      </NoSsr>
    );
  }
}

export default withSnackbar(withRouter(GitActivitysList) as any) as React.ComponentClass<GitActivityProps>;
