import { useState, useCallback } from 'react';

import { TETROMINUS, randomTetromino } from '../tetrominus';
import { STAGE_WIDTH, willCollide } from '../gameHelpers';

export const usePlayer = () => {
   const [player, setPlayer] = useState({
      pos: { x: 0, y: 0 },
      tetromino: TETROMINUS[0].shape,
      collided: false
   });

   const rotate = (matrix, dir) => {
      // transpose rows into columns
      const rotatedTetro = matrix.map((_, index) => 
         matrix.map(col => col[index]),
      );

      // reverse each row to get rotated tetro
      if (dir > 0) return rotatedTetro.map(row => row.reverse());

      return rotatedTetro.reverse();
   }

   const rotatePlayer = (stage, dir) => {
      const clonedPlayer = JSON.parse(JSON.stringify(player));
      clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);

      const posX = clonedPlayer.pos.x;
      let offset = 1;
      while (willCollide(clonedPlayer, stage, {x: 0, y:0})) {
         clonedPlayer.pos.x += offset;
         offset = -(offset + (offset > 0 ? 1 : -1));
         if (offset > clonedPlayer.tetromino[0].length) {
            rotate(clonedPlayer.tetromino, -dir);
            clonedPlayer.pos.x = posX;
            return;
         }
      }

      setPlayer(clonedPlayer);
   }

   const updatePlayerPos = ({ x, y, collided }) => {
      setPlayer(prev => ({
         ...prev,
         pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
         collided: collided
      }))
   };

   const resetPlayer = useCallback(() => {
      setPlayer({
         pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
         tetromino: randomTetromino().shape,
         collided: false
      })
   }, [])

   return [player, updatePlayerPos, resetPlayer, rotatePlayer];
}

