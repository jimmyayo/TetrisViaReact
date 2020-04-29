export const STAGE_WIDTH = 12;
export const STAGE_HEIGHT = 20;

export const createStage = () => 
   Array.from(Array(STAGE_HEIGHT), () => 
      new Array(STAGE_WIDTH).fill([0, 'clear'])
   );

export const willCollide = (player, stage, { x: moveX, y: moveY}) => {
   for (let y = 0; y < player.tetromino.length; y++) {
      for (let x = 0; x < player.tetromino[0].length; x++) {
         
         // 1. check that we're on a tetromino cell
         if (player.tetromino[y][x] !== 0) {
            
            if(
               // 2. ensure that our movement stays within game area's height (y)
               !stage[y + player.pos.y + moveY] || 
               // 3. ensure that our movement stays within game area's width (x)
               !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] || 
               // 4. ensure that destination cell isn't clear
               stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !== 'clear'
            ) {
               return true;
            }
         }
      }
   }
}