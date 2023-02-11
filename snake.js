const angulo_arc = (Math.PI / 180) * 360;
/*TYPE APPLES:*/
const APPLE_NORMAL = 0,
APPLE_DEATH = 1,
APPLE_GHOST = 2,
APPLE_ROCK = 3,
APPLE_PINK_HEART = 4,
APPLE_BONUS = 5,
APPLE_MAX_TYPE = 6; /*Es para poner un limite al random type apple. Nota: Se debe actualizar cada  vez que se agregue una manzana.*/
 
function remove_indice(last_array, delete_indice) {
    let new_array = [];
    let i_new_array = 0; //Indice del Nuevo array.
    for (let i in last_array) {
        if (i == delete_indice) {
            continue;
        }
        new_array[i_new_array] = last_array[i];
        i_new_array++;
    }
    return new_array;
}
/**
 * Dim: Función que representa las dimensiones de un objeto y su vida y su dirección, también el objeto como tal.
 * @param x: Variable que representa la posición x de la pantalla.
 * @param y: Variable que representa la posición y de la pantalla.
 * @param width: Variable que representa el ancho del objeto.
 * @param width: Variable que representa el ancho del objeto.
 * @return class dim;
 */
class Dim {
    constructor(x, y, width, height, life = undefined, address = undefined, element = undefined) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.life = life;
        this.address = address;
        this.element = element;
    }
}
/**
 * Dim.new_dim: Función estática que hace un constructor alternativo al predeterminado de la clase Dim.
 * @param {dim}: Una instancia de la clase dim, será usada para retornar una nueva clase Dim.
 * @return {new Dim}.
 */
Dim.new_dim = function (dim) {
    return new Dim(dim.x, dim.y, dim.width, dim.height, dim.life, dim.address, dim.element);
};
Dim.new_dim_cola = function (dim) {
    this.x = dim.x;
    this.y = dim.y;
    this.address = dim.address;
    return this;
};
Dim.new_apple = function (dim) {
    this.x = dim.x;
    this.y = dim.y;
    this.width = dim.width;
    this.height = dim.height;
    return this;
}
class Snake {
    constructor(dim, color, score = 0, life = 3) {
        this.dims = [Dim.new_dim(dim)];
        this.now_address = dim.address;
		this.radio=Math.sqrt(dim.width*dim.width + dim.height*dim.height)/2;
        this.color = color;
        this.score = score;
        this.is_ghost = false;
        this.color_ghost = "white";
        this.life = life;
    }
    /**
     * draw: Dibujara todas las colas de la serpiente.
     * @param: {ctx}: Contexto 2d del canvas.
     * @return {undefined}.
     */
    draw(ctx) {
        let fill = ctx.fillStyle;
        ctx.beginPath();
        ctx.fillStyle = (this.is_ghost) ? this.color_ghost : this.color;
        ctx.fillRect(
            this.dims[0].x, this.dims[0].y,
            this.dims[0].width, this.dims[0].height
		);
        ctx.fill();
		ctx.closePath();
        ctx.fillStyle = fill;
    }
    
