
# <icon target="cpp"></icon> C++ in Notebook

---

<localOnly></localOnly>


<note level="warning" title="First-time setup may take a while" icon="fas fa-hourglass-half" expandable="true"> 
**The first-time setup may take a few minutes**, as it installs a complete C++ runtime environment for code
execution. Subsequent runs only need to start the backend, which typically takes just a few seconds. 
</note>

This notebook demonstrates how to run **C++ code interactively** inside a notebook environment, 
and how to combine it with **JavaScript views** for visualization and parameter control.  

As a practical example, we’ll build a projectile motion simulator that:
- Performs the physics computation in C++  
- Passes the results to JavaScript  
- Visualizes the trajectory with interactive sliders and charts
- Recomputes dynamically whenever parameters are updated


---

## Setup

First, we need to configure a backend that can run C++ code.  
We install the `cpprun_backend`, which lets us send C++ source code for execution and capture the results.
The interpreter is installed with the library <ext-link target="armadillo">Armadillo</ext-link>,
allowing advanced numerical computations. 

<js-cell>
const cppRun = await installInterpreter({
    backend: 'cpprun_backend#^0.1.0',
    buildWith: { apt: 'libarmadillo-dev' },
    display,
    notification: true
})
</js-cell>

Details regarding the interpreter can be found <ext-link target="cpp-notebook.cpprun_backend">here</ext-link>.

---

## Writing C++ for Physics Simulation

Here we define a small C++ program to compute the trajectory of a projectile from its initial velocity and launch angle. 
The `Result` struct stores key values such as flight time, maximum height, range, and sampled positions over time.
The `compute` function performs the kinematic calculations and fills these values, while `serialize` converts part of 
the result into JSON for plotting in JavaScript.

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

Next, we add sliders so users can adjust the launch angle \\( \theta \\) (in degrees) and the initial velocity 
\\( v \\) (in meters per second).
We use `LabelRange` views from <cross-link target="cpp-notebook.utils.label-range">here</cross-link>, 
which provide labeled sliders that emit observable values (`value$`).  


<js-cell>

const { LabelRange } = await load("/cpp-notebook/code-utils");

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

The variables angle0 and v0 are reactive: their values update as the sliders move, and any dependent computation will 
automatically re-run.

---

## Running the Simulation


Now we connect the slider inputs to the C++ function `compute`.
The values of `angle0` and `v0` are automatically injected into the code cell, where we call `compute(v0, angle0)` 
to generate a trajectory. 
The result is then **serialized** to be captured as output so it can be accessed by the JavaScript frontend for 
visualization, while the flight time is printed to the console.


<interpreter-cell interpreter="cppRun" language="cpp" captured-in="angle0 v0" captured-out="serialized">
auto r = compute(v0, angle0);
std::cout << "Time of flight (s):" << r.time_of_flight << std::endl;
auto serialized = serialize(r);
</interpreter-cell>

<note level="hint" title="Reactivity Explanation" icon='fas fa-bolt' expandable="true"> 
This cell is **reactive** because it captures the variables `angle0` and `v0`, which emit new values whenever 
their sliders are adjusted.

**Reactive cells** automatically re-execute whenever any of their captured variables change.  
In other words, each time a slider (or any other reactive input) produces a new value, the cell detects the 
change and reruns the code. Consequently, the captured output variable `serialized` is also reactive. 
It can be used in subsequent cells to make them reactive.

This ensures the simulation always reflects the latest input values without manual re-execution.  
It also illustrates why heavy computations should reside in static cells: reactive cells run frequently, so keeping them lightweight ensures a smooth, responsive experience.
</note>

---

## Visualizing the Trajectory

Finally, we plot the computed trajectory with a chart view.
`ChartView` renders the (x, y) pairs as a curve, with labeled axes for distance and height.

The angle and velocity sliders are overlaid in the top-right corner, making the simulation interactive: 
as you drag the sliders, the trajectory updates in real time.


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


This notebook combines **C++** for fast computation, **JavaScript** for interactive visualization, and a 
**reactive runtime** that links them seamlessly. Inputs and outputs update automatically, and results flow
directly to the frontend for immediate visualization. The entire environment is fully encapsulated, 
making simulations reproducible on any machine without manual setup. 
In short, it delivers **speed, interactivity, and reproducibility** in a single notebook.
