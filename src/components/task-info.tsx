
import { Button, DatePicker, Form, Input } from "antd"
import TextArea from "antd/es/input/TextArea"
import { ChangeEvent, useEffect, useState } from "react"
import { useAppDispatch } from "./hooks";
import { addTaskInChildren, changeTask, deleteTask } from "./store/actions";
import { TaskType } from "../types";
import TaskPreview from "./task-preview";

type TaskInfoProps = {
    currentTaskData: TaskType
    onInfoClose: () => void
    showModal: (id: number) => void
    onMouseUp: () => void;
    onMouseDown: (taskId: number) => void;
    isMultiDeleteModOn: boolean;
    onDeleteMany: () => void;
}

function TaskInfo({ currentTaskData, isMultiDeleteModOn, onInfoClose, showModal, onMouseUp, onMouseDown, onDeleteMany }: TaskInfoProps) {
    const dispatch = useAppDispatch()

    const [taskName, setTaskName] = useState('')
    const [taskDescription, setTaskDescription] = useState('')
    const [date, setDate] = useState<Date | null>(null)
    const [tasks, setTasks] = useState<TaskType[]>([])
    const [isDataChanged, setIsDataChanged] = useState(false)

    useEffect(() => {
        setTaskName(currentTaskData.name)
        setTaskDescription(currentTaskData.description)
        setDate(currentTaskData.date)
        setTasks([...currentTaskData.tasks])
    }, [currentTaskData])

    function handleName(evt: ChangeEvent<HTMLInputElement>) {
        setTaskName(evt.target.value)
        setIsDataChanged(true)
    }

    function handleDescription(evt: ChangeEvent<HTMLTextAreaElement>) {
        setTaskDescription(evt.target.value)
        setIsDataChanged(true)
    }

    function handleDate(date: Date) {
        setDate(date)
        setIsDataChanged(true)
    }

    function handleButtonSave() {
        const task = {
            id: currentTaskData.id,
            name: taskName,
            description: taskDescription,
            date: date,
            tasks: currentTaskData.tasks,
        }
        dispatch(changeTask(task))
        setIsDataChanged(false)
        onInfoClose()
    }

    function handleButtonDelete() {
        dispatch(deleteTask(currentTaskData.id))
        onInfoClose()
    }

    function handleButtonAddSubTask() {
        dispatch(addTaskInChildren(currentTaskData.id))
    }

    return (
        <>
            <Form layout={'vertical'} autoComplete="off" onFinish={handleButtonSave}>
                <Form.Item required label="Название">
                    <Input value={taskName} onChange={handleName}></Input>
                </Form.Item>
                <Form.Item label="Описание">
                    <TextArea rows={4} value={taskDescription} onChange={handleDescription}></TextArea>
                </Form.Item>
                <Form.Item label="Дедлайн">
                    <DatePicker value={date} onChange={handleDate}></DatePicker>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" disabled={!isDataChanged} block type="primary">Сохранить изменения</Button>
                </Form.Item>
                <Button onClick={handleButtonDelete} danger>Удалить задачу</Button>
                <Button onClick={handleButtonAddSubTask} >Добавить подзадачу</Button>
                {isMultiDeleteModOn && <Button type="primary" danger onClick={onDeleteMany} >Удалить выбранные</Button>}
            </Form>
            {tasks.map((task) => <TaskPreview key={task.id} id={task.id} name={task.name} date={task.date} onClick={showModal} onMouseUp={onMouseUp} onMouseDown={onMouseDown}></TaskPreview>)}
        </>
    )
}

export default TaskInfo