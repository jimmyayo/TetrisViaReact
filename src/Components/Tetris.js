import React, { useState } from 'react';
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';
import { createStage, willCollide } from '../gameHelpers';
import { StyledTetris, StyledTetrisWrapper } from './styles/StyledTetrisWrapper';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useInterval } from '../hooks/useInterval';
import { useGameStatus} from '../hooks/useGameStatus';


const Tetris = () => {
   const [dropTime, setDropTime] = useState(null);
   const [gameOver, setGameOver] = useState(false);

   const [player, updatePlayerPos, resetPlayer, rotatePlayer] = usePlayer();
   const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
   const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);

   console.log('rendering Tetris');

   const movePlayer = direction => {
      if (!willCollide(player, stage, { x: direction * 2, y: 0 })) {
         updatePlayerPos({ x: direction, y: 0 });
      }
   }

   const startGame = () => {
      // Set initial game state
      setStage(createStage());
      setDropTime(1000 / (level + 1) + 200);
      resetPlayer();
      setGameOver(false);
      setScore(0);
      setRows(0);
      setLevel(0);
   }

   const drop = () => {
      // increase level if player has cleared 10 rows
      if (rows > (level + 1) * 10) {
         setLevel(prev => prev + 1);
         setDropTime(1000 / (level + 1) + 200);
      }
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

   const keyUp = ({ keyCode }) => {
      if (!gameOver) {
         if (keyCode === 40) {
            setDropTime(1000 / (level + 1) + 200);
         }
      }
   }

   const dropPlayer = () => {
      setDropTime(null);
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
      <StyledTetrisWrapper 
         role="button" 
         tabIndex={0} 
         onKeyDown={e => move(e)} 
         onKeyUp={keyUp}>
         <StyledTetris>
            <Stage stage={stage} />
            <aside>
               {gameOver ? (
                  <Display gameOver={gameOver} text="Game Over" />
               ) : (
                     <div>
                        <Display text={`Score: ${score}`} />
                        <Display text={`Rows: ${rows}`} />
                        <Display text={`Level: ${level}`} />
                     </div>
                  )}
               <StartButton callback={startGame} />
            </aside>
         </StyledTetris>
      </StyledTetrisWrapper>
   )
};

export default Tetris;