#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import fs from "fs";

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const packageJson = require('../package.json');


const todoFile = "./todo.json";

if (!fs.existsSync(todoFile)){
    fs.writeFileSync(todoFile, JSON.stringify([]));
}

let todos = JSON.parse(fs.readFileSync(todoFile, "utf-8") || "[]");

const saveTodos = () => {
    fs.writeFileSync(todoFile, JSON.stringify(todos, null, 2))
}

// commands

const addTodo = async (task) =>{
    const creation = new Date().toLocaleString();
    todos.push({
        "id": todos.length,
        "description": task, 
        "status": "todo",
        "createdAt": creation,
        "updatedAt": "-",
    })
    saveTodos()
    console.log(chalk.green("Task added successfully!"))
}

const listTodos = async () => {
    console.log(chalk.blueBright("Todos:"));
    todos.forEach((todo,index) => {
        const status = todo.status === "done" ? chalk.green(todo.status):(todo.status === "in-progress" ? chalk.yellow(todo.status):chalk.red(todo.status));
        console.log(`${index+1}. | id:${todo.id} | t: ${todo.description} | ${status} | c: ${chalk.gray(todo.createdAt)} | u:${chalk.gray(todo.updatedAt)}`)
    });
}

const markAsDone = async (todo_id) =>{
    const updation = new Date().toLocaleString();
    for (const t in todos) {
        if (todos[t].id === Number(todo_id)) {
            todos[t].status = "done";
            todos[t].updatedAt = updation;
            saveTodos()
            console.log(chalk.green("Task marked done!"))
            return
        }
    }
    console.log(chalk.red("Not in todos")) 
}

const markInProgress = async (todo_id) =>{
    const updation = new Date().toLocaleString();
    for (const t in todos) {
        if (todos[t].id === Number(todo_id)) {
            todos[t].status = "in-progress";
            todos[t].updatedAt = updation;
            saveTodos()
            console.log(chalk.green("Task marked in-progress!"))
            return
        }
    }
    console.log(chalk.red("Not in todos")) 
}

const updateTodo = async (todo_id,todo) =>{
    const updation = new Date().toLocaleString();
    for (const t in todos) {
        if (todos[t].id === Number(todo_id)) {
            if (todo){todos[t].description = todo};
            todos[t].updatedAt = updation;
            saveTodos()
            console.log(chalk.green("Task updated successfully!"))
            return
        }
    }
    console.log(chalk.red("Not in todos")) 
}

const deleteTodo = async (todo_id) =>{
    for (const t in todos) {
        if (todos[t].id === Number(todo_id)) {
            todos.splice(Number(t),1)
            saveTodos()
            console.log(chalk.green("Task deleted successfully!"))
            return
        }
    }
    console.log(chalk.red("Not in todos"))
}


// actions to do

const program = new Command();
program.version(packageJson.version)

program
.command("add <todo>")
.description("adds todo")
.action((todo)=>{
    addTodo(todo);
});

program
.command("update <todoid> <todo>")
.description("update todo by todo-id")
.action((todoid, todo)=>{
    updateTodo(todoid, todo);
});

program
.command("mark-as-done <todoid>")
.description("mark task as done")
.action((todoid)=>{
    markAsDone(todoid);
});

program
.command("mark-in-progress <todoid>")
.description("mark task in-progress")
.action((todoid)=>{
    markInProgress(todoid);
});

program
.command("delete <todoid>")
.description("deletes todo by id")
.action((todoid)=>{
    deleteTodo(todoid);
});

program
.command("show-todos")
.description("list all todos")
.action(()=>{
    listTodos();
});

program.parse(process.argv);