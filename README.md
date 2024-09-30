> 1. Imports and Setup        
You imported necessary React functions (useState, useEffect, useRef) and the charting library (Line from react-chartjs-2).
There’s a list of cryptocurrency options (ETH/USDT, BNB/USDT, DOT/USDT) and time intervals (1 Minute, 3 Minutes, 5 Minutes).
> 2. Main Component (App)     
You keep track of which cryptocurrency and interval the user selects using useState.
chartData holds the data you’ll show on the chart, and chartDataRef helps keep the chart data for each coin separately.
> 3. Connecting to WebSocket      
useEffect is used to connect to Binance’s WebSocket to get live data for the selected cryptocurrency and interval.
When the user switches between cryptocurrencies, the app saves data in localStorage and loads it if it’s already saved.
> 4. Handling WebSocket Data      
When new data comes from Binance, you process it to update your chart.
handleWebSocketData adds this new data to your existing data, updates the chart, and saves it in localStorage.
> 5. Displaying the Chart       
You use the Line component to draw the chart using the data you’ve collected.
The data and options properties define how the chart looks, including showing the time on the X-axis and price values on the Y-axis.
> 6. Cleaning Up      
When you switch to a different cryptocurrency or interval, the WebSocket connection is closed (wsRef.current.close()) to avoid keeping unnecessary connections open.
