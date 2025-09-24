
# C++ in Notebook

---

<note level="warning" title="Not available online"> 
This page requires execution through the <ext-link target="cpp-notebook.w3nest">W3Nest</ext-link> **local server**
(**it cannot be run directly from `https://w3nest.org`**).  

The server automatically installs the custom backend needed to compile and run C++ code within the notebook.  

⚠️ **First-time setup may take some time** because the backend installs a full C++ runtime environment.
On later runs, only starting the backend is required, which usually takes just a couple of seconds.  
</note>

This notebook demonstrates how to run **C++ code interactively** inside a notebook environment, 
and how to combine it with **JavaScript views** for visualization and parameter control.  

We’ll build a simple **projectile motion simulation**:  
- Perform the physics computation in C++  
- Pass results to JavaScript  
- Display the trajectory with interactive sliders and charts  

The notebook is **reactive**: changing parameters such as launch angle or velocity automatically updates the C++ 
computation and redraws the trajectory in real time.  


> **Note:** The C++ interpreter in this notebook is linked with custom packages such as **Armadillo**,
>  allowing advanced numerical computations while maintaining proper **encapsulation for reproducibility**.


---

## Setup

First, we need to configure a backend that can run C++ code.  
We install the `cpprun_backend`, which lets us send C++ source code for execution and capture the results.


<js-cell>
const { installWithUI } = await webpm.installViewsModule()
const { notifyInstall } = await load("/cpp-notebook/code-utils"); 

const { cppRun } = await installWithUI({
    backends: {
        modules:['cpprun_backend#^0.1.0 as cppRun'],
        configurations: {
            cpprun_backend: {
                build: {
                    // Install Armadillo for advanced numerical computations
                    apt: 'libarmadillo-dev'
                }
            }
        }
    },
    display: (view) => {
        display(view)
        notifyInstall('warning', view)
    }
})

</js-cell>

<note level="hint" title="Custom apt packages & pre" icon='fas fa-bolt' expandable="true">
When you change the apt build configuration (for example, to add a library like Armadillo), only the 
**new package layer** is installed. You do **not** need to reinstall the full C++ interpreter from scratch.  

✅ Once the interpreter has been installed once, adding or modifying packages is much faster when it comes 
to the first time install.
</note>

---

## Writing C++ for Physics Simulation

Here we define a small C++ program to compute the trajectory of a projectile given its initial velocity and launch angle.

- `Result` is a struct that stores:
  - Time of flight
  - Maximum height
  - Range of the projectile
  - Arrays of positions `(x, y)` and times `t`

- `compute()` does the math:
  - Converts the launch angle from degrees to radians
  - Calculates flight time using kinematics
  - Fills vectors with positions of the projectile at sampled times
  - Returns everything in a `Result`

- `serialize()` transforms part of the result into JSON so it can be passed back to JavaScript for plotting.


<interpreter-cell interpreter="cppRun" language="cpp">
#include <cmath>
#include <vector>
#include <iostream>
#include <armadillo>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

struct Result {
    double time_of_flight;
    double max_height;
    double range_projectile;
    std::vector<double> x;
    std::vector<double> y;
    std::vector<double> t;
};

std::unique_ptr<json> serialize(const Result& r) {
    return std::make_unique<json>(json({ {"x", r.x}, {"y", r.y} }));
}

Result compute(double v0, double angle0_deg) {
    const double g = 9.81;
    double theta = angle0_deg * arma::datum::pi / 180.0;
    double t_flight = 2.0 * v0 * std::sin(theta) / g;

    arma::vec t = arma::linspace(0, t_flight, 100);
    arma::vec x = v0 * std::cos(theta) * t;
    arma::vec y = v0 * std::sin(theta) * t - 0.5 * g * arma::square(t);

    return Result{
        t_flight,
        (v0 * v0 * std::pow(std::sin(theta), 2)) / (2.0 * g),
        (v0 * v0 * std::sin(2.0 * theta)) / g,
        arma::conv_to<std::vector<double>>::from(x),
        arma::conv_to<std::vector<double>>::from(y),
        arma::conv_to<std::vector<double>>::from(t)
    };
}
</interpreter-cell>


