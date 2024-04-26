import { DeleteOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import Paragraph from "antd/es/typography/Paragraph";
import { deleteTask } from "./store/actions";
import { useAppDispatch, useAppSelector } from "./hooks";

const TaskBlockPreview = styled.div`
    padding: 10px;
    border: 1px solid gray;
`


type taskPreviewProps = {
    id: number,
    name: string;
    date: Date | null;
    onClick: (id: number) => void;
    onMouseUp: () => void;
    onMouseDown: (taskId: number) => void;
}

function TaskPreview({ id, name, date, onClick, onMouseUp, onMouseDown }: taskPreviewProps) {
    const dispatch = useAppDispatch()
    const deleteItems = useAppSelector((store) => store.deleteIdItems)
    const isDeleteHover = deleteItems.includes(id)

    const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', options);
        const [month, day, year] = formattedDate.split('/');
        return `${year}-${month}-${day}`;
    };

    function handleButtonDelete(evt: React.MouseEvent<HTMLSpanElement>, id: number) {
        evt.stopPropagation();
        dispatch(deleteTask(id))
    }

    return (
        <TaskBlockPreview style={{ backgroundColor: isDeleteHover ? '#ffb2b4' : '', cursor: 'pointer' }} onClick={() => onClick(id)} onMouseDown={() => onMouseDown(id)} onMouseUp={onMouseUp}>
            <DeleteOutlined onClick={(evt) => handleButtonDelete(evt, id)} style={{ color: 'red', marginLeft: '90%', cursor: 'pointer' }} />
            <Paragraph>{name}</Paragraph>
            <Paragraph>{date !== null ? formatDate(date.toString()) : 'Нет даты'}</Paragraph>
        </TaskBlockPreview >
    )
}

export default TaskPreview