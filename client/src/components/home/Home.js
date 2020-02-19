import React, { Component } from 'react'
import './style.css'
import '../../functions/Missions'
import { saveMission } from '../../functions/Missions'

const n = 7
const m = 15
const width = 50/(m-1)

let operators = {
    '+': function(a, b) { return a + b },
    '-': function(a, b) { return a - b },
}

class Home extends Component {
    constructor(){
        super()
        this.state = {
            start:[],
            end:[],
            initialStart:[],
            data:[],
            pathPoints:[],
            direction:'',
            loading:false,
            path:false
        }
        this.selectJourney = this.selectJourney.bind(this)
        this.selectDirection = this.selectDirection.bind(this)
        this.calculatePath = this.calculatePath.bind(this)
        this.findPath = this.findPath.bind(this)
        this.reset = this.reset.bind(this)
        this.initializeGrid = this.initializeGrid.bind(this)
        this.save = this.save.bind(this)
    }

    componentDidMount(){
        this.initializeGrid()
    }

    initializeGrid(){
        let data = new Array(n)
        for(var i =0; i< n; i++){
            data[i] = new Array(m)
            for(var j =0; j< m; j++)
                data[i][j] = null
        }
        this.setState({data: data})
    }

    selectDirection(val) {
        this.setState({direction: val})
    }

    selectJourney(i,j){
        let data = this.state.data
        if(this.state.direction == null || this.state.direction == '')
            alert('Please select Direction first')
        else {
            if(this.state.start.length == 0){
                data[i][j] = 'S'
                this.setState({start: [i,j],data: data, initialStart: [i,j]})
            }
                
            else if(this.state.end.length == 0){
                data[i][j] = 'E'
                this.setState({end: [i,j],data: data}, () => {
                    this.calculatePath()
                })
            }
        }
    }

    findPath(direction, start, end, data, pathPoints) {
        let symbol = direction == 'Up' ? 'Λ' : 'V'
        let op = direction == 'Up' ? '-' : '+'
        if(start[0] == end[0] && start[1] == end[1]){
            this.setState({data: data, path: true, pathPoints: pathPoints})
            return
        }
        else {
            data[start[0]][start[1]] = symbol
            pathPoints.push([start[0], start[1]])
            if(start[0] == 0){
                if(start[1] > end[1] && (data[start[0]+1][start[1]] == symbol || data[start[0]+1][start[1]] == 'S')){
                    direction = direction == 'Up' ? 'Down' : 'Up'
                    start[1] = operators['-'](start[1],1)
                }  
                else if(start[1] < end[1]  && (data[start[0]+1][start[1]] == symbol || data[start[0]+1][start[1]] == 'S')){
                    direction = direction == 'Up' ? 'Down' : 'Up'
                    start[1] = operators['+'](start[1],1)
                }
                else if(start[1] == end[1] && (data[start[0]+1][start[1]] == symbol || data[start[0]+1][start[1]] == 'S')){
                    direction = direction == 'Up' ? 'Down' : 'Up'
                    if(start[1] != 0)
                        start[1] = operators['-'](start[1],1)
                    else
                        start[1] = operators['+'](start[1],1)
                }  
                else
                    start[0] = operators['+'](start[0],1)
            }
            else if(start[0] == n-1){
                if(start[1] > end[1]  && (data[start[0]-1][start[1]] == symbol  || data[start[0]-1][start[1]] == 'S')){
                    direction = direction == 'Up' ? 'Down' : 'Up'
                    start[1] = operators['-'](start[1],1)
                }  
                else if(start[1] < end[1] && (data[start[0]-1][start[1]] == symbol  || data[start[0]-1][start[1]] == 'S')){
                    direction = direction == 'Up' ? 'Down' : 'Up'
                    start[1] = operators['+'](start[1],1)
                } 
                else if(start[1] == end[1] && (data[start[0]-1][start[1]] == symbol || data[start[0]-1][start[1]] == 'S')){
                    direction = direction == 'Up' ? 'Down' : 'Up'
                    if(start[1] != 0)
                        start[1] = operators['-'](start[1],1)
                    else
                        start[1] = operators['+'](start[1],1)
                } 
                else
                    start[0] = operators['-'](start[0],1)
            }
            else 
                start[0] = operators[op](start[0],1)
        }
        this.findPath(direction, start, end, data, pathPoints)
    }

