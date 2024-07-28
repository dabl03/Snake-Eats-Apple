
class Tail extends Dim{
  constructor(x, y, width, height, next_tail){
    super(x,y,width,height);
    this.next_tail=next_tail;
  }
  setXY(x, y){
    this.x=x;
    this.y=y;
  }
}
Tail.new_tail=(dim,next_tail)=>new Tail(
  dim.x,dim.y,
  dim.width,dim.height,
  next_tail
);