import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Modal } from "antd";
import { useAppDispatch, useAppSelector } from "./components/hooks";
import TaskPreview from "./components/task-preview";
import { useEffect, useState } from "react";
import TaskInfo from "./components/task-info";
import { TaskType } from "./types";
import { addTask, changeDeleteItems, deleteTask, loadTasks } from "./components/store/actions";

function App() {
  const dispatch = useAppDispatch()

  const tasks = useAppSelector((store) => store.tasks)
  const deleteItems = useAppSelector((store) => store.deleteIdItems)

  const [isLoaded, setIsLoaded] = useState(false)
  const [currentTask, setCurrentTask] = useState<TaskType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timerId, setTimerId] = useState<number>(0);
  const [isMultiDeleteModOn, setIsMultiDeleteModOn] = useState(false)

  useEffect(() => {
    const storedData = localStorage.getItem('tasks');
    if (storedData) {
      dispatch(loadTasks((JSON.parse(storedData))));
    }
    setIsLoaded(true)
  }, [])


  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    const selectedTask = findItemById(tasks, currentTask?.id || 0)
    setCurrentTask(selectedTask || null)
  }, [tasks])

  function showModal(id: number) {
    if (isMultiDeleteModOn) {
      const index = deleteItems.indexOf(id);
      const newDeletedItems = [...deleteItems]
      if (index !== -1) {
        newDeletedItems.splice(index, 1);
      } else {
        newDeletedItems.push(id);
      }
      dispatch(changeDeleteItems([...newDeletedItems]))
      if (newDeletedItems.length === 0) {
        setIsMultiDeleteModOn(false)
      }
      return
    };
    const selectedTask = findItemById(tasks, id)
    setCurrentTask(selectedTask || null)
    setIsModalOpen(true);
  };

  function findItemById(tasks: TaskType[], idToFind: number): TaskType | undefined {
    for (const item of tasks) {
      if (item.id === idToFind) {
        return item;
      }
      if (item.tasks) {
        const foundItem = findItemById(item.tasks, idToFind);
        if (foundItem) {
          return foundItem;
        }
      }
    }
    return undefined;
  }

  function handleCancel() {
    setIsMultiDeleteModOn(false)
    dispatch(changeDeleteItems([]))
    setIsModalOpen(false);
    setCurrentTask(null)
  };

  function addButtonTask() {
    dispatch(addTask())
  }

  function handleMouseDown() {
    const id = setTimeout(() => {
      setIsMultiDeleteModOn(true)
    }, 1000);
    setTimerId(id);
  };

  function handleMouseUp() {
    clearTimeout(timerId);
  };

  function deleteManyButton() {
    deleteItems.map((item) => {
      dispatch(deleteTask(item))
    })
    setIsMultiDeleteModOn(false)
    dispatch(changeDeleteItems([]))
  }

  return (
    <div>
      <Button style={{ marginBottom: 20 }} type="primary" onClick={addButtonTask} icon={<PlusOutlined />}>Добавить задачу</Button>
      {isMultiDeleteModOn && <Button onClick={deleteManyButton} style={{ marginLeft: 20 }} type="primary" danger>Удалить выбранные задачи</Button>}
      <Flex gap={20} wrap="wrap">
        {tasks.map((task) => <TaskPreview key={task.id} id={task.id} name={task.name} date={task.date} onClick={showModal} onMouseUp={handleMouseUp} onMouseDown={handleMouseDown} />)}
      </Flex>
      {currentTask && <Modal open={isModalOpen} onCancel={handleCancel} footer={[]}>
        <TaskInfo showModal={showModal} onInfoClose={handleCancel} currentTaskData={currentTask} onMouseUp={handleMouseUp} onMouseDown={handleMouseDown} isMultiDeleteModOn={isMultiDeleteModOn} onDeleteMany={deleteManyButton}></TaskInfo>
      </Modal>}
    </div>
  )
}

export default App

