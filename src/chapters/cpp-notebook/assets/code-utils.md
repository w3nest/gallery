# Code Utils

## A 2D Chart Helper

The following cell defines a function to render a scatter plot using the <ext-link target='chartjs'>Chart.js</ext-link>
library.

**Function overview**

*  **Input Parameters:**
    *  **`data`**: This parameter can be either an object or an Observable. 
       If it's an object, it must contain x and y attributes, where both are iterable collections of numbers. 
       If it's an Observable, it should emit such objects. 
    *  **`xScale`** and **`yScale`**: The configuration for the x and y scales as required by Chart.js.

*  **Output:** The function returns a Virtual DOM structure encapsulating the chart. 
   If data is provided as an observable, the chart dynamically updates to reflect new data points as they are emitted 
   from the observable.

<js-cell>
const ChartView = async ({data, xScale, yScale}) => {
    const { chartJs, rxjs } = await webpm.install({
        esm:['chart.js#^3.9.1 as chartJs', 'rxjs#^7.5.6 as rxjs'],
    })
    const data$ = data instanceof rxjs.Observable ? data : rxjs.of(data)
    chartJs.registerables.forEach((plot)=>chartJs.Chart.register(plot))
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins:{
            legend: {
                display: false
        }},
        scales: { 
            x: xScale,
            y: yScale
        }
    }
    return {
        tag: 'div',
        class:`border text-center rounded p-2 flex-grow-1 w-100 h-100`,
        children: [
            {
                tag:'canvas',
                class:'mx-auto w-75 h-100',
                connectedCallback: (htmlElement) => {
                    const plot = new chartJs.Chart(
                        htmlElement, 
                        { 
                            type: 'scatter',
                            data: { datasets: [{}] },
                            options: chartOptions
                        }
                    )
                    htmlElement.ownSubscriptions(
                        data$.subscribe( ({x,y}) => {
                            const serie = Array.from({length: x.length}, (_,i) => ({x: x[i], y: y[i]}))
                            plot.data.datasets[0].data = serie
                            plot.update()
                        })
                    )
                    htmlElement.onDisconnected = () => plot.clear()
                },
                disconnectedCallback: (htmlElement) =>  htmlElement.onDisconnected()
            }
        ]
    }
}
</js-cell>

---

## Label Range Input

This cell defines the `LabelRange` component, which creates a labeled range slider for user input.

**Function Overview:**
- **Input Parameters:**
   - `text`: The label text displayed beside the slider.
   - `min` and `max`: The minimum and maximum values for the range slider.
   - `labelWidth` (optional): Specifies the width of the label.
- **Output:** Returns a Virtual DOM object containing a text label and a range slider, aligned horizontally. The `value$` observable emits the current value of the slider.

<js-cell>
const LabelRange = ({ text, min, max, labelWidth }) => {
    const range = new Views.Range({ min, max,  emitDrag: false});
    return {
        tag: 'div',
        class: 'd-flex align-items-center',
        children: [
            new Views.Text(text, { style: { width: labelWidth || '50px' } }),
            Views.mx2,
            range
        ],
        value$: range.value$
    };
};
</js-cell>
