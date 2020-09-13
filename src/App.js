import React from 'react';
import './index.css'


class Box extends React.Component{
    render(){
        return(
            <button className="box" onClick={() => this.props.onClick()}>
                <img src={this.props.element} style={{ display: this.props.display ,height:"15px"}} alt="" />
            </button>
        )
    }
}

class Board extends React.Component{
    constructor(props){
        super(props)
        this.totalBox = this.props.width * this.props.height
        this.state = {
            boxData:[],
            startLoc : 7,
            start:false,
            count:0
        }
    }

   
    
  componentDidUpdate() {
    setTimeout(() => {
      this.checkExposives();
    }, 100);
  }

    handleClick(i){
        if(i === this.state.startLoc) this.checkExposives()
    }

    yDirection(direction){
        if (direction === '+' && (this.state.startLoc + 1 - this.props.height) > 0){
            let copyArray = this.state.boxData;
            copyArray[this.state.startLoc] = {
              element: '', display: 'none'
            };
            copyArray[this.state.startLoc - this.props.height] = {
              element: 'mario.png', display: 'block'
            };
            this.setState(
                {
                  start: true,
                  startLoc: this.state.startLoc - this.props.height, boxData: copyArray,
                  count: this.state.count + 1
                }
            );
        } else if (direction === '-' && (this.state.startLoc + this.props.height) < this.totalBox){
            let copyArray = this.state.boxData;
            copyArray[this.state.startLoc] = {
                element: '', display: 'none'
            };
            copyArray[this.state.startLoc + this.props.height] = {
                element: 'mario.png', display: 'block'
            };
            this.setState(
                {
                  start: true,
                  startLoc: this.state.startLoc + this.props.height,
                  boxData: copyArray,
                  count: this.state.count + 1
                }
            );
        }
    }

    xDirection(direction){
        if(direction === '+' && (this.state.startLoc + 2)%this.props.width !== 1 && (this.state.startLoc+1)<this.totalBox){
            let copyArray = this.state.boxData;
            copyArray[this.state.startLoc] = {
                element:"",display:'none'
            }
            copyArray[this.state.startLoc + 1] = {
                element: 'mario.png', display: 'block'
            };
            this.setState({
                start:true,
                startLoc:this.state.startLoc + 1,
                boxData:copyArray,
                count:this.state.count + 1
            })

        }
        else if(direction === '-' && (this.state.startLoc) % this.props.width !== 0 && (this.state.startLoc - 1) >= 0){
            let copyArray = this.state.boxData;
            copyArray[this.state.startLoc] = {
                element:'',display:'none'
            }
            copyArray[this.state.startLoc-1]  = {
                element: 'mario.png', display: 'block'
            }
            this.setState({
                start:true,
                startLoc:this.state.startLoc - 1,
                boxData:copyArray,
                count:this.state.count + 1
            })
        }
    }

    getMarioRange(){
        let marioLoc = this.state.startLoc;
        let marioRange = [];
        for (let i = 0;i<this.props.height;i++){
              if(marioLoc >= (i* this.props.width) && marioLoc < (i*this.props.width) + this.props.width){
                marioRange = [(i* this.props.width),(i*this.props.width) + this.props.width]
            }
        }
        return marioRange
    }

    numberInRange(x,range){
        return x >= range[0] && x<range[1];
    }

    decidePositions(greenDotPosition){
        let distance = Math.abs(greenDotPosition[0]-this.state.startLoc)
        let marioRange = this.getMarioRange()
        if(distance < this.props.width && greenDotPosition[0] < this.state.startLoc && this.numberInRange(greenDotPosition[0],marioRange)){
            this.xDirection('-')
        }
        else if( distance < this.props.width && greenDotPosition[0] > this.state.startLoc && this.numberInRange(greenDotPosition[0], marioRange)){
           this.xDirection('+')
        }
        else if(distance < this.props.width && greenDotPosition[0] < this.state.startLoc && !this.numberInRange(greenDotPosition[0], marioRange)){
          this.yDirection('+');
        }
        else if(distance < this.props.width && greenDotPosition[0] > this.state.startLoc && !this.numberInRange(greenDotPosition[0], marioRange)){
          this.yDirection('-');
        }
        else if(distance>this.props.width && greenDotPosition[0]<this.state.startLoc){
          this.yDirection('+')
        } 
        else{
            this.yDirection('-')
        }

    }

    checkExposives(){
        let dots = this.state.boxData.filter(box =>{
            return box.element === "green.png"
        })
        // console.log('Total dots: ', dots);
        if(dots.length === 0){
            alert('Total Moves'+ this.state.count)
        }
        else{
            this.decidePositions(dots.map((enemy,i)=>{
              return (enemy.value)
            }))
        }
    }

    eachBox(i) {
        return <Box key={i}
          value={i} element={this.state.boxData[i].element} displayElement={this.state.boxData[i].display}
          onClick={() => this.handleClick(i)}
        />;
      }

    renderRows(boxData) {
        return (<div className="board-row">
          {boxData}
        </div>);
      }

    showBoard(){
        let board = []
        let rows = []
        for(let i = 0,boxNum = 0;i<this.props.height;i++){
            for(let j = 0;j<this.props.width;j++){
                rows.push(this.eachBox(boxNum))
                boxNum++
            }
            board.push(this.renderRows(rows));
            rows = []
        }
        return board
    }

    render(){
        if(!this.state.start){
            let greenDots = []
            for(let i = 0; i<Math.floor(Math.sqrt(this.totalBox))+1;i++){
              //creating random green dots
                greenDots.push(
                    Math.floor(Math.random()* (this.totalBox))
                )
            }
            let boxNum = 0;
            for(let i=0;i<this.props.height;i++){
                for(let j = 0;j<this.props.width;j++){
                    //showing mario block or green block or none block 
                    let element = boxNum === this.state.startLoc ? "mario.png" : greenDots.includes(boxNum) ? "green.png" : "";
                    let display = greenDots.includes(boxNum) || boxNum === this.state.startLoc ? "block" : "none";
                    this.state.boxData.push({element,display,value:boxNum})
                    boxNum++
                }
            }
            
        }
        return(
            <div>{this.showBoard()}</div>
        )
    }
}

class App extends React.Component{
    render(){
        let length =  prompt("Please enter board width")
        length = parseInt(length)
        return(
            <div className="board">
                <div>
                    <Board width={length} height={length} />
                </div>
            </div>
        )
    }
}


export default App;
