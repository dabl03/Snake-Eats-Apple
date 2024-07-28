class Snake extends Dim{
  static GHOST_COLOR="#ffefef";
  static ROCK_COLOR = "#a88";
  static NORMAL_COLOR="#a0f"; //Ver si usar el "green"
  //Power
  static NORMAL=0;
  static GHOST=1;
  static ROCK=2;
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
    this.power = Snake.NORMAL;
    this.color = Snake.NORMAL_COLOR;
    this.tails = null;
  }
  /**Dibuja la serpiente y las colas
   * 
   * @param {CanvasRenderingContext2D} ctx Contexto 2d del canvas. 
   */
  draw(ctx) {
    let fill = ctx.fillStyle;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "black";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();
    //Dibujamos las colas.
    ctx.strokeStyle = "gray";
    for (let tail = this.tails; tail!=null; tail=tail.next_tail) {
      ctx.fillRect(tail.x, tail.y, tail.width, tail.height);
      ctx.rect(tail.x, tail.y, tail.width, tail.height);
    }
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.fillStyle = fill;
  }

  /**Actualiza la posición actual de la cola y la cabeza.
   * 
   * @param {speed}: es la velocidad que la cola se moverá.
   * @return Tail
   **/
  updated(speed) {
    if (!this.tails){// Si no hay cola
      this.move(speed);
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
    this.move(speed);
    return null;
  }
  /**Mueve la cabeza a la siguiente posición.
   * 
   * @param {int} speed Velocidad a mover.
   */
  move(speed){
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
   * @param {int} score Puntuación obtenida
   */
  create(speed,score=0) {
    this.score+=score;
    if (this.tails==null){// Primera cola
      this.tails=new Tail(this.x, this.y, this.width, this.height,null);
      this.updated(speed);
      return;
    }
    //                         Dim,    this tail
    var tail=Tail.new_tail(this.tails, this.tails);
    this.updated(speed);// Movemos la cola para que el Eslabón anterior esté mas adelante y el actual quede atrás
    this.tails=tail;
  }
};