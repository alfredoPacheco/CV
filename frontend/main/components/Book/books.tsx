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

import BookService from './book.service';

const service = new BookService();
const defaultConfig = {
  service,
  filterName: 'Books',
  sortname: 'Books'
};

interface BookProps extends ListProps {}

class BooksList extends ListContainer<BookProps> {
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
            Books Here
          </Typography>
        </Container>

        {/* ///end:generated:content<<< */}
      </NoSsr>
    );
  }
}

export default withSnackbar(withRouter(BooksList) as any) as React.ComponentClass<BookProps>;
