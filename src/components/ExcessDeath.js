import React, {
    useEffect,
    useState,
    useRef,
    createRef,
    PureComponent,
  } from "react";
  import { VictoryChart,VictoryArea,VictoryTheme,VictoryVoronoiContainer,VictoryLabel, VictoryLine } from 'victory';
  import {Grid} from 'semantic-ui-react';

  export default function ExcessDeath(){
    return(
        <div>
            <VictoryChart 
            width={400}
            
            containerComponent={<VictoryVoronoiContainer   responsive={false}
            flyoutStyle={{ fill: "white" }}/>}

           >
           <VictoryLabel text="Missisipi"
        x={100} y={11}
        style={{fill:"black",fontSize: 20 }}
        textAnchor="end"
    />
            <VictoryLabel text="Average Monthly Excess Death"
        x={225} y={60}
        style={{fill:"#a45791"}}
        textAnchor="middle"
    />
        <VictoryArea
        domain={{y:[0,10]}}
      
          data={[
            { x: 1, y: 2, y0: 5 },
            { x: 2, y: 1, y0: 4 },
            { x: 3, y: 2, y0: 3 },
            { x: 4, y: 4, y0: 2 },
            { x: 5, y: 6, y0: 2 }
          ]}
          style={{
            data:{
                fill: "#cea3c3",  stroke: "#a45791",strokeOpacity:100,strokeWidth:5
            },
          }}
        />
      </VictoryChart>
      </div>
         

        
    )
  }