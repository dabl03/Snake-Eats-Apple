/**
    @param {class Dim} : Clase que reprecenta las dimensiones: x, y, width, height. con extra de life(vida del personaje, opcional), address(direccion del personaje, opcional) y element(Por si necesita un contenedor de algun elemento, opcional.)
        - constructor: constructor(x,y,width,height,life=undefined,address=undefined,element=undefined);
        - funcion new_dim(dim): Acepta como parametro la misma clase Dim y retorna una nueva instancia de la clase Dim.
    @param {class Snake} : Clase que define la serpiente con la que se va a jugar.
        - constructor: constructor(dim,color);
        - funcion draw: draw(canvas.getContext(2d)) o draw(ctx): Funcion encargada de dibujar toda la cola de la serpiente, acepta como parametro el contexto 2d de la clase canvas usada actualmente.
        - function updated_Dim(Dim,speed): Actualiza las coordenadas x e y de la instancia de la clase Dim deacuerdo a la variable address de la misma.
        - function updated(speed,ctx): Actualiza toda la cola de la serpiente y borra la cola de la pantalla, preparandola para la funcion draw que tu deberas llamar.
        - function prototipe_updated(speed,ctx): Lo mismo que la funcion update, pero en teoria mas eficiente y confiable que la misma(Solo que no estoy muy seguro, por eso se llama prototipe_update o prototipe update).
        - function clear_all(ctx): Borra toda la cola.
        - function create(speed): Aumenta el tamaño de la cola de la serpiente.
*/
function remove_indice(last_array,delete_indice){
    let new_array=[];
    let i_new_array=0;//Indice del nuevo array.
    for (let i in last_array){
        if ( i==delete_indice ){
            continue;
        }
        new_array[i_new_array]=last_array[i];
        i_new_array++;
    }
    return new_array;
}
/**
    * Dim: Funcion que reprecenta las dimensiones de un objeto y su vida y su direccion, tambien el objeto como tal.
    * @param x: Variable que reprecenta la posicion x de la pantalla.
    * @param y: Variable que reprecenta la posicion y de la pantalla.
    * @param width: Variable que reprecenta el ancho del objeto.
    * @param width: Variable que reprecenta el ancho del objeto.
    * @return class dim;
*/
class Dim{
    constructor(x,y,width,height,life=undefined,address=undefined,element=undefined){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.life=life;
        this.address=address;
        this.element=element;
    }
}
/**
    * Dim.new_dim: Funcion statica que hace un constructor alternativo al predeterminado de la clase Dim.
    * @param {dim}: Una instancia de la clase dim, sera usada para retornar una nueva clase Dim.
    * @return {new Dim}.
*/
Dim.new_dim=function(dim){
    return new Dim(dim.x,dim.y,dim.width,dim.height,dim.life,dim.address,dim.element);
}
class Snake{
    constructor(dim,color,score=0,life=3){
        this.dims=[Dim.new_dim(dim)];
        this.now_address=dim.address;
        this.color=color;
        this.score=score;
        this.is_ghost=false;
        this.color_ghost="white";
        this.life=life;
    }
    /**
        * draw: Dibujara todas las colas de la serpiente.
        * @param: {ctx}: Contexto 2d del canvas.
        * @return {undefined}.
    */
    draw(ctx){
        let fill=ctx.fillStyle;
        ctx.beginPath();
        ctx.fillStyle=(this.is_ghost)?this.color_ghost:this.color;
        for ( let dim of this.dims ){
            ///@todo: crear un circulo con cada dimension.
            ctx.fillRect(dim.x,dim.y,dim.width,dim.height);
        }
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle=fill;
    }
    /**
        * updated_dim: actualizará la posicion de la dimension actual a la posicion indicada por el atributo address.
        * @param {dim}: Dimension actual que sera movida.
        * @param {speed}: Velocidad por la que se va a mover.
        * @return {undefined}
    */
    updated_Dim(dim,speed){
        switch(dim.address){
            case TOP:
                dim.y-=speed;
                break;
            case BOTTOM:
                dim.y+=speed;
                break;
            case LEFT:
                dim.x-=speed;
                break;
            case RIGHT:
                dim.x+=speed;
                break;
        }
    }
    /**
        * updated: Actualiza la posicion actual de la cola.
        * @param {speed}: es la velocidad que la cola se moverá.
        * @param {ctx}: Contexto 2d del canvas actual.
        * @return {undefined.}                    
    **/
    updated(speed,is_ghost,ctx){
        let dir_now=this.dims[0].address;
        ctx.clearRect(this.dims[0].x,this.dims[0].y,this.dims[0].width,this.dims[0].height);
        for ( let i in this.dims ){
            let last=this.dims[i].address;//Ultimos address
            
            //Complovamos que la serpiente si la serpiente toca su cola enviamos el indice que indica la posicion.
            if( !this.is_ghost & primer.x==now.x && primer.y==now.y ){
                return i;
            }
            
            this.updated_Dim(this.dims[i],speed);//Actualizamos la posicion deacuerdo al address actual.
            
            /*Recuerda eliminaras la variable previous;).*/
            this.dims[i].address=dir_now;//Actualizamos nuestro address actual
            
            dir_now=last;//Y vamos a preparar address de la siguente cola.
        }
        return 0;
    }
    /**
        * prototipe_updated: Es un prototipo del la funcion actualizar.
    */
    prototipe_updated(speed,is_ghost,ctx){
        let primer=this.dims[0];//Recuerda la serpientes no deben morder su cola por lo que debes usar esto con un if para saber si la cola se mordio a si misma.
        let the_last_dim=Dim.new_dim(primer);//Para actualizar la posicion de la cola siguiente.
        ctx.clearRect(primer.x,primer.y,primer.width,primer.height);
        
        this.updated_Dim(primer,speed);//Actualizamos la cabeza de la cola.
        for ( let i=1;i<this.dims.length;i++ ){//Revisar si funcionaria igual si el valor de i se inicia en 0.
            let now=this.dims[i];//Solo un resumen de la pocision actual.
            let last=Dim.new_dim(now);
            
            ctx.clearRect(now.x,now.y,now.width,now.height);
            //Complovamos que la serpiente si la serpiente toca su cola enviamos el indice que indica la posicion.
            if( !this.is_ghost & primer.x==now.x && primer.y==now.y ){
                return i;
            }
            
            //Nota: para actualizar la posicion actual no uses la variable now.
            this.dims[i]=Dim.new_dim(the_last_dim);//Actualizamos la pocicion de la cola actual con la posicion anterior de la cola antes de la actual para crear un efecto cadena.
            the_last_dim=last;//Para actualizar la posicion de la cola siguiente.
            
        }
        return 0;
    }
    /**
        * clear_all: Limpiamos todas las colas pasadas de este canvas.
        * @param {ctx}: El contexto 2d del linzo canvas actual.
        * @return {undefined}
    */
    clear_all(ctx){
        for ( let dim of this.dims ){
            ctx.clearRect(dim.x,dim.y,dim.width,dim.height);
        }
    }
    /**
        * Creamos una nueva cola.
        * @param {speed}: variable que reprecenta la velocidad a mover.
        * @return {undefined}
    */
    create(speed){
        let len=this.dims.length;//Longitud actual.
        let new_=Dim.new_dim(this.dims[len-1]);
        this.dims[len]=new_;
        //recuerda debemos aumentar la cola y ponerla al final por lo que debemos moveer sus cordenadas al contrario como deberia.
        switch (new_.address){
            case TOP:
                new_.y+=speed;//Este pedaso de cola se moverá para abajo.
                break;
            case BOTTOM:
                new_.y-=speed;//Este pedaso de cola se moverá para arriba.
                break;
            case LEFT:
                new_.x+=speed;//Este pedaso de cola se moverá para la derecha.
                break;
            case RIGHT:
                new_.x-=speed;//Este pedaso de cola se moverá para la izquierda.
                break;
        }
    }
    
};
class Apple{
    constructor(dim,type,color){
        this.dim=dim;
        this.type=type;
        this.color=color;
    }
}
Apple.draw=function(apple,ctx){
    let fillStyle=ctx.fillStyle;//Para retaurar el style anterior del ctx.
    ctx.beginPath();
    ctx.fillStyle=apple.color;
    ctx.fillRect(apple.dim.x,apple.dim.y,apple.dim.width,apple.dim.height);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle=fillStyle;
};
Apple.delete_=function(apple_dim,ctx){
    ctx.clearRect(apple_dim.x,apple_dim.y,apple_dim.width,apple_dim.height);
};
