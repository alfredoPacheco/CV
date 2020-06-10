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

import SkillService from './skill.service';

const service = new SkillService();
const defaultConfig = {
  service,
  filterName: 'Skills',
  sortname: 'Skills'
};

interface SkillProps extends ListProps {}

class SkillsList extends ListContainer<SkillProps> {
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
            Skills
          </Typography>
        </Container>

        {/* ///end:generated:content<<< */}
      </NoSsr>
    );
  }
}

export default withSnackbar(withRouter(SkillsList) as any) as React.ComponentClass<SkillProps>;
