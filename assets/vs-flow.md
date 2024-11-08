# Visual Studio Flow

## Introduction

This document is designed to provide both an overview and a guided tour of Visual Studio Flow,
with a focus on providing a comprehensive understanding of its capabilities without delving into intricate concepts.
Following a brief introduction to VS-Flow, an **interactive tour** is presented to help you grasp the internal logic behind creating a low-code application.

### What is Visual Studio Flow?

Visual Studio Flow represents a low-code ecosystem designed for creating applications,
with a particular emphasis on performance and flexibility.
Applications are constructed by piecing together pre-designed modules in a step-by-step
fashion.
Each module encapsulates a specific function or feature, they are connected in a
workflow.

<note level='warning'>
The term 'low-code' does not imply 'easy' when it comes to building complex applications.
Building complex applications, even with low-code tools,
demands expertise in software design.
</note>


<!--and a comprehensive understanding of the specific requirements and challenges associated with the project.
-->
<!--
Low-code solutions streamline the development process by reducing the need for extensive coding, making it accessible for users with varying levels of technical expertise.
However, it's important to understand that the term 'low-code' does not imply 'easy' when it comes to building complex applications.
Building complex applications, even with low-code tools, demands expertise in software design and a comprehensive understanding of the specific requirements and challenges associated with the project.
-->

### Key features

Notable features encompass:

*  **Browser-Based Application**: Visual Studio Flow operates directly within a web browser,
   eliminating the need for installations and allowing for easy sharing of environments.
*  **On-the-Fly Dependency Installation**: Developers have the flexibility to install dependencies directly
   from <a href='https://webpm.org' target='blank'>WebPm</a> as needed.
   This enables modules to autonomously incorporate and utilize dependencies, such as a complete Python interpreter.
*  **Robust Data Flow Management**: Central to the workflow engine in the management of dataflows. 
   Visual Studio Flow's follows reactive programming principles, and implements the 
   <a href="https://reactivex.io/" target="_blank">ReactiveX API</a>. 
   This ensures safety, performance, composability, and a well-established framework.

<!--
### Benefits

Advantages include:
*  **Swift Application Design**: Visual Studio Flow empowers both developers and non-developers to rapidly design applications.
*  **Insightful Application Understanding**: It offers an appealing view into the internal mechanics of an application, enhancing transparency.
*  **Extensibility at all Levels**: Visual Studio Flow can be extended comprehensively using plain JavaScript code, 
enabling customization and enhancements at various layers.
-->
