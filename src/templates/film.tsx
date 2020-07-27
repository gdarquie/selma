import React from "react";
import Layout from "../components/layout";
import {
  Paper,
  Grid,
  Container,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Box,
  Typography
} from "@material-ui/core"
import "../styles/filmPage.css";
import { Link } from "gatsby";
import Property from "../components/molecules/Property";
import PropertiesList from "../components/organisms/PropertiesList";
import MovieIcon from "@material-ui/icons/Movie";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { ResponsiveBullet } from '@nivo/bullet';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const FilmPage = ({ pageContext: { film } }) =>  {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // for highcharts
  const options = {
    title: {
      text: 'My chart'
    },
    series: [{
      data: [1, 2, 3]
    }]
  }

  // for nivo
  const data = [
    {
      "id": "number",
      "ranges": [
        171,
        6000,
        10000,
        14000
      ],
      "measures": [
        film.length
      ],
      "markers": []
    },
    {
      "id": "power",
      "ranges": [
        0.27507857592556445,
        0.06810591194577384,
        0.9972460527280638,
        0,
        2
      ],
      "measures": [
        0.3013347865559584,
        1.8190607705848003
      ],
      "markers": [
        1.704352129940991
      ]
    },
  ];

  // for recharts
  const rechartsData = [
    {
      name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
    },
    {
      name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
    },
    {
      name: 'Page C', uv: 2000, pv: 9800, amt: 2290,
    },
    {
      name: 'Page D', uv: 2780, pv: 3908, amt: 2000,
    },
    {
      name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
    },
    {
      name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
    },
    {
      name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
    },
  ];

  function getGeneralProperties() {
    return [
      {"title": "Sample", "content": film.sample },
      {"title": "Studio", "content": film.studios, "type":'list', "options": { "listPropertyTitle": "name"}},
      {"title": "IMDB link", "content": <a href={'https://www.imdb.com/title/'+film.imdb} target={'_blank'}>{film.imdb}</a>},
      {"title": "VIAF", "content": film.viaf, "type":'viaf'},
      {"title": "Director(s)", "content": film.directors, "type":'attributeList', "model":"person", "options": { "listPropertyTitle": "fullname"}},
      {"title": "Release date (New York)", "content": film.releasedYear === 0 ? 'NA' : film.releasedYear },
      {"title": "Production date",  "content": film.productionYear === 0 ? 'NA' : film.productionYear},
    ];
  }

  function getRecyclingProperties() {
    return [
      {"title": "Adaptation", "content": film.adaptation, "type":'attributeList', "model":"attribute", "options": { "listPropertyTitle": "title"}},
      {"title": "Shows", "content": film.stageshows },
      {"title": "Remake", "content": film.remake },
    ];
  }

  function getCensorshipProperties() {
    return [
      {"title": "PCA Verdict on the first submitted script", "content": film.pca, "type":'attributeList', "model":"attribute", "options": { "listPropertyTitle": "title"}},
      {"title": "Censored Content", "content": film.censorships, "type":'attributeList', "model":"attribute", "options": { "listPropertyTitle": "title"} },
      {"title": "States where the film was censored", "content": film.states, "type":'attributeList', "model":"attribute", "options": { "listPropertyTitle": "title"} },
      {"title": "Legion of Decency", "content": film.legion, "type":'attributeList', "model":"attribute", "options": { "listPropertyTitle": "title"} },
      {"title": "Protestant Motion Picture Council", "content": film.protestant, "type":'attributeList', "model":"attribute", "options": { "listPropertyTitle": "title"} },
      {"title": "Harrison's Report", "content": film.harrison, "type":'attributeList', "model":"attribute", "options": { "listPropertyTitle": "title"} },
      {"title": "Film Estimate Board of National Organizations", "content": film.board, "type":'attributeList', "model":"attribute", "options": { "listPropertyTitle": "title"} },
    ];
  }

  const CustomRange = () => (
    <rect
      x={2}
      y={50}
      rx={5}
      ry={5}
      width="30%"
      height="20%"
      fill="red"
    />
  )

  return (
    <Layout>
      <Container className='container' maxWidth="lg">
        <div className="main-item-title-wrapper">
          <Typography variant="h2" className="main-item-title">
            <MovieIcon className="icon-main-item"/>
            {film.title}
          </Typography>
        </div>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={4} lg={3}>
            <Paper>
              <Box display={{ xs: "none", md: "block" }}>
                <img className='poster' src={'http://mc2.labex-arts-h2h.univ-paris8.fr/img/films/'+film.imdb+'.jpg'}/>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={12} md={8} lg={3}>
            <PropertiesList title='Censorship' data={getGeneralProperties()} />
          </Grid>

          <Grid item xs={12} sm={12} md={8} lg={3}>
            <PropertiesList title='Recycling' data={getRecyclingProperties()} />
          </Grid>

          <Grid item xs={12} sm={12} md={8} lg={3}>
            <PropertiesList title='Censorship' data={getCensorshipProperties()} />
          </Grid>

        </Grid>

        <Paper className='category-section numbers-paper' elevation={0}>
          <h2 className='properties-title'>Numbers</h2>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="Numbers list">
              <TableHead>
                <TableRow>
                  <TableCell>Position</TableCell>
                  <TableCell align="left">Title</TableCell>
                  <TableCell align="right">Starting time code</TableCell>
                  <TableCell align="right">Ending time code</TableCell>
                  <TableCell align="right">Length</TableCell>
                  <TableCell align="right">Performers</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {film.numbers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((number) => (
                  <TableRow key={number.uuid} hover role="checkbox" tabIndex={-1}>
                    <TableCell component="th" scope="row">{number.order+1}</TableCell>
                    <TableCell align="left"><Link to={/number/+number.uuid}>{number.title}</Link></TableCell>
                    <TableCell align="right"><Property data={{content: number.beginTc, type: 'timecode'}} /></TableCell>
                    <TableCell align="right"><Property data={{content: number.endTc, type: 'timecode'}} /></TableCell>
                    <TableCell align="right"><Property data={{content: number.length, type: 'timecode'}} /></TableCell>
                    <TableCell align="right">
                      <Property data={{"content": number.performers, "type":'attributeList', "model":"person", "options": { "listPropertyTitle": "fullname"}}}/>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={film.numbers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>

        {/*// Stats*/}
        <section>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <Box className='stat-box numbers-minutes-box'>
                <div className="stat-value">{Math.round(film.numbersLength/60)} min</div>
                <div className="stat-label stat-numbers-minutes">Running time for all numbers</div>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className='stat-box movie-minutes-box'>
                <div className="stat-value">{Math.round(film.length/60)} min</div>
                <div className="stat-label stat-movie-minutes">Movie running time</div>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className='stat-box numbers-seconds-box'>
                <div className="stat-value">{film.numbersLength} sec</div>
                <div className="stat-label stat-numbers-seconds">Running time for all numbers</div>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className='stat-box film-seconds-box'>
                <div className="stat-value">{film.length} sec</div>
                <div className="stat-label stat-film-seconds">Movie running time</div>
              </Box>
            </Grid>
            <Grid item xs={12} md={12}>
              <Box className='stat-box ratio-box'>
                <div className="stat-value">{film.numbersRatio/100}%</div>
                <div className="stat-label stat-ratio">Ratio number/total length</div>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className='stat-box average-box'>
                <div className="stat-value">{film.averageNumberLength} sec</div>
                <div className="stat-label stat-average">Average running time for the numbers in {film.title}</div>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className='stat-box global-average-box'>
                <div className="stat-value">{film.globalAverageNumberLength} sec</div>
                <div className="stat-label stat-global-average">Average running time for the numbers for all the movies</div>
              </Box>
            </Grid>
          </Grid>
        </section>
        {/*end of stats*/}

        <section className="film-timeline">

          <LineChart width={600} height={300} data={rechartsData}>
              <Line type="monotone" dataKey="uv" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis />
          </LineChart>


          {/*<ResponsiveBullet*/}
          {/*  data={data}*/}
          {/*  margin={{ top: 50, right: 90, bottom: 50, left: 90 }}*/}
          {/*  spacing={60}*/}
          {/*  titleAlign="start"*/}
          {/*  titleOffsetX={-70}*/}
          {/*  measureSize={0.25}*/}
          {/*  markerSize={1.45}*/}
          {/*  axisPosition="before"*/}
          {/*  animate={true}*/}
          {/*  motionStiffness={130}*/}
          {/*  motionDamping={20}*/}
          {/*  rangeComponent={CustomRange}*/}
          {/*/>*/}


          {/*<HighchartsReact*/}
          {/*  highcharts={Highcharts}*/}
          {/*  options={options}*/}
          {/*/>*/}
        </section>
      </Container>
    </Layout>
  );
};
export default FilmPage;