    /**
     * updated: Actualiza la posición actual de la cola.
     * @param {speed}: es la velocidad que la cola se moverá.
     * @param {ctx}: Contexto 2d del canvas actual.
     * @return {undefined.}
     **/
    updated(speed, is_ghost, ctx) {
        let dir_now = this.dims[0].address;
        for (let i in this.dims) {
            let last = this.dims[i].address; //Ultimo address

            //Comprobamos que la serpiente si la serpiente toca su cola enviamos el índice que indica la posición.
            if (!this.is_ghost & primer.x == now.x && primer.y == now.y) {
                return i;
            }

            Snake.updated_Dim(this.dims[i], speed); //Actualizamos la position de acuerdo al address actual.

            /*Recuerda eliminaras la variable previous;).*/
            this.dims[i].address = dir_now; //Actualizamos nuestro address actual

            dir_now = last; //Y vamos a preparar address de la siguente cola.
        }
        return 0;
    }
    /**
     * prototipe_updated: Es un prototipo del la función actualizar.
     */
    prototipe_updated(speed, is_ghost, ctx) {
        let primer = this.dims[0]; //Recuerda la serpientes no deben morder su cola por lo que debes usar esto con un if para saber si la cola se mordió a sí misma.
        let the_last_dim = Dim.new_dim(primer); //Para actualizar la posición de la cola siguiente.

        Snake.updated_Dim(primer, speed); //Actualizamos la cabeza de la cola.
        for (let i = 1; i < this.dims.length; i++) { //Revisar si funcionaria igual si el valor de i se inicia en 0.
            let last =this.dims[i];
            //Comprobamos que la serpiente si la serpiente toca su cola enviamos el índice que indica la posición.
            if (!this.is_ghost & primer.x == this.dims[i].x && primer.y == this.dims[i].y) {
                return i;
            }

            //Nota: para actualizar la posición actual no uses la variable now.
            this.dims[i] = the_last_dim; //Actualizamos la posición de la cola actual con la posición anterior de la cola antes de la actual para crear un efecto cadena.
            the_last_dim = last; //Para actualizar la posición de la cola siguiente.

        }
        return 0;
    }
    /**
     * clear_all: Limpiamos todas las colas pasadas de este canvas.
     * @param {ctx}: El contexto 2d del lienzo canvas actual.
     * @return {undefined}
     */
    clear_all(ctx) {
        for (let dim of this.dims) {
            ctx.clearRect(dim.x, dim.y, dim.width, dim.height);
        }
    }
    /**
     * Creamos una nueva cola.
     * @param {speed}: variable que representa la velocidad a mover.
     * @return {undefined}
     */
    create(speed) {
        let len = this.dims.length; //Longitud actual.
        let new_ = Dim.new_dim_cola(this.dims[len - 1]);
        this.dims[len] = new_;
        //recuerda debemos aumentar la cola y ponerla al final por lo que debemos mover sus coordenadas al contrario como debería.
        switch (new_.address) {
        case TOP:
            new_.y += speed; //Este pedazo de cola se moverá para abajo.
            break;
        case BOTTOM:
            new_.y -= speed; //Este pedazo de cola se moverá para arriba.
            break;
        case LEFT:
            new_.x += speed; //Este pedazo de cola se moverá para la derecha.
            break;
        case RIGHT:
            new_.x -= speed; //Este pedazo de cola se moverá para la izquierda.
            break;
        }
    }


};
/**
 * updated_dim: actualizará la posición de la dimensión actual a la posición indicada por el atributo address.
 * @param {dim}: Dimensión actual que será movida.
 * @param {speed}: Velocidad por la que se va a mover.
 * @return {undefined}
 */
Snake.updated_Dim = function (dim, speed) {
    switch (dim.address) {
    case TOP:
        dim.y -= speed;
        break;
    case BOTTOM:
        dim.y += speed;
        break;
    case LEFT:
        dim.x -= speed;
        break;
    case RIGHT:
        dim.x += speed;
        break;
    }
}
/**Lo opuesto a la funcion snake.update_dim. Es para saber que dimension tuvo antes de llamar a snake.update_dim.
* @oaram {dim}: Dimensión actual que será movida.
* @param {speed}: Velocidad al la que se mueve.
*/
Snake.previous_dim = function (dim, speed) {
    switch (dim.address) {
    case TOP:
        dim.y += speed;
        break;
    case BOTTOM:
        dim.y -= speed;
        break;
    case LEFT:
        dim.x += speed;
        break;
    case RIGHT:
        dim.x -= speed;
        break;
    }
}
class Apple {
    constructor(dim, type, color) {
        this.dim = Dim.new_apple(dim);
        this.dim.radio = Math.sqrt(dim.width * dim.width + dim.height * dim.height) / 2;
        this.type = type;
        this.color = color;
    }
}
Apple.draw = function (apple, ctx) {
    let fillStyle = ctx.fillStyle; //Para restaurar el estilo anterior del ctx.
    ctx.beginPath()
    //ctx.fillRect(apple.dim.x,apple.dim.y,apple.dim.width,apple.dim.height);
    ctx.arc(
        apple.dim.x,
        apple.dim.y,
        apple.dim.radio, 0,
        Math.PI * 2,
        true);
    ctx.fillStyle = apple.color;
    ctx.fill();
    ctx.closePath();
    ctx.fillStyle = fillStyle;
};
Apple.delete_ = function (apple_dim, ctx) {
    let x = apple_dim.x - apple_dim.radio,
    y = apple_dim.y - apple_dim.radio;
    ctx.clearRect(x, y, apple_dim.width, apple_dim.height);
};

Apple.choque = function (apple, snake) {
    let x = apple.x - apple.radio,
    y = apple.y - apple.radio,
    width = height = apple.radio * 2;
	return (
    (snake.x>x-width && snake.x<x+width) &&
    (snake.y>y-height && snake.y<y+height));
    /*return (snake.x < x + width &&
        snake.x + snake.width > x &&
        snake.y < y + height &&
        snake.height + snake.y > y);
    /*return (
    (snake.x>x-width && snake.x<x+width ) &&
    (snake.y>y-height && snake.y<y+height)
    );
    /*return (
    (snake.x>x-(apple.width) && snake.x<x+apple.width ) &&
    (snake.y>y-(apple.height) && snake.y<y+apple.height)
    );*/
}