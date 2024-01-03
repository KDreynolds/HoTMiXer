# HoTMiXer

HoTMiXer is a command-line tool designed to simplify the process of starting new web projects. It allows developers to quickly scaffold projects using the HTMX framework, coupled with a choice of popular backend technologies like Flask, Django, Gin, and Node.js.
Features

    Easy Scaffolding: Quickly set up a new HTMX project with a simple command.
    Multiple Backends: Supports various backend technologies including Flask, Django, Gin, and Node.js, with more to be added.
    HTMX Integration: Leverage the power of HTMX for dynamic, efficient web applications.

# Getting Started
## Prerequisites

    Python (for Flask)
    Go (for Gin)
    Node.js (for Node.js backend)

# Installation

Still in the very early stages of development.
Usage
Setting Up a Python Environment

    Create a Virtual Environment (Optional but Recommended)
        Navigate to your project directory in the terminal.
        Run python -m venv venv to create a virtual environment named venv.
        Activate the virtual environment:
            On Windows: .\venv\Scripts\activate
            On macOS/Linux: source venv/bin/activate

    Install Dependencies
        Ensure you are in the project directory where requirements.txt is located.
        Install the required Python packages by running pip install -r requirements.txt.


# Creating a New Project

To create a new HTMX project with a Flask backend, run the following command:

"hotmixer create myproject --backend flask"

run "hotmixer create myproject" and select flask as your backend option

Replace myproject with your desired project name and flask with the backend of your choice (flask/django/gin/nodejs).

# Contributing

Please contact me, KDReynolds, on twitter at @imyerf if you would like to contribute.
Areas needing work

Right now there are two main areas that need attention

    1. Add Django as a backend option. - Complete

    2. Add Laravel/PHP as a backend option.

    4. We will always be looking to add more backend technologies, if the one you want is not currently supported, contact me or open an issue.

    5. Hot-reloading would be really nice but need to think through how this would work with all the different backends.

# License

HoTMiXer is open-sourced under the MIT License. This license permits you to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, and to permit persons to whom the software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

# Acknowledgments

Mr. Carson Gross for making me a Co-CEO of HTMX

