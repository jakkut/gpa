import React from "react";

import "./App.css";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.logCourseInfo = this.logCourseInfo.bind(this);
        this.applyGrades = this.applyGrades.bind(this);
        this.calculateGPA = this.calculateGPA.bind(this);
        this.addNewCourse = this.addNewCourse.bind(this);

        this.state = {
            courses: [                     
                <Course 
                onChange={this.logCourseInfo} //takes the grade information from the Course component and throws it to the state to do calculations
                key="course-0"
                id={0}
                />
            ],
            courseInfo: []
        }

        this.state = {
            ...this.state,
            totalPoints: null,
            totalCredits: null,
            totalGPA: null,
        }
    }

    logCourseInfo(points, credits, id) {
        var courseInfo = this.state.courseInfo;
        courseInfo[id] = [points, credits];

        this.setState({ courseInfo: courseInfo}, () => this.applyGrades());
    }

    applyGrades() {
        var totalPoints = 0;
        var totalCredits = 0;

        for (var i = 0; i < this.state.courseInfo.length; i++) {
            if (this.state.courseInfo[i] === undefined)
                continue;

            totalPoints = totalPoints + this.state.courseInfo[i][0];
            totalCredits = totalCredits + this.state.courseInfo[i][1];
        }

        console.log(totalPoints, totalCredits)
        
        this.setState({ 
            totalPoints: totalPoints,
            totalCredits: totalCredits 
        }, () => this.calculateGPA());
    }

    calculateGPA() {
        const points = this.state.totalPoints; const credits = this.state.totalCredits;
        const GPA = points / credits;
        this.setState({ GPA: GPA.toFixed(3) });
    }

    addNewCourse() {
        this.setState(state => {
            const courseComponent =                
                <Course 
                onChange={this.logCourseInfo} //takes the grade information from the Course component and throws it to the state to do calculations
                key={"course-" + state.courses.length}
                id={state.courses.length}
                />
            const courses = [...state.courses, courseComponent];
            
            return {
                courses
            }
        });
    }

    render() {
        return (
            <div className="App">
                <h1>TSA Unofficial GPA Calculator</h1>
                <table className="center">
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Grade</th>
                            <th>Credits</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.courses}
                    </tbody>
                </table>
                <button onClick={this.addNewCourse}>Add New Course</button>
                <h3>Your GPA is</h3>
                <h1>{this.state.GPA}</h1>
            </div>
        );
    }
}

class Course extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            points: null,
            credits: null,
            type: null,
        }

        this.handleGradeChange = this.handleGradeChange.bind(this);
        this.handleCreditChange = this.handleCreditChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.passInfo = this.passInfo.bind(this);
    }

    passInfo () {
        if (this.state.points == null || isNaN(this.state.credits) || this.state.credits === 0 || this.state.credits === null || this.state.type == null)
            return;

        var points = this.state.points; const credits = this.state.credits; const type = this.state.type;

        if (points <= 1.3) 
            points = points + 0;

        else {
            switch(type) {
                default:
                    break;

                case "Regular":
                    break;
    
                case "Honors":
                        points = points + 0.7
                    break;
    
                case "CCP":
                    if(points === 4.3)
                        points = 5;
                    else
                        points = points + 1;
                    break;
            }
        }

        console.log(points)

        const weighted = points * credits;
        
        this.props.onChange(weighted, this.state.credits, this.props.id);
    }

    handleGradeChange (event) {
        this.setState({ points : parseFloat(event.target.value)}, () => this.passInfo()); //takes the grade information on change and computes it
    }

    handleCreditChange (event) {
        const credits = parseFloat(event.target.value);
        this.setState({ credits : credits }, () => this.passInfo()); //takes the credit information on change and computes it
    }

    handleTypeChange (event) {
        this.setState({ type : event.target.value }, () => this.passInfo()); //takes the course type information on change and computes it
    }

    render() {
        return (
            <tr>
                <td>
                    <input type="text"></input>
                </td>
                <td>
                    <select onInput={this.handleGradeChange} defaultValue="">
                        <option disabled hidden style={{display: "none"}} value=""></option>
                        <option value="4.3">A+</option>
                        <option value="4.0">A</option>
                        <option value="3.7">A-</option>
                        <option value="3.3">B+</option>
                        <option value="3">B</option>
                        <option value="2.7">B-</option>
                        <option value="2.3">C+</option>
                        <option value="2">C</option>
                        <option value="1.7">C-</option>
                        <option value="1.3">D+</option>
                        <option value="1">D</option>
                        <option value="0.7">D-</option>
                        <option value="0">F</option>
                    </select>
                </td>
                <td>
                    <input type="text" onChange={this.handleCreditChange}/>
                </td>
                <td>
                    <select onInput={this.handleTypeChange} defaultValue="">
                        <option disabled hidden style={{display: "none"}} value=""></option>
                        <option value="Regular">Regular</option>
                        <option value="Honors">Honors</option>
                        <option value="CCP">CCP</option>
                    </select>
                </td>
            </tr>
        )
    }
}

export default App;
