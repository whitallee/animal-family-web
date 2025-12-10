import { PencilIcon } from "lucide-react";
import { Button } from "./ui/button";

export function EditTaskButton() {
    return (
        <Button onClick={() => {
            console.log("Edit Task");
        }}>
            <PencilIcon />
            Edit Task
        </Button>
    )
}