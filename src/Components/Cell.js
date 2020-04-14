import React from 'react';
import {StyledCell} from './styles/StyledCell';
import { TETROMINUS } from '../tetrominus';

const Cell = ({type}) => (
   <StyledCell type={type} color={TETROMINUS[type].color} />
);

export default Cell;