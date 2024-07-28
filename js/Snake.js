class Snake extends Dim{
  //Power
  static NORMAL=0;
  static GHOST=1;
  static ROCK=2;

  static POWER={
    //Color de efecto, Puntos ganados, duración, vida dada, crear cola, mensaje.
    [APPLE_NORMAL]:["#d97799", 100, 0xFFFFF, 0, 1, "Yummyng"], // NORMAL
    [APPLE_GHOST]:["#efefff", 200, 20, 0, 0, "Soy invencible"], // GHOST
    [APPLE_ROCK]:["#988", 200, 20, 0, 0,  "Soy roca"], // ROCK
    [APPLE_DEATH]:["#005", 500, 10, -1, -1, "Eso dolio"], // DEATH
    [APPLE_HEART]:["#f9a", -100, 10, 1, 1, "Estoy mas fuerte"], // LIFE
    [APPLE_BONUS]:["#f96", 50, 50, 0, 0, "Tiempo de banquete"] // Bonus
  };
  //address
  static TOP = 0;
  static BOTTOM = 1;
  static LEFT = 2;
  static RIGHT= 3;
  /**
   * @param {int} x Posición x de la pantalla
   * @param {int} y Posición y de la pantalla
   * @param {int} width Ancho
   * @param {int} height Largo
   * @param {int} address Direción donde se moverá la serpiente.
   * @param {string} color Color inicial de la serpiente.
   * @param {int|float} score
   * @param {int} life
  */
  constructor(x, y, width, height, address=Snake.LEFT, score = 0, life = 3) {
    super(x,y,width,height);
    this.score = score;
    this.life = life;
    this.address=address;
    this.power = APPLE_NORMAL;
    this.color= Snake.POWER[APPLE_NORMAL];
    this.time=0;
    this.tails = null;
  }
  /**Dibuja la serpiente y las colas
   * 
   * @param {CanvasRenderingContext2D} ctx Contexto 2d del canvas. 
   */
  draw(ctx) {
    let fill = ctx.fillStyle;
    ctx.beginPath();
    ctx.fillStyle = Snake.POWER[this.power][0];
    ctx.strokeStyle = "black";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.rect(this.x, this.y, this.width, this.height);
    for (let tail = this.tails; tail!=null; tail=tail.next_tail)
      ctx.fillRect(tail.x, tail.y, tail.width, tail.height);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.fillStyle = fill;
  }

  /**Actualiza la posición actual de la cola y la cabeza.
   * 
   * @param {int} speed es la velocidad que la cola se moverá.
   * @return Tail Si choco con la cola, de lo contrario null
   **/
  move_all(speed) {
    if (!this.tails){// Si no hay cola
      this.move_head(speed);
      return null;
    }
    var aft_x=this.tails.x,
      aft_y=this.tails.y
    ;
    this.tails.setXY(this.x, this.y);
    for (let tail = this.tails.next_tail; tail!=null; tail=tail.next_tail) {
      let nw_x=tail.x,
        nw_y=tail.y;
      tail.setXY(aft_x,aft_y);

      aft_x=nw_x;
      aft_y=nw_y;
      //Comprobamos que la serpiente si la serpiente toca su cola enviamos el índice que indica la posición.
      if (this.x == nw_x && this.y == nw_y) {
        return tail;
      }
    }
    this.move_head(speed);
    return null;
  }
  /**Mueve la cabeza a la siguiente posición.
   * 
   * @param {int} speed Velocidad a mover.
   */
  move_head(speed){
    switch (this.address) {
      case Snake.TOP:
        this.y -= speed;
        break;
      case Snake.BOTTOM:
        this.y += speed;
        break;
      case Snake.LEFT:
        this.x -= speed;
        break;
      case Snake.RIGHT:
        this.x += speed;
        break;
    }
  }
  /**Limpiamos toda la serpiente del canvas
   * @param {CanvasRenderingContext2D} ctx Canvas 2d context
  */
  clear_all(ctx) {
    ctx.clearRect(this.x, this.y, this.width, this.height);
    for (let tail = this.tails; tail!=null; tail=tail.next_tail)
      ctx.clearRect(tail.x, tail.y, tail.width, tail.height);
  }
  /**
   * Creamos una nueva cola.
   * @param {int} speed Distancia a mover la cabeza.
  */
  create(speed) {
    //Tail.new_tail(Dim,    this tail)
    var tail=Tail.new_tail(
      (this.tails==null)? this: this.tails,
      this.tails
    );
    this.move_all(speed);// Movemos la cola para que el Eslabón anterior esté mas adelante y el actual quede atrás
    this.tails=tail;
  }
  /**Quita una cola. Retorna true si no se pudo quitar cola (gameover) */
  delete(){
    if (this.tails!=null)
      this.tails=this.tails.next_tail;
    else
      return true;
    return false;
  }
  /**Activa el efecto de la manzana pasada.
   * 
   * @param {int} typ_apple El tipo de manzana.
   * @param {int} speed Velocidad que la serpiente se mueve. 
   * @returns 
   */
  run_power(typ_apple, speed){
    var apple=Snake.POWER[typ_apple];
    this.power=typ_apple;
    this.score+=apple[1];
    this.time=apple[2];
    this.life+=apple[3];
    if (apple[4]>0)
      this.create(speed);
    else if (apple[4]<0 && this.power!=APPLE_GHOST && this.power!=APPLE_ROCK)
      return this.delete();
    return false;
  }
};