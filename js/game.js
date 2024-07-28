/**Analiza la posición de las manzanas y de la serpiente */
function analice() {
  if (snake.power!=Snake.GHOST && (
    snake.x > MAX_WIDTH_CANVAS || snake.x < 0 || snake.y > MAX_HEIGHT_CANVAS || snake.y < 0)
  ) { //Evitar que se salga del canvas.
    end_game();
    return true;
  }
  for (var item = apple,after=apple; item!=null; item=item.next_apple) {
    //Eliminamos la manzana y subimos de nivel a la serpiente.
    item.draw(ctx);
    ////////////////////////////////////Hay nuevo error a comer manzanas con efectos.
    /**
     * yumin 2 game.js:128:11
Vida aumentada:) 3 game.js:128:11
Uncaught ReferenceError: type is not defined
    power ./js/game.js:126
    analice ./js/game.js:13
    game ./game.js:41
52 game.js:126:7

​


     */
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
}
function move() {
  let tail=snake.updated(10);
  if (tail!=null && snake.power!=Snake.GHOST) {
    ///////////////////////////////////////////////////////////////////////// Ver si elimino este pedazo de cola o mato a la serpiente
    end_game();
    return true;
  }
}
function draw() {
  snake.draw(ctx); //Dibujamos a nuestra serpiente.
  for (var item=apple;item!=null;item=item.next_apple)
    item.draw(ctx);
}
function game() {//////////////////////////////////////////////////////////////////////////////////
  //Actualizamos la serpiente.
  if (!is_pause) {
    ctx.clearRect(0,0,MAX_WIDTH_CANVAS,MAX_HEIGHT_CANVAS);
    if (analice()) {
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
 Apple.power = function (apple, snake) {
  let msg = "yumin";
  switch (APPLE_TYPE[apple.type]["id"]) {
    case APPLE_NORMAL:
      snake.create(10,100);
      break;
    case APPLE_DEATH:
      snake.score += 500;
      if (snake.power!=Snake.GHOST && snake.power!=Snake.ROCK && snake.tails!=null) {
        // Si no es espiritual, rocosa y hay cola por destruir la destruimos.
        snake.life--;
        snake.tails=snake.tails.next_tail;
      } else if (!snake.is_ghost) { //Si no, le quitamos dos vidas a la serpiente.
        snake.life -= 2;
      }
      msg = "OUCH!!!!!!";
      break;
    case APPLE_GHOST:// La serpiente se volvió espiritual.
      snake.power = Snake.GHOST;
      snake.color=Snake.GHOST_COLOR;
      setTimeout(function () {
        if (Snake.power!=Snake.GHOST)
          return;
        snake.power = Snake.NORMAL;
        snake.color = Snake.NORMAL_COLOR;
      }, TIME_GHOST);
      msg = "Soy invencible.";
      break;
    case APPLE_ROCK: //Hace que pierda una vida
      snake.score += 150;
      setTimeout(function () {
      if (Snake.power!=Snake.ROCK)
          return;
        snake.power = Snake.NORMAL;
        snake.color = Snake.NORMAL_COLOR;
      }, TIME_GHOST);// Ver si cambio el tiempo.
      msg = "Buah sabe a piedra:(";
      break;
    case APPLE_HEART:
      snake.life++;
      msg = "Vida aumentada:)";
      break;
    case APPLE_BONUS:
      Apple.is_bonus += time_bonus;
      if (Apple.is_bonus == time_bonus) {
        clearInterval(Apple.interval);
        Apple.interval = setInterval(create_manzana, Apple.is_bonus);
      }
      msg = "Se acerca un buen banquete.:)-";
      break;
    default:
      console.warn("Advertencia: Se pasó type=" + type + ", pero los poderes que están definidos están en un rango de 0-" +APPLE_TYPE.length+ ", por lo que su poder no tendrá ningún efecto en el juego.");
  }
  console.log(msg) ///@todo Cambiar esta alerta por un dibujo de una serpiente diciendo esto comiendo una manzana.
  return (snake.life <= 0) ? true : false;
}