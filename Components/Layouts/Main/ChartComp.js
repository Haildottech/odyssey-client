"use client"
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import moment from "moment";

const ChartComp = ({chartData}) => {

    useEffect(() => {
      let data = []
      chartData.result.invocies.RecPayGraph.forEach((x)=>{
        data.push({
            date:moment(x.createdAt).format("MMM-DD"),
            amount:x['Invoice_Transactions.amount']
        })
      })
      console.log(data);
      let categories = [];
      let dateTemp = [];
      data.forEach((x)=>{
        dateTemp.push(x.amount)
        categories.push(x.date)
      })
    }, [])
    
  const chartOptions = {
    options: {
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: ['Oct-24', 'Oct-22', 'Oct-20', 'Oct-18', 'Oct-15', 'Oct-14', 'Oct-13', 'Oct-12', 'Oct-11', 'Oct-10', 'Oct-04']
      }
    },
    series: [
      {
        name: "series-1",
        data: [6000, 5000, 1000, 7500, 1500, 1570, 671, 500, 9000, 5000, 7700]
      }
    ]
  };

  return(
    <div>
        <Chart
            options={chartOptions.options}
            series={chartOptions.series}
            type="bar"
            width="100%"
            height={"200%"}
        />
    </div>
  )
}


export default ChartComp