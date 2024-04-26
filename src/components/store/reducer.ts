import { createReducer } from '@reduxjs/toolkit';
import { TaskType } from '../../types';
import { addTask, addTaskInChildren, changeDeleteItems, changeTask, deleteTask, loadTasks } from './actions';

type InitialState = {
    tasks: TaskType[]
    deleteIdItems: number[]
}

const initialState: InitialState = {
    tasks: [{
        id: 0,
        name: 'Просто задача',
        description: 'Просто описание задачи',
        date: null,
        tasks: [{
            id: 1,
            name: 'Название',
            description: 'Описание',
            date: null,
            tasks: [],
        }],
    }],
    deleteIdItems: []
};

function findAndRemoveItem(items: TaskType[], idToRemove: number): TaskType[] {
    return items.reduce((acc: TaskType[], item: TaskType) => {
        if (item.id === idToRemove) {
            return acc;
        }
        if (item.tasks) {
            const updatedChildren = findAndRemoveItem(item.tasks, idToRemove);
            if (updatedChildren.length !== item.tasks.length) {
                return [...acc, { ...item, tasks: updatedChildren }];
            }
        }
        return [...acc, item];
    }, []);
}

function addItemToChildren(items: TaskType[], parentId: number, newItem: TaskType): TaskType[] {
    return items.map(item => {
        if (item.id === parentId && item.tasks) {
            item.tasks.push(newItem);
        } else if (item.tasks) {
            item.tasks = addItemToChildren(item.tasks, parentId, newItem);
        }
        return item;
    });
}

function getAllIds(items: TaskType[]): number[] {
    return items.reduce((acc: number[], item: TaskType) => {
        acc.push(item.id);
        if (item.tasks) {
            acc.push(...getAllIds(item.tasks));
        }
        return acc;
    }, []);
}

function updateItemById(items: TaskType[], idToUpdate: number, newData: Partial<TaskType>): TaskType[] {
    return items.map(item => {
        if (item.id === idToUpdate) {
            return { ...item, ...newData };
        }
        if (item.tasks) {
            return { ...item, tasks: updateItemById(item.tasks, idToUpdate, newData) };
        }
        return item;
    });
}

export const reducer = createReducer(initialState, (builder) => {
    builder
        .addCase(loadTasks, (state, action) => {
            state.tasks = action.payload;
        })
        .addCase(changeTask, (state, action) => {
            const tasks = state.tasks
            const newTasks = updateItemById(tasks, action.payload.id, action.payload);
            state.tasks = newTasks
        })
        .addCase(addTask, (state) => {
            const tasks = state.tasks
            const allIds = getAllIds(tasks);
            const uniqueId = Math.max(...allIds, 0) + 1;
            const newTask: TaskType = {
                id: uniqueId,
                name: 'Название задачи',
                description: 'Описание задачи',
                date: null,
                tasks: [],
            }
            tasks.push(newTask)
        })
        .addCase(addTaskInChildren, (state, action) => {
            const tasks = state.tasks
            const allIds = getAllIds(tasks);
            const uniqueId = Math.max(...allIds, 0) + 1;
            const newTask: TaskType = {
                id: uniqueId,
                name: 'Название задачи',
                description: 'Описание задачи',
                date: null,
                tasks: [],
            }
            state.tasks = addItemToChildren(tasks, action.payload, newTask)
        })
        .addCase(deleteTask, (state, action) => {
            const tasks = state.tasks
            const newTasks = findAndRemoveItem(tasks, action.payload)
            state.tasks = newTasks
        })
        .addCase(changeDeleteItems, (state, action) => {
            state.deleteIdItems = action.payload
        })
});