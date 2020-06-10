import React from 'react';
import { withRouter } from 'next/router';
import { NoSsr, Typography, Grid } from '@material-ui/core';
import FormContainer, { FormProps } from '../../core/FormContainer';
import { withSnackbar } from 'notistack';

///start:generated:dependencies<<<
import Courses from '../../components/Course/courses';
import Books from '../../components/Book/books';
import Skills from '../../components/Skill/skills';
import Portfolio from '../../components/Project/portfolio';
import GitActivity from '../../components/GitActivity/git.activity';
import { Container } from '@material-ui/core';
///end:generated:dependencies<<<

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

        <Container className='md' style={{ padding: 20 }} maxWidth='md'>
          <Grid item container direction='row' justify='center' spacing={2} alignItems='baseline'>
            <Grid item container direction='column' xs={1}>
              <a href='#'>Download Resume</a>
            </Grid>

            <Grid item container direction='column' className='text-right' xs={11}>
              <p>Last Updated: Jun 2020</p>

              <Typography variant='h2' gutterBottom>
                Software Engineer
              </Typography>

              <Typography variant='h4' gutterBottom>
                Jesus Alfredo Pacheco Figueroa
              </Typography>

              <a href='mailto:j.alfredo.pacheco@gmail.com'>j.alfredo.pacheco@gmail.com</a>
            </Grid>
          </Grid>

          <Typography variant='h5' gutterBottom>
            Profile
          </Typography>

          <p className='text-justify'>
            More than 10 years doing the beautiful art of Software Development, I am a full-stack systems engineer, a self-taught person
            always looking for optimization, efficiency, edge-technologies, best practices for coding.
            <br />
            <br />I feel with confidence on making an entire enterprise application, from the database to the CSS styles and I have a set of
            Reusable Modules with which I can perform your application in faster times.
          </p>

          <Typography variant='h5' gutterBottom>
            Career
          </Typography>

          <p>
            "Ingeniero en Sistemas Computacionales" at Instituto Tecnologico de Ciudad Juarez
            <br />
            (With Cedula)
          </p>

          <Typography variant='h5' gutterBottom>
            Courses
          </Typography>

          <Courses />

          <Typography variant='h5' gutterBottom>
            Books / Resources Read
          </Typography>

          <Books />

          <Typography variant='h5' gutterBottom>
            Skills
          </Typography>

          <Skills />

          <Typography variant='h5' gutterBottom>
            Portfolio
          </Typography>

          <Portfolio />

          <Typography variant='h5' gutterBottom>
            About me
          </Typography>

          <p>
            At my beginnings by 2005, I started with Visual Basic 6.0 where I learned the programming basics and I began loving to code,
            made a couple of systems, then I moved on into a more serious language, Java. I learned how to program object-oriented and
            reinforced my knowledge by taking some courses at Educacion IT.
            <br />
            <br />
            Some friends and I made our own Company called Inspiracode, we did it for about 4 years, and we got failures and successes with
            several customers and the learning was of multple kinds of aspects, from requirements gathering, deployments to windows/linux,
            our first SPA framework EnyoJS (from HP) by 2013, Enterprise applications with J2EE, source control with git, and many other
            things that I don't even remember.
            <br />
            <br />
            Capsonic was my first employer as an official Software Developer, and this time I had to move to .Net technologies for Backend
            side, jQuery and AngularJS for FrontEnd side and Real Time with Web Sockets.
            <br />
            <br />
            Technology is growing rapidly and a programmer needs to be always up to date. It is a habit for me to spend one or two hours per
            day on learning new stuff regarding to code, technology and frameworks. I've been doing apps or tools to help me out in almost
            all my jobs, as well as making software independently on my free time.
          </p>

          <Typography variant='h5' gutterBottom>
            Contribution activity
          </Typography>

          <GitActivity />
        </Container>

        {/* ///end:generated:content<<< */}
      </NoSsr>
    );
  }
}

export default withSnackbar(withRouter(CVForm) as any) as React.ComponentClass<CVProps>;
