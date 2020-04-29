import React, { useState } from 'react';
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';
import { createStage, willCollide } from '../gameHelpers';
import { StyledTetris, StyledTetrisWrapper } from './styles/StyledTetrisWrapper';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useInterval } from '../hooks/useInterval';

const Tetris = () => {
   const [dropTime, setDropTime] = useState(null);
   const [gameOver, setGameOver] = useState(false);

   const [player, updatePlayerPos, resetPlayer, rotatePlayer] = usePlayer();
   const [stage, setStage] = useStage(player, resetPlayer);

   console.log('rendering Tetris');

   const movePlayer = direction => {
      if (!willCollide(player, stage, { x: direction * 2, y: 0 })) {
         updatePlayerPos({ x: direction, y: 0 });
      }
   }

   const startGame = () => {
      // Set initial game state
      setStage(createStage());
      resetPlayer();
      setGameOver(false);
   }

   const drop = () => {
      if (!willCollide(player, stage, { x: 0, y: 1 })) {
         updatePlayerPos({ x: 0, y: 0.5, collided: false });
      } else {
         if (player.pos.y < 1) {
            alert('Game Over!');
            setGameOver(true);
            setDropTime(null);
         }
         updatePlayerPos({ x:0, y:0, collided: true});
      }
   }

   const dropPlayer = () => {
      drop();
   }

   const move = ({ keyCode, shiftKey }) => {
      if (!gameOver) {
         if (keyCode === 37) { // left arrow
            // NOTE!!! some bug somewhere makes me move by half steps :(
            movePlayer(-0.5);
         } else if (keyCode === 39) { // right arrow
            movePlayer(0.5);
         } else if (keyCode === 40) { // down arrow
            dropPlayer();
         } else if (keyCode === 38 && !shiftKey) {
            rotatePlayer(stage, 1);
         } else if (keyCode === 38 && shiftKey) {
            rotatePlayer(stage, -1);
         }
      }
   }

   useInterval(() => {
      drop();
   }, dropTime)

   return (
      <StyledTetrisWrapper role="button" tabIndex={0} onKeyDown={e => move(e)}>
         <StyledTetris>
            <Stage stage={stage} />
            <aside>
               {gameOver ? (
                  <Display gameOver={gameOver} text="Game Over" />
               ) : (
                     <div>
                        <Display text="score" />
                        <Display text="rows" />
                        <Display text="level" />
                     </div>
                  )}
               <StartButton callback={startGame} />
            </aside>
         </StyledTetris>
      </StyledTetrisWrapper>
   )
};

export default Tetris;