    calculatePath(){
        let { start, end, direction, data } = this.state
        let maxCol = m-1
        let maxRow = n-1
        if(direction == 'Up'){
            if(start[0] == 0){
                if(start[1] > end[1])
                    start[1] = start[1] - 1
                else if(start[1] < end[1])
                    start[1] = start[1] + 1
                else{
                    if(start[1] != 0)
                        start[1] = start[1] - 1
                    else
                        start[1] = start[1] + 1
                }
                direction = 'Down'
            }
            else
                start[0] = start[0] - 1
            this.findPath(direction,start, end, data, [])
        }
        else {
            if(start[0] == n-1){
                if(start[1] > end[1])
                    start[1] = start[1] - 1
                else if(start[1] < end[1])
                    start[1] = start[1] + 1
                else{
                    if(start[1] != 0)
                        start[1] = start[1] - 1
                    else
                        start[1] = start[1] + 1
                }
                direction = 'Up'
            }
            else
                start[0] = start[0] + 1
            this.findPath(direction,start, end, data, [])
        }
    }

    save(){
        let { data, direction, pathPoints, start, end, initialStart } = this.state
        this.setState({loading: true}, () => {
            let path = []
            path.push([n - 1 - initialStart[0], initialStart[1]])
            for(var i=0; i< pathPoints.length; i++){
                path.push([ n - 1 - pathPoints[i][0], pathPoints[i][1]])
            }
            path.push([n - 1 - end[0], end[1]])
            let payload = {
                path: path,
                direction: direction
            }
            saveMission(payload)
                .then(() => {
                    this.setState({loading: false}, () => {
                        alert('Mission Saved')
                        this.reset()
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        })
    }

    reset(){
        this.setState({
            start:[],
            end:[],
            data:[],
            direction:'',
            pathPoints:[],
            initialStart:[],
            path:false
        }, () => {
            this.initializeGrid()
        })
    }

    render() {
        let { start, end, direction, data, path, loading } = this.state

        return (
            <div className="container">
                {loading ? <div class="loading">Loading&#8230;</div> : null}
                {data.length == 0 ? null :
                <div className="jumbotron mt-5 mb-5 pt-5 pb-5 text-center">
                    <span style={{color:'white'}}>Select Direction:</span> &nbsp;
                    <button type="button" class="btn btn-primary" disabled={direction == 'Down'} onClick={(e) => this.selectDirection('Up')}>
                        Up
                    </button>&nbsp;
                    <button type="button" class="btn btn-primary" disabled={direction == 'Up'} onClick={(e) => this.selectDirection('Down')}>
                        Down
                    </button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <button type="button" class="btn btn-primary" disabled={direction == '' || !path} onClick={(e) => this.save()}>
                        Save Mission
                    </button>&nbsp;
                    <button type="button" class="btn btn-primary" onClick={(e) => this.reset()}>
                        Reset
                    </button>
                    <br />
                    <div className="col-sm-12 mt-5 mx-auto grid-container">
                        <span class="row-head" style={{color:'#272727'}}>{n}</span>
                        <div class="grid-row" >
                            {[...Array(m)].map((y, j) =>
                                <div class="grid-col" style={{width: width*0.6 + '%', height: 0}}  key={j} >
                                    <p class="col-head-show" >A{j}</p>
                                </div>
                            )}
                        </div>
                        <div>
                        {[...Array(n)].map((x, i) => {
                             return <div class="grid-row-main">
                                <span class="row-head">{n-i}</span>
                                <div class="grid-row" key={i} >
                                    {[...Array(m)].map((y, j) =>{
                                        if(data[i][j] != null){
                                            return <div class="grid-col" style={{width: width*0.6 + '%', height: 0, paddingBottom: width*0.6 + '%', color:'white', background: '#2173BA'}}  key={j} onClick={(e) => this.selectJourney(i,j)}>
                                            <p class="col-head" style={{color:'white'}}>{data[i][j]}</p>
                                        </div>}
                                        else return <div class="grid-col" style={{width: width*0.6 + '%', height: 0, paddingBottom: width*0.6 + '%'}}  key={j} onClick={(e) => this.selectJourney(i,j)}>
                                            <p class="col-head">A</p>
                                        </div>}
                                    )}
                                </div>
                            </div>}
                        )}</div>
                    </div>
                </div>}
            </div>
        )
    }
}

export default Home
