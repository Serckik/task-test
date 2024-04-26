export type TaskType = {
    id: number,
    name: string,
    description: string,
    date: Date | null
    tasks: TaskType[]
}