<note level="hint" title="Compilation Optimization" icon='fas fa-bolt' expandable="true">
This cell contains the compiled C++ code that only needs to be defined once.
Future reactive cells can then use these definitions without recompiling.  

As a rule of thumb, try to put as much C++ code as possible into static cells.
This way, reactive cells—which may be executed multiple times—remain lightweight and fast.
</note>

---

## Interactive Controls

Next, we create UI controls so users can interactively set:
- The launch angle \\( \theta \\) in degrees
- The initial velocity \\( v \\) in meters per second  

We use `LabelRange` views, which provide labeled sliders that emit observable values (`value$`).  
These values will be captured and passed into the C++ function.


<js-cell>

const { LabelRange } = await load("/cpp-notebook/code-utils");

const { rxjs } = await webpm.install({
    esm:[ 'rxjs#^7.8.2 as rxjs' ]
})
const angleView = LabelRange({
    text: String.raw `\(\theta \ (^\circ) \)`, min: 0, max: 90
});
const velocityView = LabelRange({
    text: String.raw `\(\mathbf{v} \ (m/s) \)`, min: 0, max: 50
});
display(angleView)
display(velocityView)

const angle0 = angleView.value$
const v0 = velocityView.value$
</js-cell>

---

## Running the Simulation

Now we connect the sliders to the C++ function:

- The values of `angle0` and `v0` are automatically injected into the C++ code cell.
- We call `compute(v0, angle0)` to generate a projectile trajectory.
- The result is serialized for visualization, while also printing the computed flight time.


<interpreter-cell interpreter="cppRun" language="cpp" captured-in="angle0 v0" captured-out="serialized">
auto r = compute(v0, angle0);
std::cout << "Time of flight:" << r.time_of_flight << std::endl;
auto serialized = serialize(r);
</interpreter-cell>

<note level="hint" title="Reactivity Explanation" icon='fas fa-bolt' expandable="true"> 
This cell is **reactive** because it captures the variables `angle0` and `v0`, which emit new values whenever 
their sliders are adjusted.

Reactive cells automatically re-execute whenever any of their captured variables change.  
In other words, each time a slider (or any other reactive input) produces a new value, the cell detects the 
change and reruns the code. Consequently, the captured output variable `serialized` is also reactive. 
It can be used in subsequent cells to make them reactive.

This ensures the simulation always reflects the latest input values without manual re-execution.  
It also illustrates why heavy computations should reside in static cells: reactive cells run frequently, so keeping them lightweight ensures a smooth, responsive experience.
</note>

---

## Visualizing the Trajectory

Finally, we plot the computed trajectory using a chart view.

- `ChartView` renders the `(x, y)` pairs as a curve.
- Axes are labeled with distance (horizontal) and height (vertical).
- The angle and velocity sliders are placed in the top-right corner, overlaid on the chart.

This creates an interactive simulation: as you drag the sliders, the projectile’s trajectory updates in real time.


<js-cell>
const { ChartView } = await load("/cpp-notebook/code-utils");

const chartView = await ChartView({
    data: serialized,
    xScale: { title:{ display: true, text: 'Distance (m)'}, min:0, max:300},
    yScale: { title:{ display: true, text: 'Height (m)'}, min:0, max:150}
})

const topRight = {
    tag: 'div',
    class: 'bg-light p-2 border rounded',
    children: [
        angleView,
        velocityView
    ]
}
const superposedLayout = Views.Layouts.superposed({
    content:chartView,
    topRight
})
display(superposedLayout)
</js-cell>

---

## Summary

We combined:
- C++ for high-performance numeric computation
- JavaScript for interactivity and visualization
- A reactive notebook runtime that connects them seamlessly
