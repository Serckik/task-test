import { createAction } from "@reduxjs/toolkit";
import { TaskType } from "../../types";

export const tasks = createAction<TaskType[]>('task/getTasks');

export const loadTasks = createAction<TaskType[]>('task/loadTasks');

export const addTask = createAction('task/addTask');

export const changeTask = createAction<TaskType>('task/changeTask');

export const deleteTask = createAction<number>('task/deleteTask');

export const addTaskInChildren = createAction<number>('task/addTaskInChildren');

export const changeDeleteItems = createAction<number[]>('task/changeDeleteItems');