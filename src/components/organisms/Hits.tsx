import React, {useState} from "react";
import { connectHits } from 'react-instantsearch-dom';
import { Grid, Typography } from "@material-ui/core";
import { Link } from "gatsby";
import NumberCartel from "../molecules/cartels/NumberCartel";
import FilmCartel from "../molecules/cartels/FilmCartel";
import PersonCartel from "../molecules/cartels/PersonCartel";
import SongCartel from "../molecules/cartels/SongCartel";
import Cartel from "../molecules/cartels/Cartel";

const Hits = ({ hits }) => {
    return (
        hits.map(hit => {
            switch (hit.modelType) {
                case 'number':
                  return <Cartel key={hit.uuid}><NumberCartel data={hit} /></Cartel>
                case 'film':
                  return <Cartel key={hit.uuid}><FilmCartel data={hit} /></Cartel>
                case 'person':
                  return <Cartel key={hit.uuid}><PersonCartel data={hit} /></Cartel>
                case 'song':
                  return <Cartel key={hit.uuid}><SongCartel data={hit} /></Cartel>
                default:
                  console.log('Error, unrecognized modelType .');
            }
        })
    );
}

const CustomHits = connectHits(Hits);

export default CustomHits;