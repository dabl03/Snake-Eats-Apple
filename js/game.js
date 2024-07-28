/**Analiza la posición de las manzanas y de la serpiente */
function analyze() {
  if (snake.power!=APPLE_GHOST && (
    snake.x > MAX_WIDTH_CANVAS || snake.x < 0 || snake.y > MAX_HEIGHT_CANVAS || snake.y < 0)
  ) { //Evitar que se salga del canvas.
    end_game();
    return true;
  }
  for (var item = apple,after=apple; item!=null; item=item.next_apple) {
    //Eliminamos la manzana y subimos de nivel a la serpiente.
    item.draw(ctx);
    if (item.collision(snake)){
      if (Apple.power(item, snake, ctx)) {
        //El jugador ha perdido todas sus vidas.
        end_game();
        return;
      }
      after.next_apple=item.next_apple;
      break;
    }
    after=item;
  }
  if ((snake.time--)<=0)
    snake.power=APPLE_NORMAL;
}
function move() {
  let tail=snake.move_all(10);
  if (tail!=null && snake.power!=APPLE_GHOST){
    if (snake.power==APPLE_ROCK){ // Cortamos la cola
      let after=snake.tails;
      for (let now=snake.tails;now!=null;now=now.next_tail){
        if (now==tail){
          after.next_tail=null;
          break;
        }
        after=now;
      }
    }else{
      end_game();
      return true;
    }
  }
}
function draw() {
  snake.draw(ctx); //Dibujamos a nuestra serpiente.
  for (var item=apple;item!=null;item=item.next_apple)
    item.draw(ctx);
}
function game() {
  //Actualizamos la serpiente.
  if (!is_pause) {
    ctx.clearRect(0,0,MAX_WIDTH_CANVAS,MAX_HEIGHT_CANVAS);
    if (analyze()) {
      return;
    } else if (move()) {
      return;
    }
    draw();
  }
}
/** Crea una nueva manzana y si estamos en bono solo crea normal.*/
Apple.create_manzana = function () {
  if (is_pause)
    return;
  let type = null;
  if (Apple.bonus > 0) {
    Apple.bonus -= 1;
    type=APPLE_NORMAL;
    setTimeout(Apple.create_manzana, time_create_apple);
  }
  apple=new Apple(
    Math.random() * MAX_WIDTH_CANVAS,
    Math.random() * MAX_HEIGHT_CANVAS,
    10,
    10,
    apple,
    type
  );
}
/** Determinamos el efecto de la manzana en el jugador.
 *
 * @param {Apple} apple Manzana actual
 * @param {Snake} snake El jugador
// * @param {CanvasRenderingContext2D} ctx canvas 2d context  //Para mostrar mensaje
 * @return bool
*/
 Apple.power =(apple, snake, ctx) => {
  var id=APPLE_TYPE[apple.type]["id"];
  console.log(Snake.POWER[id][5]);
  if (snake.run_power(id,10)){
    return true;
  }
  return (snake.life <= 0) ? true : false;
}