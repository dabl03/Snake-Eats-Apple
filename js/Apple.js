const PI_x_2=2 * Math.PI
/*ID APPLES:*/ //Como id no se deben repetir...
const APPLE_NORMAL = 0,
  APPLE_DEATH = 1,
  APPLE_GHOST = 2,
  APPLE_ROCK = 3,
  APPLE_HEART = 4,
  APPLE_BONUS = 5,
  APPLE_MAX_TYPE = 6
;
const APPLE_TYPE=[
  // Recuerda que debe tener el mismo orden.
  // No deben tener las misma probabilidades (odds)
  {"name":"Nueva vida", "odds":5, "color":"#f9a","id":APPLE_HEART},
  {"name":"Inicio del bonus", "odds":10, "color":"#f96","id":APPLE_BONUS},
  {"name":"Fuerza epiritual", "odds":25, "color":"#efefff","id":APPLE_GHOST},
  {"name":"Fortaleza de la roca","odds":30, "color":"#844","id":APPLE_ROCK},
  {"name":"Muerte", "odds":40, "color":"#4f0000","id":APPLE_DEATH},
  {"name":"Normal", "odds":100, "color":"#f00","id":APPLE_NORMAL}
];
const APPLE_COLORS=APPLE_TYPE.map((item)=>item["color"]);

class Apple extends Dim{
  /**
   * @param {int} x Coordenada x de la pantalla 
   * @param {int} y Coordenada y de la pantalla
   * @param {int} width
   * @param {int} height
   * @param {Apple} next_apple La siguiente manzana en la pila (pase null para marca el limite) 
   */
  constructor(x, y, width, height, next_apple,type=null){
    super(x, y, width, height);
    this.type=(type!=null)?type:Apple.random_odds();
    this.next_apple=next_apple;
  }
  /**
   * Dibuja la manzana
   * @param {CanvasRenderingContext2D} ctx Contexto 2d del canvas
   * @param {int} rotation Para rotar el ellipse. Por defecto 0
   */
  draw(ctx,rotation=0){
    ctx.beginPath();
    ctx.fillStyle = APPLE_COLORS[this.type];
    ctx.ellipse(
      this.x,
      this.y,
      this.width,
      this.height,
      rotation,0,PI_x_2
    );
    ctx.fill();
    ctx.closePath();
  }
  /**Detecta la colisión entre player y el rectangulo de la manzana
   * 
   * @param {Dim} player Rectangulo a ver colisión
   * @returns Boolean (true|false)
   */
  collision(player){
    return (
      (player.x>this.x-this.width && player.x<this.x+this.width) &&
      (player.y>this.y-this.height && player.y<this.y+this.height)
    );
  }
};
/** Retorna el indice del tipo de la manzana, aleatoriamente deacuerdo a su probabilidad
 * 
 * @returns int -> index of APPLE_TYPE
 */
Apple.random_odds=()=>{
  const RAND=Math.floor(Math.random()*100+1);
  var after={"odds":0};
  for (var i=0;i<APPLE_TYPE.length;i++){
    if (RAND>after["odds"] && RAND<APPLE_TYPE[i]["odds"]){
      return i;
    }
    after=APPLE_TYPE[i];
  }
  return APPLE_TYPE.length-1;
};
/**Solo llama al constructor usando dim para las dimensiones
 * @return Apple
*/
Apple.new_apple=(dim,next_apple)=>new Apple(dim.x,dim.y,dim.width,dim.height,next_apple);